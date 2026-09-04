import React from 'react';
import { AlertCircle, Ban, HelpCircle, FileQuestion, RefreshCw } from 'lucide-react';

export type EmptyStateType = 'UNKNOWN' | 'DATA_UNAVAILABLE' | 'BLOCKED' | 'NOT_APPLICABLE';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EMPTY_STATE_CONFIG: Record<EmptyStateType, {
  defaultTitle: string;
  defaultDesc: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
}> = {
  UNKNOWN: {
    defaultTitle: 'Telemetry Unknown',
    defaultDesc: 'Data has not yet been audited or verified for this segment.',
    badge: 'UNKNOWN',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    icon: <HelpCircle className="w-8 h-8 text-slate-400" />
  },
  DATA_UNAVAILABLE: {
    defaultTitle: 'Data Unavailable',
    defaultDesc: 'No telemetry records exist for this metric in the active snapshot.',
    badge: 'DATA UNAVAILABLE',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
    icon: <FileQuestion className="w-8 h-8 text-amber-500" />
  },
  BLOCKED: {
    defaultTitle: 'Telemetry Ingestion Blocked',
    defaultDesc: 'Robots.txt, authentication headers, or API quota restrictions blocked crawl verification.',
    badge: 'BLOCKED',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-300',
    icon: <Ban className="w-8 h-8 text-rose-500" />
  },
  NOT_APPLICABLE: {
    defaultTitle: 'Not Applicable',
    defaultDesc: 'This metric does not apply to the current page category or schema profile.',
    badge: 'NOT APPLICABLE',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: <AlertCircle className="w-8 h-8 text-slate-400" />
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'DATA_UNAVAILABLE',
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  const config = EMPTY_STATE_CONFIG[type] || EMPTY_STATE_CONFIG.DATA_UNAVAILABLE;

  return (
    <div className={`p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="p-3 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        {config.icon}
      </div>
      <div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            {title || config.defaultTitle}
          </h4>
          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold border ${config.badgeColor}`}>
            {config.badge}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          {description || config.defaultDesc}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
