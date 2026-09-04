import React from 'react';
import { ShieldCheck, Calculator, TrendingUp, Sparkles, HelpCircle, Ban } from 'lucide-react';

export type ProvenanceType = 'OBSERVED' | 'DERIVED' | 'ESTIMATED' | 'HEURISTIC' | 'UNKNOWN' | 'BLOCKED';

interface DataProvenanceBadgeProps {
  type: ProvenanceType;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

const PROVENANCE_CONFIG: Record<ProvenanceType, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  description: string;
}> = {
  OBSERVED: {
    label: 'OBSERVED',
    color: 'text-emerald-800 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/70',
    border: 'border-emerald-300 dark:border-emerald-700',
    icon: <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    description: 'Direct measurement from live Google Search Console, GA4, or verified HTTP crawl.'
  },
  DERIVED: {
    label: 'DERIVED',
    color: 'text-blue-800 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/70',
    border: 'border-blue-300 dark:border-blue-700',
    icon: <Calculator className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />,
    description: 'Mathematically computed from observed data (e.g. CTR = Clicks/Impressions, PageRank equity flow).'
  },
  ESTIMATED: {
    label: 'ESTIMATED',
    color: 'text-indigo-800 dark:text-indigo-300',
    bg: 'bg-indigo-50 dark:bg-indigo-950/70',
    border: 'border-indigo-300 dark:border-indigo-700',
    icon: <TrendingUp className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />,
    description: 'Statistical estimation based on industry benchmark CTR curves and search market volume.'
  },
  HEURISTIC: {
    label: 'HEURISTIC',
    color: 'text-amber-800 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/70',
    border: 'border-amber-300 dark:border-amber-700',
    icon: <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />,
    description: 'Rule-based analytical scoring model. Reflects technical and semantic health, not an official search engine metric.'
  },
  UNKNOWN: {
    label: 'UNKNOWN',
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-600',
    icon: <HelpCircle className="w-3 h-3 text-slate-500 shrink-0" />,
    description: 'Data unverified or unavailable in current audit telemetry.'
  },
  BLOCKED: {
    label: 'BLOCKED',
    color: 'text-rose-800 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/70',
    border: 'border-rose-300 dark:border-rose-700',
    icon: <Ban className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />,
    description: 'Access blocked by robots.txt, HTTP authorization, or rate limiting.'
  }
};

export const DataProvenanceBadge: React.FC<DataProvenanceBadgeProps> = ({
  type,
  label,
  className = '',
  showIcon = true
}) => {
  const config = PROVENANCE_CONFIG[type] || PROVENANCE_CONFIG.UNKNOWN;
  const displayLabel = label || config.label;

  return (
    <span 
      className={`group relative inline-flex items-center gap-1 text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors cursor-help select-none shrink-0 ${config.bg} ${config.color} ${config.border} ${className}`}
      title={`${config.label}: ${config.description}`}
    >
      {showIcon && config.icon}
      <span>{displayLabel}</span>
      
      {/* Tooltip on hover */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-48 p-1.5 rounded bg-slate-900 text-white text-[10px] font-sans font-normal leading-tight text-center shadow-lg border border-slate-700 z-50 pointer-events-none animate-in fade-in zoom-in-95">
        <strong className="block font-bold text-slate-200 mb-0.5">{config.label}</strong>
        {config.description}
      </span>
    </span>
  );
};
