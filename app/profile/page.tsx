'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { documentStore, DEFAULT_ACCESSIBILITY_PROFILE } from '@/lib/storage/document-store';
import { AccessibilityProfile } from '@/types';
import {
  UserCheck,
  Eye,
  Volume2,
  Brain,
  Languages,
  Save,
  Check,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { InclusaMascot } from '@/components/ui/InclusaMascot';

import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<AccessibilityProfile>(DEFAULT_ACCESSIBILITY_PROFILE);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.id) {
      setProfile(documentStore.getActiveProfile(user.id));
    }
  }, [user?.id]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    documentStore.saveProfile(profile, user.id);
    documentStore.setActiveProfileId(profile.id, user.id);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (!user) return;
    setProfile(DEFAULT_ACCESSIBILITY_PROFILE);
    documentStore.saveProfile(DEFAULT_ACCESSIBILITY_PROFILE, user.id);
  };


  // Derive dynamic personalized recommendations
  const getRecommendations = () => {
    const recs: string[] = [];
    if (profile.vision.screenReaderUser || profile.vision.blind) {
      recs.push('Detailed Alt Text & Chart Narratives');
      recs.push('Semantic HTML5 ARIA Structure');
    }
    if (profile.vision.lowVision || profile.vision.largeText) {
      recs.push('High-Contrast Layouts & Scalable Typography');
    }
    if (profile.cognitive.simplifiedLanguage) {
      recs.push('7th-Grade Plain Language Conversion');
    }
    if (profile.cognitive.shortSummaries) {
      recs.push('Executive Key Takeaways');
    }
    if (profile.cognitive.stepByStepExplanations) {
      recs.push('Numbered Step-by-Step Breakdowns');
    }
    if (profile.cognitive.dyslexiaFriendly) {
      recs.push('Dyslexia-Friendly Baseline Font');
    }
    if (profile.language.primaryLanguage === 'te') {
      recs.push('Telugu Translation (తెలుగు) with Preserved Structure');
    } else if (profile.language.primaryLanguage === 'hi') {
      recs.push('Hindi Translation (हिन्दी) with Preserved Structure');
    } else if (profile.language.primaryLanguage !== 'en') {
      recs.push(`${profile.language.primaryLanguage.toUpperCase()} Translation`);
    }
    if (profile.hearing.preferCaptions) {
      recs.push('Synchronized WebVTT Captions');
    }
    if (profile.hearing.preferTranscripts) {
      recs.push('Full Audio Text Transcripts with Speaker Tags');
    }
    if (recs.length === 0) {
      recs.push('Standard WCAG 2.1 AA Multimodal Verification');
    }
    return recs;
  };

  return (
    <div className="mx-auto max-w-[1700px] px-4 sm:px-8 lg:px-12 py-8 w-full flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[var(--border-strong)] mb-8">
        <div className="flex items-center gap-4">
          <InclusaMascot pose="helping" size={54} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-950 border border-purple-300">
                Individual Access Preferences
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              Tell INCLUSA How You Prefer to Access Information
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mt-1">
              Your preferences automatically guide Agent 3 (User Needs) and Agent 4 (Transformation) during all analyses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border-2 border-[var(--border-strong)] bg-white text-xs font-black text-[var(--text-primary)] hover:bg-amber-50 shadow-[2px_2px_0_0_#192138] flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Name & Primary Language */}
        <div className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[4px_4px_0_0_#192138] space-y-4">
          <h2 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-[#059669]" />
            <span>Profile Identity & Primary Language</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-[var(--text-primary)] mb-1.5">
                Profile Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[var(--text-primary)] mb-1.5">
                Preferred Primary Language
              </label>
              <select
                aria-label="Preferred Primary Language"
                value={profile.language.primaryLanguage}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    language: { ...profile.language, primaryLanguage: e.target.value },
                  })
                }
                className="w-full py-2.5 px-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669]"
              >
                <option value="te">Telugu (తెలుగు)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="en">English</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ml">Malayalam (മലയാളം)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="es">Spanish (Español)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 1. VISION PREFERENCES */}
        <div className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[4px_4px_0_0_#192138] space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-sky-600" />
            <h2 className="text-base font-black text-[var(--text-primary)]">Vision Preferences</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              { id: 'screenReaderUser', label: 'Screen Reader User', desc: 'Prioritize semantic HTML landmarks and chart descriptions' },
              { id: 'lowVision', label: 'Low Vision Mode', desc: 'Scale font sizing and enforce 4.5:1 contrast' },
              { id: 'blind', label: 'Non-Sighted / Blind', desc: 'Mandate comprehensive textual alt narratives' },
              { id: 'largeText', label: 'Prefer Large Text (>130%)', desc: 'Render reflowable scalable typography' },
            ].map((item) => {
              const checked = (profile.vision as any)[item.id] || false;
              return (
                <label
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    checked
                      ? 'border-[var(--border-strong)] bg-sky-50 shadow-[2px_2px_0_0_#192138]'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-[var(--text-primary)]">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          vision: { ...profile.vision, [item.id]: e.target.checked },
                        })
                      }
                      className="h-4 w-4 rounded accent-[#059669]"
                    />
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed">{item.desc}</p>
                </label>
              );
            })}
          </div>
        </div>

        {/* 2. COGNITIVE & READING PREFERENCES */}
        <div className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[4px_4px_0_0_#192138] space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <h2 className="text-base font-black text-[var(--text-primary)]">Cognitive & Reading Preferences</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              { id: 'simplifiedLanguage', label: 'Simplified Plain Language', desc: 'Convert prose to 7th grade level' },
              { id: 'dyslexiaFriendly', label: 'Dyslexia-Friendly Layout', desc: 'Use high-legibility fonts & spacing' },
              { id: 'shortSummaries', label: 'Upfront Short Summaries', desc: 'Generate executive bullet points' },
              { id: 'stepByStepExplanations', label: 'Step-by-Step Breakdown', desc: 'Transform paragraphs into numbered steps' },
            ].map((item) => {
              const checked = (profile.cognitive as any)[item.id] || false;
              return (
                <label
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    checked
                      ? 'border-[var(--border-strong)] bg-purple-50 shadow-[2px_2px_0_0_#192138]'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-[var(--text-primary)]">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          cognitive: { ...profile.cognitive, [item.id]: e.target.checked },
                        })
                      }
                      className="h-4 w-4 rounded accent-[#059669]"
                    />
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed">{item.desc}</p>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. HEARING PREFERENCES */}
        <div className="p-6 sm:p-8 rounded-3xl border-2 border-[var(--border-strong)] bg-white shadow-[4px_4px_0_0_#192138] space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-amber-600" />
            <h2 className="text-base font-black text-[var(--text-primary)]">Hearing Preferences</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5">
            {[
              { id: 'preferCaptions', label: 'Mandate Video Captions (WebVTT)', desc: 'Generate timed subtitles for multimedia' },
              { id: 'preferTranscripts', label: 'Full Audio Text Transcripts', desc: 'Transcribe speech with speaker separation' },
            ].map((item) => {
              const checked = (profile.hearing as any)[item.id] || false;
              return (
                <label
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    checked
                      ? 'border-[var(--border-strong)] bg-amber-50 shadow-[2px_2px_0_0_#192138]'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-[var(--text-primary)]">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          hearing: { ...profile.hearing, [item.id]: e.target.checked },
                        })
                      }
                      className="h-4 w-4 rounded accent-[#059669]"
                    />
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed">{item.desc}</p>
                </label>
              );
            })}
          </div>
        </div>

        {/* Dynamic Personalization Visualizer: "Your INCLUSA Experience" */}
        <div className="p-6 sm:p-8 rounded-3xl border-3 border-[var(--border-strong)] bg-emerald-50 shadow-[6px_6px_0_0_#192138] space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#059669]" />
            <h3 className="text-base font-black text-emerald-950">
              Your Personalized INCLUSA Experience
            </h3>
          </div>
          <p className="text-xs text-emerald-900 font-medium">
            Based on your active selections, Agent 3 (User Needs) will automatically request these remediations:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {getRecommendations().map((rec, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white border-2 border-[var(--border-strong)] text-xs font-black text-[var(--text-primary)] flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          {savedSuccess && (
            <span className="text-xs font-black text-emerald-800 flex items-center gap-1">
              <Check className="h-4 w-4 text-[#059669]" /> Preferences saved and active!
            </span>
          )}
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-sm border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Accessibility Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
