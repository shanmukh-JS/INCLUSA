'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Clock,
  Sparkles,
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTimestampIndex, setActiveTimestampIndex] = useState(0);

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Synthetic or parsed timestamps for audio demonstration
  const timestamps = [
    { start: 0, end: 12, speaker: 'Host', text: 'Welcome to the INCLUSA accessible presentation.' },
    { start: 13, end: 28, speaker: 'Presenter', text: 'Today we discuss automated multimodal accessibility agents.' },
    { start: 29, end: 45, speaker: 'Presenter', text: 'Visual charts and tables are converted into structured text.' },
    { start: 46, end: 60, speaker: 'Host', text: 'Independent verification guarantees measurable WCAG compliance.' },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
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
  }, [isPlaying, playbackRate, duration, timestamps]);

  const handlePlayPause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && textToRead) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToRead.slice(0, 800));
        utterance.rate = playbackRate;
        utterance.onend = () => setIsPlaying(false);
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
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-4">
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-[var(--accent-blue)]" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            Accessible Audio Reader & Timestamped Transcript
          </h3>
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Media Player Controls */}
      <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause audio narration' : 'Play audio narration'}
              className="p-3 rounded-xl bg-[var(--accent-blue)] text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
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
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-card)] p-1 rounded-lg border border-[var(--border-subtle)]">
            {[0.75, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setPlaybackRate(rate)}
                className={`px-2 py-1 rounded text-xs font-bold font-mono transition-all ${
                  playbackRate === rate
                    ? 'bg-[var(--accent-blue)] text-slate-950 shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => setCurrentTime(parseInt(e.target.value, 10))}
            aria-label="Audio playback seek scrubber"
            className="w-full h-2 rounded-full accent-[var(--accent-blue)] bg-[var(--bg-card)] cursor-pointer"
          />
        </div>
      </div>

      {/* Interactive Transcript Panel */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-emerald-400" />
          <span>Interactive Synchronized Transcript: Click timestamp to jump</span>
        </h4>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {timestamps.map((t, idx) => {
            const isActive = activeTimestampIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => jumpToTimestamp(t.start, idx)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isActive
                    ? 'border-[var(--accent-blue)] bg-[var(--accent-blue-bg)] font-medium shadow-sm'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--accent-blue)] border border-[var(--border-subtle)]">
                    {formatTime(t.start)}
                  </span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    [{t.speaker}]
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-1">
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
