'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Clock,
  Sparkles,
  FileText,
  ListChecks,
  Headphones,
} from 'lucide-react';

interface AccessibleAudioPlayerProps {
  transcript?: string;
  textToRead?: string;
  title: string;
}

export const AccessibleAudioPlayer: React.FC<AccessibleAudioPlayerProps> = ({
  transcript,
  textToRead,
  title,
}) => {
  const [activeMode, setActiveMode] = useState<'summary' | 'actions' | 'full'>('summary');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTimestampIndex, setActiveTimestampIndex] = useState(0);

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Extract parts from the transcript or textToRead
  const sourceText = (transcript || textToRead || 'Document content.').replace(/[#*|]/g, '');

  const summaryText = useMemo(() => {
    const lines = sourceText.split('\n').filter((l) => l.trim().length > 10);
    const summaryLines = lines.slice(0, 3).join('. ');
    return `Audio Summary of ${title}. ${summaryLines}. Please check the full document for specific guidelines and application requirements.`;
  }, [sourceText, title]);

  const actionsText = useMemo(() => {
    const lines = sourceText.split('\n').filter((l) => l.trim().length > 5);
    const actionLines = lines.filter((l) => l.toLowerCase().includes('must') || l.toLowerCase().includes('require') || l.toLowerCase().includes('deadline') || l.toLowerCase().includes('submit') || l.toLowerCase().includes('check') || l.toLowerCase().includes('step'));
    if (actionLines.length > 0) {
      return `Key Action Points for ${title}: ${actionLines.slice(0, 5).join('. ')}.`;
    }
    return `Key Action Points: Review the eligibility criteria, prepare required documents, and submit before the stated deadline.`;
  }, [sourceText, title]);

  const fullText = useMemo(() => {
    return `Full Narration of ${title}. ${sourceText}`;
  }, [sourceText, title]);

  // Current active text being played
  const currentContentToRead = useMemo(() => {
    if (activeMode === 'summary') return summaryText;
    if (activeMode === 'actions') return actionsText;
    return fullText;
  }, [activeMode, summaryText, actionsText, fullText]);

  // Dynamically generate synchronized timestamps based on the active audio mode
  const timestamps = useMemo(() => {
    const sentences = currentContentToRead
      .split(/(?<=[.!?\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    if (sentences.length === 0) {
      return [
        { start: 0, end: 10, speaker: 'Narrator', text: `Accessible audio narration of ${title}.` }
      ];
    }

    let runningTime = 0;
    return sentences.slice(0, 20).map((sentence, idx) => {
      const durationSec = Math.max(3, Math.min(12, Math.round(sentence.split(/\s+/).length * 0.35)));
      const start = runningTime;
      const end = runningTime + durationSec;
      runningTime = end;
      return {
        start,
        end,
        speaker: idx === 0 ? 'Overview' : idx % 2 === 0 ? 'Key Detail' : 'Important Action',
        text: sentence,
      };
    });
  }, [currentContentToRead, title]);

  const totalDuration = useMemo(() => {
    if (timestamps.length === 0) return 45;
    return timestamps[timestamps.length - 1].end;
  }, [timestamps]);

  // When changing modes, stop and reset current audio
  const handleModeChange = (mode: 'summary' | 'actions' | 'full') => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveTimestampIndex(0);
    setActiveMode(mode);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          const matchingIdx = timestamps.findIndex((t) => next >= t.start && next <= t.end);
          if (matchingIdx !== -1) setActiveTimestampIndex(matchingIdx);
          return next;
        });
      }, 1000 / playbackRate);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackRate, totalDuration, timestamps]);

  const handlePlayPause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        const readableContent = currentContentToRead.replace(/[#*|]/g, '');
        const utterance = new SpeechSynthesisUtterance(readableContent);
        utterance.rate = playbackRate;
        utterance.onend = () => {
          setIsPlaying(false);
          setCurrentTime(0);
        };
        speechUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const jumpToTimestamp = (seconds: number, index: number) => {
    setCurrentTime(seconds);
    setActiveTimestampIndex(index);
    if (!isPlaying) handlePlayPause();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#192138] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[var(--border-strong)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300">
            <Headphones className="h-5 w-5 text-[#059669]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--text-primary)]">
              Accessible Audio Narration & Multi-Mode Reader
            </h3>
            <p className="text-[10px] text-[var(--text-muted)] font-medium">
              Choose your preferred listening mode: quick summary, action items, or full narration.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-black text-[var(--text-primary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-xl border border-[var(--border-strong)]">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </span>
      </div>

      {/* 3 Audio Listening Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleModeChange('summary')}
          className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
            activeMode === 'summary'
              ? 'border-[var(--border-strong)] bg-amber-100 shadow-[3px_3px_0_0_#192138]'
              : 'border-[var(--border-color)] bg-white hover:bg-amber-50'
          }`}
        >
          <div className="flex items-center gap-1.5 font-black text-xs text-[var(--text-primary)] mb-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>1. 45-Sec Summary</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight">
            Short, high-level spoken overview communicating core purpose & eligibility.
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('actions')}
          className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
            activeMode === 'actions'
              ? 'border-[var(--border-strong)] bg-amber-100 shadow-[3px_3px_0_0_#192138]'
              : 'border-[var(--border-color)] bg-white hover:bg-amber-50'
          }`}
        >
          <div className="flex items-center gap-1.5 font-black text-xs text-[var(--text-primary)] mb-1">
            <ListChecks className="h-3.5 w-3.5 text-[#059669]" />
            <span>2. Key Action Points</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight">
            Reads mandatory steps, documents checklist, and deadline instructions.
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('full')}
          className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
            activeMode === 'full'
              ? 'border-[var(--border-strong)] bg-amber-100 shadow-[3px_3px_0_0_#192138]'
              : 'border-[var(--border-color)] bg-white hover:bg-amber-50'
          }`}
        >
          <div className="flex items-center gap-1.5 font-black text-xs text-[var(--text-primary)] mb-1">
            <FileText className="h-3.5 w-3.5 text-purple-700" />
            <span>3. Read Full Document</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight">
            Complete accessible narration of all sections, data tables, and diagrams.
          </p>
        </button>
      </div>

      {/* Media Player Controls */}
      <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause audio narration' : 'Play audio narration'}
              className="p-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center cursor-pointer"
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentTime(0);
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setIsPlaying(false);
              }}
              title="Restart audio"
              className="p-2.5 rounded-xl border-2 border-[var(--border-strong)] bg-white text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-amber-50 shadow-[2px_2px_0_0_#192138] transition-all"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <span className="text-xs font-bold text-[var(--text-primary)]">
              {activeMode === 'summary' ? 'Listening to 45s Summary' : activeMode === 'actions' ? 'Listening to Action Points' : 'Listening to Full Document'}
            </span>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]">
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase px-2">Speed:</span>
            {[0.75, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setPlaybackRate(rate)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono transition-all ${
                  playbackRate === rate
                    ? 'bg-amber-200 text-amber-950 border border-[var(--border-strong)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <input
            type="range"
            min={0}
            max={totalDuration}
            value={currentTime}
            onChange={(e) => setCurrentTime(parseInt(e.target.value, 10))}
            aria-label="Audio playback seek scrubber"
            className="w-full h-2.5 rounded-full accent-[#059669] bg-slate-200 cursor-pointer"
          />
        </div>
      </div>

      {/* Interactive Transcript Panel */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-3.5 flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-[#059669]" />
          <span>Interactive Spoken Transcript (Click any segment to jump):</span>
        </h4>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {timestamps.map((t, idx) => {
            const isActive = activeTimestampIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => jumpToTimestamp(t.start, idx)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isActive
                    ? 'border-[var(--border-strong)] bg-amber-100 text-amber-950 font-bold shadow-[2px_2px_0_0_#192138]'
                    : 'border-[var(--border-strong)] bg-[var(--bg-primary)] hover:bg-amber-50 text-[var(--text-primary)] font-medium'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-white border border-[var(--border-strong)] text-[#059669]">
                    {formatTime(t.start)}
                  </span>
                  <span className="text-[11px] font-black text-[var(--text-primary)]">
                    [{t.speaker}]
                  </span>
                </div>
                <p className="text-xs leading-relaxed pl-1">
                  {t.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
