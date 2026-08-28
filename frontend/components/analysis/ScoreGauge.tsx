import React from 'react';
import { AccessibilityScoreResult } from '@/types';

interface ScoreGaugeProps {
  scoreResult: AccessibilityScoreResult;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  scoreResult,
  size = 'md',
  showLabel = true,
}) => {
  const score = scoreResult.overallScore;

  const getColor = (s: number) => {
    if (s >= 90) return { stroke: '#059669', text: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-300' };
    if (s >= 75) return { stroke: '#0284C7', text: 'text-sky-800', bg: 'bg-sky-100 border-sky-300' };
    if (s >= 50) return { stroke: '#D97706', text: 'text-amber-800', bg: 'bg-amber-100 border-amber-300' };
    return { stroke: '#DC2626', text: 'text-rose-800', bg: 'bg-rose-100 border-rose-300' };
  };

  const color = getColor(score);

  const radius = size === 'lg' ? 68 : size === 'md' ? 52 : 36;
  const strokeWidth = size === 'lg' ? 12 : size === 'md' ? 9 : 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center">
        <svg width={svgSize} height={svgSize} className="transform -rotate-90">
          {/* Background track circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="#E2DBD0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-black font-mono tracking-tight text-[var(--text-primary)] ${
              size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-lg'
            }`}
          >
            {score}
          </span>
          <span className="text-[10px] font-black text-[var(--text-muted)] -mt-0.5">/ 100</span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-3">
          <div
            className={`inline-block px-3 py-1 rounded-full text-xs font-black ${color.bg} ${color.text} border`}
          >
            {scoreResult.status}
          </div>
        </div>
      )}
    </div>
  );
};
