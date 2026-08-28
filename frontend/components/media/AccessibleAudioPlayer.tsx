'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
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
  const [activeTimestampIndex, setActiveTimestampIndex] = useState(0);

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Dynamically generate synchronized timestamps based on the actual document text/transcript
  const timestamps = useMemo(() => {
    const source = (transcript || textToRead || 'Document content.').replace(/[#*|]/g, '');
    const sentences = source
      .split(/(?<=[.!?\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    if (sentences.length === 0) {
      return [
        { start: 0, end: 10, speaker: 'Narrator', text: `Accessible audio summary of ${title}.` }
      ];
    }

    let runningTime = 0;
    return sentences.slice(0, 15).map((sentence, idx) => {
      const durationSec = Math.max(3, Math.min(15, Math.round(sentence.split(/\s+/).length * 0.4)));
      const start = runningTime;
      const end = runningTime + durationSec;
      runningTime = end;
      return {
        start,
        end,
        speaker: idx === 0 ? 'Introduction' : idx % 2 === 0 ? 'Section Overview' : 'Key Point',
        text: sentence,
      };
    });
  }, [transcript, textToRead, title]);

  const totalDuration = useMemo(() => {
    if (timestamps.length === 0) return 60;
    return timestamps[timestamps.length - 1].end;
  }, [timestamps]);

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
        const readableContent = (textToRead || transcript || title).replace(/[#*|]/g, '');
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
    <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#192138]">
      <div className="flex items-center justify-between pb-4 border-b-2 border-[var(--border-strong)] mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300">
            <Volume2 className="h-5 w-5 text-[#059669]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--text-primary)]">
              Accessible Audio Reader & Timestamped Transcript
            </h3>
            <p className="text-[10px] text-[var(--text-muted)] font-medium">
              Synchronized spoken narration with sentence-level scrubbing
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-black text-[var(--text-primary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-xl border border-[var(--border-strong)]">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </span>
      </div>

      {/* Media Player Controls */}
      <div className="p-5 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] mb-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause audio narration' : 'Play audio narration'}
              className="p-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center"
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
          <span>Interactive Synchronized Transcript (Click any segment to jump):</span>
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
