import {
  AccessibilityProfile,
  AccessibilityReport,
  ChatMessage,
  DashboardStats,
  DocumentAnalysis,
} from '@/types';
import { SAMPLE_DOCUMENTS } from '../mock/sample-documents';
import {
  saveAnalysisToSupabase,
  deleteAnalysisFromSupabase,
  fetchAnalysesFromSupabase,
  isSupabaseConfigured,
} from '../supabase/db';

const STORAGE_KEYS = {
  ANALYSES: 'inclusa_analyses_v1',
  PROFILES: 'inclusa_profiles_v1',
  ACTIVE_PROFILE_ID: 'inclusa_active_profile_id_v1',
  CHAT_MESSAGES: 'inclusa_chat_messages_v1',
  REPORTS: 'inclusa_reports_v1',
};

export const DEFAULT_ACCESSIBILITY_PROFILE: AccessibilityProfile = {
  id: 'profile_default_telugu_vision',
  name: 'Vision & Telugu Regional Profile',
  isDefault: true,
  vision: {
    blind: false,
    lowVision: true,
    colorVisionDeficiency: 'none',
    highContrast: false,
    screenReaderUser: true,
    largeText: true,
  },
  hearing: {
    deaf: false,
    hardOfHearing: false,
    preferCaptions: true,
    preferTranscripts: true,
    preferVisualCues: true,
  },
  cognitive: {
    readingDifficulty: true,
    dyslexiaFriendly: false,
    simplifiedLanguage: true,
    shortSummaries: true,
    stepByStepExplanations: true,
    reduceClutter: true,
  },
  language: {
    primaryLanguage: 'te', // Telugu
    secondaryLanguage: 'hi', // Hindi
    autoTranslate: true,
    preserveTechnicalTerms: true,
  },
  output: {
    audioDescriptions: true,
    textSummaries: true,
    accessiblePdf: true,
    screenReaderOptimized: true,
    dyslexiaFormatted: false,
    includeCaptions: true,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// In-memory fallback for SSR and server-side operations
const memoryStore: {
  analyses: Map<string, DocumentAnalysis>;
  profiles: Map<string, AccessibilityProfile>;
  chatMessages: Map<string, ChatMessage[]>;
  reports: Map<string, AccessibilityReport>;
  activeProfileId: string;
} = {
  analyses: new Map(),
  profiles: new Map([[DEFAULT_ACCESSIBILITY_PROFILE.id, DEFAULT_ACCESSIBILITY_PROFILE]]),
  chatMessages: new Map(),
  reports: new Map(),
  activeProfileId: DEFAULT_ACCESSIBILITY_PROFILE.id,
};

class DocumentStore {
  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  // --- ANALYSES (User-Isolated) ---

  public getAllAnalyses(userId?: string): DocumentAnalysis[] {
    let all: DocumentAnalysis[] = [];
    if (this.isClient()) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ANALYSES);
        if (raw) {
          const parsed = JSON.parse(raw);
          all = Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        console.error('Error reading analyses from localStorage', e);
      }
    } else {
      all = Array.from(memoryStore.analyses.values());
    }

    if (userId) {
      return all.filter((a) => !a.userId || a.userId === userId || a.id.startsWith('demo-'));
    }
    return all;
  }

  public getAnalysisById(id: string, userId?: string): DocumentAnalysis | undefined {
    const all = this.getAllAnalyses();
    const doc = all.find((a) => a.id === id);
    if (!doc) return undefined;

    // IDOR Protection: Check user ownership unless demo document
    if (userId && doc.userId && doc.userId !== userId && !doc.id.startsWith('demo-')) {
      console.warn(`[IDOR Protected] User ${userId} attempted to access document ${id} owned by ${doc.userId}`);
      return undefined;
    }

    return doc;
  }

  public saveAnalysis(analysis: DocumentAnalysis, userId?: string): void {
    const scopedAnalysis: DocumentAnalysis = {
      ...analysis,
      userId: userId || analysis.userId || 'user_default_inclusa_owner',
      updatedAt: new Date().toISOString(),
    };

    memoryStore.analyses.set(scopedAnalysis.id, scopedAnalysis);

    if (this.isClient()) {
      try {
        const all = this.getAllAnalyses();
        const existingIdx = all.findIndex((a) => a.id === scopedAnalysis.id);
        if (existingIdx >= 0) {
          all[existingIdx] = scopedAnalysis;
        } else {
          all.unshift(scopedAnalysis);
        }
        localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(all));
      } catch (e) {
        console.error('Error saving analysis to localStorage', e);
      }
    }

    // Async sync to Supabase Cloud if credentials exist
    if (typeof window !== 'undefined') {
      saveAnalysisToSupabase(scopedAnalysis).catch((err) => {
        console.warn('Supabase cloud sync deferred:', err);
      });
    }
  }

  public deleteAnalysis(id: string, userId?: string): boolean {
    const existing = this.getAnalysisById(id, userId);
    if (!existing) {
      return false;
    }

    memoryStore.analyses.delete(id);

    if (this.isClient()) {
      try {
        const all = this.getAllAnalyses().filter((a) => a.id !== id);
        localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(all));
      } catch (e) {
        console.error('Error deleting analysis from localStorage', e);
      }
    }

    // Async delete from Supabase Cloud
    if (typeof window !== 'undefined') {
      deleteAnalysisFromSupabase(id).catch((err) => {
        console.warn('Supabase delete sync deferred:', err);
      });
    }
    return true;
  }

  /**
   * Pull all historical analyses from Supabase and merge with local storage
   */
  public async syncWithSupabaseCloud(userId?: string): Promise<{ count: number }> {
    try {
      const cloudAnalyses = await fetchAnalysesFromSupabase();
      if (cloudAnalyses && cloudAnalyses.length > 0) {
        const local = this.getAllAnalyses();
        const localMap = new Map(local.map((a) => [a.id, a]));
        
        // Merge cloud records
        cloudAnalyses.forEach((ca) => {
          if (!localMap.has(ca.id)) {
            local.push(ca);
          }
        });

        if (this.isClient()) {
          localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(local));
        }
        return { count: cloudAnalyses.length };
      }
    } catch (e) {
      console.error('Failed to sync with Supabase cloud:', e);
    }
    return { count: 0 };
  }

  // --- DASHBOARD METRICS ---

  public getDashboardStats(userId?: string): DashboardStats {
    const all = this.getAllAnalyses(userId);
    if (all.length === 0) {
      return {
        totalAnalyses: 0,
        averageScore: 0,
        averageImprovement: 0,
        issuesDetectedTotal: 0,
        issuesResolvedTotal: 0,
        documentsImprovedCount: 0,
      };
    }

    let scoreSum = 0;
    let improvementSum = 0;
    let detectedSum = 0;
    let resolvedSum = 0;
    let improvedDocs = 0;

    for (const a of all) {
      const initial = a.initialScore?.overallScore || 0;
      const final = a.finalScore?.overallScore || a.verification?.afterScore.overallScore || initial;
      scoreSum += final;
      
      const delta = final - initial;
      if (delta > 0) {
        improvementSum += delta;
        improvedDocs += 1;
      }

      detectedSum += a.issues?.length || a.verification?.totalIssuesDetected || 0;
      resolvedSum += a.verification?.issuesResolved || 0;
    }

    return {
      totalAnalyses: all.length,
      averageScore: Math.round(scoreSum / all.length),
      averageImprovement: improvedDocs > 0 ? Math.round(improvementSum / improvedDocs) : 0,
      issuesDetectedTotal: detectedSum,
      issuesResolvedTotal: resolvedSum,
      documentsImprovedCount: improvedDocs,
    };
  }

  // --- PROFILES (User-Scoped) ---

  public getAllProfiles(userId?: string): AccessibilityProfile[] {
    let profiles: AccessibilityProfile[] = [];
    if (this.isClient()) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            profiles = parsed;
          }
        }
      } catch (e) {
        console.error('Error reading profiles from localStorage', e);
      }
    } else {
      profiles = Array.from(memoryStore.profiles.values());
    }

    if (profiles.length === 0) {
      profiles = [DEFAULT_ACCESSIBILITY_PROFILE];
    }

    if (userId) {
      return profiles.filter((p) => !p.userId || p.userId === userId || p.id === DEFAULT_ACCESSIBILITY_PROFILE.id);
    }
    return profiles;
  }

  public getActiveProfile(userId?: string): AccessibilityProfile {
    const profiles = this.getAllProfiles(userId);
    let activeId = memoryStore.activeProfileId;

    if (this.isClient()) {
      try {
        const storedId = localStorage.getItem(`${STORAGE_KEYS.ACTIVE_PROFILE_ID}_${userId || 'default'}`);
        if (storedId) activeId = storedId;
      } catch (e) {
        console.error('Error reading active profile id', e);
      }
    }

    const found = profiles.find((p) => p.id === activeId);
    return found || profiles[0] || DEFAULT_ACCESSIBILITY_PROFILE;
  }

  public saveProfile(profile: AccessibilityProfile, userId?: string): void {
    const scopedProfile: AccessibilityProfile = {
      ...profile,
      userId: userId || profile.userId || 'user_default_inclusa_owner',
      updatedAt: new Date().toISOString(),
    };

    memoryStore.profiles.set(scopedProfile.id, scopedProfile);

    if (this.isClient()) {
      try {
        const profiles = this.getAllProfiles();
        const idx = profiles.findIndex((p) => p.id === scopedProfile.id);
        if (idx >= 0) {
          profiles[idx] = scopedProfile;
        } else {
          profiles.push(scopedProfile);
        }
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
      } catch (e) {
        console.error('Error saving profile to localStorage', e);
      }
    }
  }

  public setActiveProfileId(id: string, userId?: string): void {
    memoryStore.activeProfileId = id;
    if (this.isClient()) {
      try {
        localStorage.setItem(`${STORAGE_KEYS.ACTIVE_PROFILE_ID}_${userId || 'default'}`, id);
      } catch (e) {
        console.error('Error setting active profile id', e);
      }
    }
  }

  // --- CHAT MESSAGES ---

  public getChatMessages(documentId: string): ChatMessage[] {
    if (this.isClient()) {
      try {
        const raw = localStorage.getItem(`${STORAGE_KEYS.CHAT_MESSAGES}_${documentId}`);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.error('Error reading chat messages', e);
      }
    }
    return memoryStore.chatMessages.get(documentId) || [];
  }

  public saveChatMessage(msg: ChatMessage): void {
    const docId = msg.documentId;
    const existing = this.getChatMessages(docId);
    existing.push(msg);
    memoryStore.chatMessages.set(docId, existing);

    if (this.isClient()) {
      try {
        localStorage.setItem(`${STORAGE_KEYS.CHAT_MESSAGES}_${docId}`, JSON.stringify(existing));
      } catch (e) {
        console.error('Error saving chat message', e);
      }
    }
  }

  // --- REPORTS ---

  public getReportById(id: string): AccessibilityReport | undefined {
    if (this.isClient()) {
      try {
        const raw = localStorage.getItem(`${STORAGE_KEYS.REPORTS}_${id}`);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.error('Error reading report', e);
      }
    }
    return memoryStore.reports.get(id);
  }

  public saveReport(report: AccessibilityReport): void {
    memoryStore.reports.set(report.id, report);
    if (this.isClient()) {
      try {
        localStorage.setItem(`${STORAGE_KEYS.REPORTS}_${report.id}`, JSON.stringify(report));
      } catch (e) {
        console.error('Error saving report', e);
      }
    }
  }
}

export const documentStore = new DocumentStore();
