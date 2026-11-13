import React from 'react';
import { type DieValue } from '../types/character';

export function ThumbTack({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 32"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Cast shadow */}
      <ellipse cx="11" cy="24" rx="7" ry="2.2" fill="rgba(0,0,0,0.22)" transform="rotate(-18 11 24)" />
      {/* Pin needle */}
      <path d="M14 14 L12 24 L15.5 14 Z" fill="#3a3632" />
      {/* Pin head */}
      <circle cx="15" cy="8.5" r="5.5" fill="url(#tackGrad)" stroke="#1f1c19" strokeWidth="0.8" />
      <ellipse cx="13.5" cy="7" rx="2" ry="1.2" fill="rgba(255,255,255,0.45)" />
      <defs>
        <radialGradient id="tackGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6b655e" />
          <stop offset="65%" stopColor="#2e2a26" />
          <stop offset="100%" stopColor="#141210" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function OesteSombrioLogo() {
  return (
    <div className="relative select-none leading-none pt-1" aria-label="Oeste Sombrio">
      <div className="relative inline-flex items-baseline">
        <span
          className="font-western text-[#262320] tracking-[-0.03em] block"
          style={{
            fontSize: 'clamp(1.65rem, 7.2vw, 2.55rem)',
            lineHeight: 0.92,
            textShadow: '0.5px 0.5px 0 rgba(0,0,0,0.18)',
          }}
        >
          <span className="text-[1.18em]">O</span>ESTE
        </span>

        {/* Raven perched on the top-right of OESTE */}
        <svg
          viewBox="0 0 80 56"
          className="w-[46px] h-[34px] sm:w-[58px] sm:h-[42px] -ml-3 -mt-3 shrink-0 text-[#221f1c]"
          fill="currentColor"
          aria-hidden="true"
        >
          {/* Tail feathers */}
          <path d="M44 35 L73 43 L68 38 L76 37 L53 29 Z" />
          {/* Body and wing */}
          <path d="M18 33 C20 20, 31 12, 41 14 C48 16, 55 24, 62 32 C54 34, 46 37, 36 37 C27 37, 21 35, 18 33 Z" />
          {/* Head and beak */}
          <path d="M19 24 C17 17, 21 10, 27 10 C32 10, 35 14, 34 19 L25 24 Z" />
          <path d="M21 13 L8 15 L19 18 Z" />
          {/* Legs / claws gripping the E */}
          <path d="M29 36 L26 45 M34 36 L33 45 M24 45 L29 45 M31 45 L36 45" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <div
        className="font-western text-[#262320] tracking-[-0.03em] pl-3 sm:pl-4 -mt-1"
        style={{
          fontSize: 'clamp(1.5rem, 6.6vw, 2.35rem)',
          lineHeight: 0.95,
          textShadow: '0.5px 0.5px 0 rgba(0,0,0,0.18)',
        }}
      >
        <span className="text-[1.16em]">S</span>OMBRIO
      </div>
    </div>
  );
}

interface RevolverCylinderProps {
  tambor: string;
  onToggleChamber: (index: number) => void;
}

const CHAMBER_ANGLES = [-90, -30, 30, 90, 150, 210]; // 12, 2, 4, 6, 8, 10 o'clock
const FLUTE_ANGLES = [-60, 0, 60, 120, 180, 240];

export function RevolverCylinder({ tambor, onToggleChamber }: RevolverCylinderProps) {
  const cx = 100;
  const cy = 100;
  const chamberDist = 54;
  const fluteDist = 97;

  return (
    <div className="relative w-full max-w-[165px] sm:max-w-[195px] aspect-square mx-auto select-none">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
        <defs>
          {/* Distressed texture overlay inside cylinder */}
          <radialGradient id="cylinderMetal" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#35312d" />
            <stop offset="60%" stopColor="#221f1c" />
            <stop offset="100%" stopColor="#161412" />
          </radialGradient>
          <mask id="cylinderMask">
            <rect width="200" height="200" fill="black" />
            <circle cx={cx} cy={cy} r="90" fill="white" />
            {/* 6 outer scalloped flutes */}
            {FLUTE_ANGLES.map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const fx = cx + Math.cos(rad) * fluteDist;
              const fy = cy + Math.sin(rad) * fluteDist;
              return <circle key={deg} cx={fx} cy={fy} r="17.5" fill="black" />;
            })}
            {/* 6 chamber holes */}
            {CHAMBER_ANGLES.map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const hx = cx + Math.cos(rad) * chamberDist;
              const hy = cy + Math.sin(rad) * chamberDist;
              return <circle key={deg} cx={hx} cy={hy} r="20.5" fill="black" />;
            })}
            {/* Center axle ring & pin hole */}
            <circle cx={cx} cy={cy} r="21" fill="black" />
            <circle cx={cx} cy={cy} r="18.5" fill="white" />
            <circle cx={cx} cy={cy} r="10.5" fill="black" />
          </mask>
        </defs>

        {/* Main cylinder body */}
        <rect
          width="200"
          height="200"
          fill="url(#cylinderMetal)"
          mask="url(#cylinderMask)"
        />

        {/* Subtle distress speckles on metal */}
        <g mask="url(#cylinderMask)" opacity="0.22">
          <circle cx="55" cy="40" r="14" fill="#78716c" />
          <circle cx="145" cy="145" r="18" fill="#57534e" />
          <circle cx="135" cy="48" r="11" fill="#78716c" />
          <circle cx="62" cy="150" r="13" fill="#57534e" />
        </g>

        {/* Interactive chamber buttons */}
        {CHAMBER_ANGLES.map((deg, idx) => {
          const rad = (deg * Math.PI) / 180;
          const hx = cx + Math.cos(rad) * chamberDist;
          const hy = cy + Math.sin(rad) * chamberDist;
          const isLoaded = tambor[idx] === '1';

          return (
            <g
              key={idx}
              role="button"
              tabIndex={0}
              aria-pressed={isLoaded}
              aria-label={`Tambor ${idx + 1}: ${isLoaded ? 'carregado' : 'vazio'}`}
              onClick={() => onToggleChamber(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleChamber(idx);
                }
              }}
              className="cursor-pointer focus:outline-none group"
            >
              {/* Invisible generous hit circle */}
              <circle cx={hx} cy={hy} r="22" fill="transparent" />

              {isLoaded ? (
                <g className="transition-transform duration-150">
                  {/* Brass cartridge rim */}
                  <circle
                    cx={hx}
                    cy={hy}
                    r="18.5"
                    fill="#b45309"
                    stroke="#451a03"
                    strokeWidth="2"
                  />
                  <circle
                    cx={hx}
                    cy={hy}
                    r="14.5"
                    fill="#d97706"
                    stroke="#78350f"
                    strokeWidth="1"
                  />
                  {/* Center primer cap */}
                  <circle
                    cx={hx}
                    cy={hy}
                    r="6.2"
                    fill="#7f1d1d"
                    stroke="#451a03"
                    strokeWidth="1.2"
                  />
                </g>
              ) : (
                <circle
                  cx={hx}
                  cy={hy}
                  r="19"
                  fill="transparent"
                  className="group-hover:fill-stone-900/10 transition-colors"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function DecorativeLine({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 12"
      preserveAspectRatio="none"
      className={`w-full h-[9px] pointer-events-none select-none overflow-visible ${className}`}
      aria-hidden="true"
    >
      {/* Left knot ornament */}
      <g fill="#524d47">
        <circle cx="4" cy="6" r="2.3" />
        <path d="M2 4.5 L6.5 7.5 M6.5 4.5 L2 7.5" stroke="#3a3632" strokeWidth="1.1" />
      </g>
      {/* Distressed horizontal line */}
      <path
        d="M7 6 C48 5.2, 110 6.5, 175 5.6 C205 5.2, 224 5.9, 239 5.5"
        stroke="#524d47"
        strokeWidth="1.35"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M12 6.8 C75 6.4, 145 7.1, 232 6.2"
        stroke="#7a736b"
        strokeWidth="0.65"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

interface DieIconProps {
  die: Exclude<DieValue, ''>;
  selected: boolean;
  className?: string;
}

export function DieIcon({ die, selected, className = 'w-[17px] h-[17px]' }: DieIconProps) {
  const stroke = selected ? '#f5f2eb' : '#5e5953';
  const outerStroke = selected ? '#7f1d1d' : '#5e5953';
  const fill = selected ? '#7f1d1d' : 'transparent';

  switch (die) {
    case 'd4':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <polygon
            points="12,3.5 21,19.5 3,19.5"
            fill={fill}
            stroke={outerStroke}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          {selected && (
            <polygon
              points="12,6.5 18.2,17.8 5.8,17.8"
              fill="none"
              stroke={stroke}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
          )}
        </svg>
      );

    case 'd6':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <polygon
            points="12,3.2 20,7.5 20,16.5 12,20.8 4,16.5 4,7.5"
            fill={fill}
            stroke={outerStroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M4,7.5 L12,11.8 L20,7.5 M12,11.8 L12,20.8"
            fill="none"
            stroke={stroke}
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'd8':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <polygon
            points="12,2.5 20.5,7.5 20.5,16.5 12,21.5 3.5,16.5 3.5,7.5"
            fill={fill}
            stroke={outerStroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <polygon
            points="12,3 19.5,15.8 4.5,15.8"
            fill="none"
            stroke={stroke}
            strokeWidth="1.15"
            strokeLinejoin="round"
          />
          <path
            d="M3.8,7.8 L12,3 M20.2,7.8 L12,3 M12,21 L4.5,15.8 M12,21 L19.5,15.8"
            fill="none"
            stroke={stroke}
            strokeWidth="1"
          />
        </svg>
      );

    case 'd10':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <polygon
            points="12,2.5 20.5,10.5 12,21.5 3.5,10.5"
            fill={fill}
            stroke={outerStroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M12,2.5 L8.2,13 L12,16.5 L15.8,13 Z"
            fill="none"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M3.5,10.5 L8.2,13 M20.5,10.5 L15.8,13 M12,16.5 L12,21.5"
            fill="none"
            stroke={stroke}
            strokeWidth="1.1"
          />
        </svg>
      );

    case 'd12':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="9.2"
            fill={fill}
            stroke={outerStroke}
            strokeWidth="1.6"
          />
          <polygon
            points="12,6.8 17,10.4 15.1,16.2 8.9,16.2 7,10.4"
            fill="none"
            stroke={stroke}
            strokeWidth="1.15"
            strokeLinejoin="round"
          />
          <path
            d="M12,2.8 L12,6.8 M20.8,9.2 L17,10.4 M17.4,19.4 L15.1,16.2 M6.6,19.4 L8.9,16.2 M3.2,9.2 L7,10.4"
            fill="none"
            stroke={stroke}
            strokeWidth="1"
          />
        </svg>
      );
  }
}

export function EquipmentFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-[7px] mt-1">
      {/* SVG rustic knot border */}
      <svg
        viewBox="0 0 200 150"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        aria-hidden="true"
      >
        <rect
          x="4"
          y="4"
          width="192"
          height="142"
          fill="none"
          stroke="#5e5953"
          strokeWidth="1.8"
          strokeDasharray="6 1.5"
        />
        <rect
          x="5.5"
          y="5.5"
          width="189"
          height="139"
          fill="none"
          stroke="#7a736b"
          strokeWidth="0.7"
          opacity="0.75"
        />
        {/* 4 corner knots */}
        <circle cx="4.5" cy="4.5" r="3" fill="#524d47" />
        <circle cx="195.5" cy="4.5" r="3" fill="#524d47" />
        <circle cx="4.5" cy="145.5" r="3" fill="#524d47" />
        <circle cx="195.5" cy="145.5" r="3" fill="#524d47" />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
