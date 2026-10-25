import React from 'react';

interface AdvaitLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const AdvaitLogo: React.FC<AdvaitLogoProps> = ({
  size = 44,
  className = '',
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Exact Circular Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md select-none"
        aria-label="Advait Insights Emblem"
      >
        <defs>
          {/* Cosmic outer ring gradient */}
          <radialGradient id="spaceGradient" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#0B132B" />
            <stop offset="85%" stopColor="#1C2541" />
            <stop offset="100%" stopColor="#3A506B" />
          </radialGradient>

          {/* Golden sun glow */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>

          {/* Electric Cyan Chevron Gradient */}
          <linearGradient id="chevronGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>

          {/* Subtle star pattern */}
          <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Dark Cosmic Ring with subtle stars */}
        <circle cx="100" cy="100" r="98" fill="url(#spaceGradient)" />
        
        {/* Tiny cosmic stars dots */}
        <circle cx="35" cy="45" r="1.2" fill="#E2E8F0" opacity="0.6" />
        <circle cx="165" cy="50" r="1" fill="#E2E8F0" opacity="0.5" />
        <circle cx="28" cy="120" r="1.4" fill="#E2E8F0" opacity="0.4" />
        <circle cx="172" cy="135" r="1.2" fill="#E2E8F0" opacity="0.7" />
        <circle cx="60" cy="175" r="1" fill="#E2E8F0" opacity="0.5" />
        <circle cx="140" cy="178" r="1.3" fill="#E2E8F0" opacity="0.6" />
        <circle cx="85" cy="22" r="1" fill="#E2E8F0" opacity="0.8" />
        <circle cx="125" cy="24" r="1.2" fill="#E2E8F0" opacity="0.7" />

        {/* Crisp White Inner Ring Frame */}
        <circle cx="100" cy="100" r="76" stroke="#FFFFFF" strokeWidth="5.5" fill="none" />

        {/* Deep Black/Navy Center Background */}
        <circle cx="100" cy="100" r="72" fill="#060913" />

        {/* Radiating Golden Sunburst Rays */}
        <g stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round" opacity="0.95">
          {/* Radial rays fan out from sun arch */}
          <line x1="100" y1="46" x2="100" y2="35" />
          <line x1="91" y1="48" x2="85" y2="38" />
          <line x1="109" y1="48" x2="115" y2="38" />
          <line x1="83" y1="51" x2="73" y2="44" />
          <line x1="117" y1="51" x2="127" y2="44" />
          <line x1="77" y1="56" x2="65" y2="52" />
          <line x1="123" y1="56" x2="135" y2="52" />
          <line x1="72" y1="64" x2="60" y2="63" />
          <line x1="128" y1="64" x2="140" y2="63" />
          <line x1="70" y1="73" x2="58" y2="76" />
          <line x1="130" y1="73" x2="142" y2="76" />
          {/* Secondary finer inner tick marks */}
          <line x1="95" y1="47" x2="93" y2="40" strokeWidth="1.2" />
          <line x1="105" y1="47" x2="107" y2="40" strokeWidth="1.2" />
          <line x1="87" y1="50" x2="80" y2="43" strokeWidth="1.2" />
          <line x1="113" y1="50" x2="120" y2="43" strokeWidth="1.2" />
          <line x1="79" y1="60" x2="68" y2="58" strokeWidth="1.2" />
          <line x1="121" y1="60" x2="132" y2="58" strokeWidth="1.2" />
        </g>

        {/* Golden Sun Disc / Orb */}
        <circle cx="100" cy="69" r="11" fill="url(#sunGlow)" filter="url(#starGlow)" />

        {/* Sky-Blue / Cyan Chevron (Knowledge Apex / Human Ascent) */}
        <path
          d="M74 104 L100 82 L126 104 L121 110 L100 92 L79 110 Z"
          fill="url(#chevronGrad)"
        />

        {/* ADVAIT INSIGHTS Text inside circular emblem (as in actual logo badge) */}
        <text
          x="100"
          y="131"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="'Outfit', -apple-system, BlinkMacSystemFont, sans-serif"
          fontWeight="700"
          fontSize="15"
          letterSpacing="1.8"
        >
          ADVAIT
        </text>
        <text
          x="100"
          y="149"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="'Outfit', -apple-system, BlinkMacSystemFont, sans-serif"
          fontWeight="600"
          fontSize="12.5"
          letterSpacing="2.2"
        >
          INSIGHTS
        </text>
      </svg>

      {/* Optional Side Label for Large Display */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-heading font-bold text-lg leading-tight tracking-wider text-white">
            ADVAIT
          </span>
          <span className="font-heading font-semibold text-xs tracking-widest text-sky-400">
            INSIGHTS
          </span>
        </div>
      )}
    </div>
  );
};
