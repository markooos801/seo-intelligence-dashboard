import React from 'react';

/**
 * Three colored horizontal pill tags at the top left of dashboard titles
 * Inspired by the reference KPI Dashboard showcase image
 */
export const KpiPillDots: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-1.5 ${className}`}>
    <span className="w-5 h-2 rounded-full bg-[#ff5c7c] shadow-[0_2px_4px_rgba(255,92,124,0.35)]" />
    <span className="w-5 h-2 rounded-full bg-[#f59e0b] shadow-[0_2px_4px_rgba(245,158,11,0.35)]" />
    <span className="w-5 h-2 rounded-full bg-[#10b981] shadow-[0_2px_4px_rgba(16,185,129,0.35)]" />
  </div>
);

/**
 * Three subtle decorative dots under card titles
 */
export const KpiDecorativeDots: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-1 my-1 ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c7c]/60" />
    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]/60" />
    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]/60" />
  </div>
);

/**
 * Embossed circular badge like the top-right "19" in the showcase image
 */
export const KpiEmbossedCircleBadge: React.FC<{
  value: string | number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}> = ({ value, label, size = 'md', className = '', onClick }) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-base',
    md: 'w-16 h-16 text-xl',
    lg: 'w-20 h-20 text-2xl'
  };

  return (
    <div 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center shrink-0 cursor-default select-none ${className}`}
    >
      <div className={`
        ${sizeClasses[size]} rounded-full kpi-embossed-circle
        flex items-center justify-center font-extrabold text-slate-800 font-sans tracking-tight
        ring-4 ring-[#edf2f7] transition-all hover:scale-105 active:scale-95
      `}>
        {value}
      </div>
      {label && (
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 font-mono">
          {label}
        </span>
      )}
    </div>
  );
};

export type KpiColorTheme = 'coral' | 'amber' | 'mint' | 'cyan' | 'purple' | 'blue';

const THEME_COLORS: Record<KpiColorTheme, { stroke: string; track: string; bg: string; text: string }> = {
  coral: {
    stroke: '#ff5c7c',
    track: '#ffe4ea',
    bg: 'from-[#ff5c7c] to-[#ff8fa3]',
    text: 'text-[#ff5c7c]'
  },
  amber: {
    stroke: '#f59e0b',
    track: '#fef3c7',
    bg: 'from-[#f59e0b] to-[#fbbf24]',
    text: 'text-[#f59e0b]'
  },
  mint: {
    stroke: '#10b981',
    track: '#d1fae5',
    bg: 'from-[#10b981] to-[#34d399]',
    text: 'text-[#10b981]'
  },
  cyan: {
    stroke: '#0284c7',
    track: '#e0f2fe',
    bg: 'from-[#0284c7] to-[#38bdf8]',
    text: 'text-[#0284c7]'
  },
  purple: {
    stroke: '#8b5cf6',
    track: '#ede9fe',
    bg: 'from-[#8b5cf6] to-[#c084fc]',
    text: 'text-[#8b5cf6]'
  },
  blue: {
    stroke: '#2563eb',
    track: '#dbeafe',
    bg: 'from-[#2563eb] to-[#60a5fa]',
    text: 'text-[#2563eb]'
  }
};

/**
 * Circular progress ring / Donut gauge as seen in the 2x2 grid in image.png
 */
export const KpiDonutRing: React.FC<{
  percentage: number;
  label: string;
  sublabel?: string;
  theme?: KpiColorTheme;
  size?: number;
  strokeWidth?: number;
  className?: string;
  onClick?: () => void;
}> = ({
  percentage,
  label,
  sublabel,
  theme = 'coral',
  size = 96,
  strokeWidth = 8,
  className = '',
  onClick
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (clamped / 100) * circumference;
  const colors = THEME_COLORS[theme];

  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 group transition-all select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          className="transform -rotate-90 drop-shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.track}
            strokeWidth={strokeWidth}
            fill="none"
            className="transition-all"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-black text-slate-900 dark:text-slate-100 font-sans tracking-tight text-sm sm:text-base leading-none group-hover:scale-110 transition-transform">
            {clamped}%
          </span>
        </div>
      </div>

      {/* Label under donut */}
      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-2 text-center leading-tight min-h-[2.2em] flex items-center justify-center">
        {label}
      </span>
      {sublabel && (
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium text-center">
          {sublabel}
        </span>
      )}
    </div>
  );
};

/**
 * Semi-circular Speedometer Gauge Meter as seen in the bottom-right card of image.png
 */
export const KpiGaugeMeter: React.FC<{
  percentage: number;
  label: string;
  sublabel?: string;
  theme?: KpiColorTheme;
  size?: number;
  className?: string;
}> = ({
  percentage,
  label,
  sublabel,
  theme = 'coral',
  size = 110,
  className = ''
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  const colors = THEME_COLORS[theme];
  const radius = 40;
  const strokeWidth = 8;
  const center = 50;

  // Semicircle arc calculations
  const arcLength = Math.PI * radius;
  const arcOffset = arcLength - (clamped / 100) * arcLength;

  return (
    <div className={`flex flex-col items-center justify-center p-2 text-center select-none ${className}`}>
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <svg viewBox="0 0 100 65" className="w-full h-full overflow-visible">
          {/* Background Semi-circle Arc */}
          <path
            d={`M ${center - radius} ${center + 5} A ${radius} ${radius} 0 0 1 ${center + radius} ${center + 5}`}
            fill="none"
            stroke={colors.track}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress Semi-circle Arc */}
          <path
            d={`M ${center - radius} ${center + 5} A ${radius} ${radius} 0 0 1 ${center + radius} ${center + 5}`}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={arcOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Needle pointer dot */}
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
          <span className="font-black text-slate-900 dark:text-slate-100 font-sans tracking-tight text-sm leading-none">
            {clamped}%
          </span>
        </div>
      </div>

      <span className="text-[11px] font-bold text-slate-800 mt-1 truncate max-w-[120px]">
        {label}
      </span>
      {sublabel && (
        <span className="text-[9.5px] text-slate-400 font-medium truncate max-w-[120px]">
          {sublabel}
        </span>
      )}
    </div>
  );
};

/**
 * Circular or squircle icon badge with vibrant pastel gradient background
 */
export const KpiIconBadge: React.FC<{
  icon: React.ReactNode;
  theme?: KpiColorTheme;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'squircle';
  className?: string;
}> = ({
  icon,
  theme = 'coral',
  size = 'md',
  shape = 'circle',
  className = ''
}) => {
  const colors = THEME_COLORS[theme];
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base'
  };
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  return (
    <div className={`
      ${sizeClasses[size]} ${shapeClass} bg-gradient-to-tr ${colors.bg}
      text-white flex items-center justify-center shrink-0
      shadow-[0_4px_10px_rgba(0,0,0,0.12)] ring-2 ring-white
      ${className}
    `}>
      {icon}
    </div>
  );
};
