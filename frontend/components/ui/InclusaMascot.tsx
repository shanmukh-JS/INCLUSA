import React from 'react';

export type MascotPose =
  | 'waving'
  | 'magnifying'
  | 'helping'
  | 'transforming'
  | 'celebrating'
  | 'reading'
  | 'listening'
  | 'assistant';

interface InclusaMascotProps {
  pose?: MascotPose;
  className?: string;
  size?: number;
  speechText?: string;
}

export const InclusaMascot: React.FC<InclusaMascotProps> = ({
  pose = 'waving',
  className = '',
  size = 120,
  speechText,
}) => {
  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Optional Speech Bubble */}
      {speechText && (
        <div className="mb-2 px-3 py-1.5 rounded-2xl bg-white border-2 border-[var(--border-strong)] shadow-[3px_3px_0px_0px_#192138] text-xs font-bold text-[var(--text-primary)] max-w-[200px] text-center animate-bounce-slow relative z-10">
          {speechText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[var(--border-strong)]" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white" />
        </div>
      )}

      {/* SVG Character */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="INCLUSA Mascot Incli"
        role="img"
      >
        {/* Dropshadow blob */}
        <ellipse cx="80" cy="148" rx="46" ry="7" fill="#192138" fillOpacity="0.1" />

        {/* Antenna */}
        <path d="M80 44V26" stroke="#192138" strokeWidth="4" strokeLinecap="round" />
        <circle cx="80" cy="22" r="9" fill="#F59E0B" stroke="#192138" strokeWidth="3.5" />
        <circle cx="78" cy="19" r="3" fill="#FEF3C7" />
        {/* Sparkle on Antenna */}
        <path
          d="M80 7L82 13L88 15L82 17L80 23L78 17L72 15L78 13L80 7Z"
          fill="#F59E0B"
          opacity="0.85"
        />

        {/* Ears / Headphone bumps */}
        {pose === 'listening' ? (
          <>
            <rect x="22" y="58" width="14" height="28" rx="7" fill="#F97316" stroke="#192138" strokeWidth="3.5" />
            <rect x="124" y="58" width="14" height="28" rx="7" fill="#F97316" stroke="#192138" strokeWidth="3.5" />
            <path d="M30 62C30 38 130 38 130 62" stroke="#192138" strokeWidth="5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <rect x="26" y="66" width="10" height="20" rx="5" fill="#38BDF8" stroke="#192138" strokeWidth="3.5" />
            <rect x="124" y="66" width="10" height="20" rx="5" fill="#38BDF8" stroke="#192138" strokeWidth="3.5" />
          </>
        )}

        {/* Body Base */}
        <rect
          x="44"
          y="108"
          width="72"
          height="34"
          rx="17"
          fill="#059669"
          stroke="#192138"
          strokeWidth="4"
        />
        {/* Wheels / Feet */}
        <rect x="52" y="136" width="18" height="10" rx="5" fill="#192138" />
        <rect x="90" y="136" width="18" height="10" rx="5" fill="#192138" />

        {/* Main Head / Screen */}
        <rect
          x="32"
          y="42"
          width="96"
          height="76"
          rx="24"
          fill="#FFFFFF"
          stroke="#192138"
          strokeWidth="4.5"
        />

        {/* Face Screen Interior */}
        <rect
          x="40"
          y="50"
          width="80"
          height="58"
          rx="18"
          fill="#192138"
        />

        {/* Cheeks / Blush */}
        <circle cx="48" cy="88" r="5" fill="#FB7185" opacity="0.8" />
        <circle cx="112" cy="88" r="5" fill="#FB7185" opacity="0.8" />

        {/* Eyes based on pose */}
        {pose === 'celebrating' ? (
          <>
            {/* Happy arch eyes */}
            <path d="M54 74C54 67 66 67 66 74" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
            <path d="M94 74C94 67 106 67 106 74" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : pose === 'reading' ? (
          <>
            {/* Gentle reading eyes */}
            <ellipse cx="60" cy="74" rx="6" ry="7" fill="#38BDF8" />
            <ellipse cx="100" cy="74" rx="6" ry="7" fill="#38BDF8" />
            <circle cx="58" cy="72" r="2.5" fill="#FFFFFF" />
            <circle cx="98" cy="72" r="2.5" fill="#FFFFFF" />
          </>
        ) : (
          <>
            {/* Wide friendly glowing eyes */}
            <ellipse cx="60" cy="73" rx="7.5" ry="9" fill="#38BDF8" />
            <ellipse cx="100" cy="73" rx="7.5" ry="9" fill="#38BDF8" />
            <circle cx="57.5" cy="69.5" r="3" fill="#FFFFFF" />
            <circle cx="97.5" cy="69.5" r="3" fill="#FFFFFF" />
            <circle cx="63" cy="77" r="1.5" fill="#FFFFFF" />
            <circle cx="103" cy="77" r="1.5" fill="#FFFFFF" />
          </>
        )}

        {/* Mouth */}
        {pose === 'celebrating' ? (
          <path d="M72 84C72 90 88 90 88 84" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" fill="#FBBF24" />
        ) : (
          <path d="M74 85C74 89 86 89 86 85" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        )}

        {/* Arms / Hand accessories based on pose */}
        {pose === 'waving' && (
          <>
            {/* Left arm resting */}
            <path d="M38 116C26 122 28 132 38 132" stroke="#192138" strokeWidth="4" strokeLinecap="round" fill="#059669" />
            {/* Right arm waving up */}
            <path d="M120 114C136 106 142 86 138 72" stroke="#192138" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="138" cy="68" r="8" fill="#F59E0B" stroke="#192138" strokeWidth="3" />
          </>
        )}

        {pose === 'magnifying' && (
          <>
            {/* Left arm */}
            <path d="M38 116C26 122 28 132 38 132" stroke="#192138" strokeWidth="4" strokeLinecap="round" fill="#059669" />
            {/* Right arm holding magnifying glass */}
            <path d="M118 116C130 118 134 108 128 98" stroke="#192138" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="134" cy="90" r="14" fill="#E0F2FE" stroke="#192138" strokeWidth="3.5" />
            <circle cx="134" cy="90" r="9" fill="#38BDF8" fillOpacity="0.3" />
            <line x1="144" y1="100" x2="154" y2="110" stroke="#192138" strokeWidth="4" strokeLinecap="round" />
          </>
        )}

        {pose === 'transforming' && (
          <>
            {/* Magic wand arm */}
            <path d="M120 114C134 108 136 94 130 84" stroke="#192138" strokeWidth="4" strokeLinecap="round" fill="none" />
            <line x1="128" y1="84" x2="148" y2="60" stroke="#192138" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="148,52 152,60 160,62 153,67 155,75 148,70 141,75 143,67 136,62 144,60" fill="#F59E0B" stroke="#192138" strokeWidth="2" />
          </>
        )}

        {pose === 'celebrating' && (
          <>
            {/* Both arms up in the air */}
            <path d="M40 112C26 96 22 80 30 70" stroke="#192138" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="30" cy="68" r="7" fill="#059669" stroke="#192138" strokeWidth="3" />
            <path d="M120 112C134 96 138 80 130 70" stroke="#192138" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="130" cy="68" r="7" fill="#059669" stroke="#192138" strokeWidth="3" />
          </>
        )}

        {pose === 'reading' && (
          <>
            {/* Holding open book */}
            <path d="M60 120H100V136H60Z" fill="#F59E0B" stroke="#192138" strokeWidth="3" rx="3" />
            <line x1="80" y1="120" x2="80" y2="136" stroke="#192138" strokeWidth="2.5" />
          </>
        )}

        {pose === 'helping' && (
          <>
            {/* Holding glowing heart/symbol */}
            <path
              d="M80 125C80 125 72 116 66 119C60 122 61 129 65 133L80 144L95 133C99 129 100 122 94 119C88 116 80 125 80 125Z"
              fill="#FB7185"
              stroke="#192138"
              strokeWidth="2.5"
            />
          </>
        )}
      </svg>
    </div>
  );
};
