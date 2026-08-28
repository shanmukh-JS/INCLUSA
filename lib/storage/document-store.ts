import {
  AccessibilityProfile,
  AccessibilityReport,
  ChatMessage,
  DashboardStats,
  DocumentAnalysis,
} from '@/types';
import { SAMPLE_DOCUMENTS } from '../mock/sample-documents';

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

  // --- ANALYSES ---

  public getAllAnalyses(): DocumentAnalysis[] {
    if (this.isClient()) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ANALYSES);
        if (raw) {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        console.error('Error reading analyses from localStorage', e);
      }
    }
    return Array.from(memoryStore.analyses.values());
  }

  public getAnalysisById(id: string): DocumentAnalysis | undefined {
    const all = this.getAllAnalyses();
    return all.find((a) => a.id === id);
  }

  public saveAnalysis(analysis: DocumentAnalysis): void {
    memoryStore.analyses.set(analysis.id, analysis);

    if (this.isClient()) {
      try {
        const all = this.getAllAnalyses();
        const existingIdx = all.findIndex((a) => a.id === analysis.id);
        if (existingIdx >= 0) {
          all[existingIdx] = analysis;
        } else {
          all.unshift(analysis);
        }
        localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(all));
      } catch (e) {
        console.error('Error saving analysis to localStorage', e);
      }
    }
  }

  public deleteAnalysis(id: string): void {
    memoryStore.analyses.delete(id);

    if (this.isClient()) {
      try {
        const all = this.getAllAnalyses().filter((a) => a.id !== id);
        localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(all));
      } catch (e) {
        console.error('Error deleting analysis from localStorage', e);
      }
    }
  }

  // --- DASHBOARD METRICS ---

  public getDashboardStats(): DashboardStats {
    const all = this.getAllAnalyses();
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

  // --- PROFILES ---

  public getAllProfiles(): AccessibilityProfile[] {
    if (this.isClient()) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error reading profiles from localStorage', e);
      }
    }
    return Array.from(memoryStore.profiles.values());
  }

  public getActiveProfile(): AccessibilityProfile {
    const profiles = this.getAllProfiles();
    let activeId = memoryStore.activeProfileId;

    if (this.isClient()) {
      try {
        const storedId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
        if (storedId) activeId = storedId;
      } catch (e) {
        console.error('Error reading active profile id', e);
      }
    }

    const found = profiles.find((p) => p.id === activeId);
    return found || profiles[0] || DEFAULT_ACCESSIBILITY_PROFILE;
  }

  public saveProfile(profile: AccessibilityProfile): void {
    memoryStore.profiles.set(profile.id, profile);

    if (this.isClient()) {
      try {
        const profiles = this.getAllProfiles();
        const idx = profiles.findIndex((p) => p.id === profile.id);
        if (idx >= 0) {
          profiles[idx] = profile;
        } else {
          profiles.push(profile);
        }
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
      } catch (e) {
        console.error('Error saving profile to localStorage', e);
      }
    }
  }

  public setActiveProfileId(id: string): void {
    memoryStore.activeProfileId = id;
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
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
