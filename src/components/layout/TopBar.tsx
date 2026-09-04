import React from 'react';
import { 
  Globe, 
  Calendar, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeftRight, 
  Layers, 
  ExternalLink,
  ChevronDown,
  Moon,
  Sun,
  Menu
} from 'lucide-react';
import { SEODashboardDataset } from '../../types/seo-schema';
import { GscLogo, Ga4Logo, WordpressLogo, BingLogo, PageSpeedLogo } from '../common/BrandLogos';

interface TopBarProps {
  dataset: SEODashboardDataset;
  onOpenDatasetModal: () => void;
  onCompareClick: () => void;
  isComparing?: boolean;
  isAuditMode: boolean;
  onToggleTheme: () => void;
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  dataset,
  onOpenDatasetModal,
  onCompareClick,
  isComparing = false,
  isAuditMode,
  onToggleTheme,
  onToggleSidebar
}) => {
  const meta = dataset.metadata;
  const isDemo = meta.datasetVersion.includes('demo');

  // Check data availability count
  const availValues = Object.values(meta.dataAvailability || {});
  const allAvailable = availValues.every(v => v === 'AVAILABLE');
  const hasPartial = availValues.some(v => v === 'PARTIAL' || v === 'UNKNOWN' || v === 'BLOCKED');

  return (
    <header className="h-14 bg-[#f1f5f9] dark:bg-[#0c121e] border-b border-[#d4dce7] dark:border-[#1e293b] px-4 sm:px-6 flex items-center justify-between gap-4 z-20 shrink-0 select-none shadow-[0_3px_10px_rgba(166,178,195,0.25)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.5)]">
      {/* Site Info */}
      <div className="flex items-center gap-3 min-w-0">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg neu-btn"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-[2px_2px_5px_rgba(166,178,195,0.5),-1px_-1px_3px_rgba(255,255,255,0.8)] ring-1 ring-blue-700/20">
            NV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 leading-none tracking-tight truncate">
                {meta.siteName}
              </span>
              {isDemo && (
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-semibold tracking-wide shadow-2xs">
                  DEMO DATA
                </span>
              )}
            </div>
            <a 
              href={meta.siteUrl} 
              target="_blank" 
              rel="noreferrer"
              className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1 font-mono transition-colors mt-0.5"
            >
              <span>{meta.siteUrl}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        <div className="h-5 w-px bg-[#d4dce7] hidden md:block" />

        {/* Audit Details */}
        <div className="hidden 2xl:flex items-center gap-3 lg:gap-4 text-xs text-slate-600">
          <div className="hidden md:flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Schema: <strong className="text-slate-800 font-mono font-medium">v{meta.datasetVersion}</strong></span>
          </div>

          {/* Availability status */}
          <div className="hidden xl:flex items-center gap-1.5">
            {[
              { label: 'GSC', value: meta.dataAvailability?.gsc || 'UNKNOWN', logo: <GscLogo className="w-3 h-3 shrink-0" /> },
              { label: 'GA4', value: meta.dataAvailability?.ga4 || 'UNKNOWN', logo: <Ga4Logo className="w-3 h-3 shrink-0" /> },
              { label: 'WordPress', value: meta.dataAvailability?.wordpress || 'UNKNOWN', logo: <WordpressLogo className="w-3 h-3 shrink-0" /> },
              { label: 'Bing', value: meta.dataAvailability?.bing || 'UNKNOWN', logo: <BingLogo className="w-3 h-3 shrink-0" /> },
              { label: 'PSI', value: meta.dataAvailability?.psi || 'UNKNOWN', logo: <PageSpeedLogo className="w-3 h-3 shrink-0" /> }
            ].map((source, i) => {
              let color = 'text-slate-700 bg-[#e7ecf2] border-slate-300/70 shadow-2xs';
              let statusLabel = 'Unknown';
              
              if (source.value === 'AVAILABLE') {
                color = 'text-emerald-900 bg-emerald-50/95 border-emerald-300 shadow-2xs';
                statusLabel = 'Available';
              } else if (source.value === 'BLOCKED') {
                color = 'text-rose-900 bg-rose-50/95 border-rose-300 shadow-2xs';
                statusLabel = 'Blocked';
              }

              return (
                <span 
                  key={i} 
                  className={`inline-flex items-center gap-1 text-[9.5px] font-semibold px-1.5 py-0.5 rounded border transition-colors shrink-0 ${color}`} 
                  title={`${source.label}: ${statusLabel}`}
                >
                  {source.logo}
                  <span className="font-mono">{source.label}</span>
                  {source.value === 'AVAILABLE' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Theme Toggle / Audit Mode */}
        <button
          onClick={onToggleTheme}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            isAuditMode
              ? 'bg-[#fde047] hover:bg-[#facc15] text-slate-950 border border-amber-400 shadow-[0_2px_10px_rgba(253,224,71,0.35)]'
              : 'neu-btn text-slate-700'
          }`}
          title={isAuditMode ? "Switch to Light Mode" : "Switch to Audit High-Contrast Mode"}
        >
          {isAuditMode ? (
            <Sun className="w-3.5 h-3.5 text-slate-950 fill-slate-950 shrink-0" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          )}
          <span className="inline-block whitespace-nowrap font-sans font-bold">{isAuditMode ? 'Audit Mode' : 'Light Mode'}</span>
        </button>

        {/* Comparison Button */}
        <button
          onClick={onCompareClick}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
            isComparing
              ? 'bg-[#e2e8f1] text-blue-700 border border-blue-300 shadow-[inset_2px_2px_4px_rgba(166,178,195,0.55),inset_-2px_-2px_4px_rgba(255,255,255,0.85)]'
              : 'neu-btn text-slate-700'
          }`}
          title="Compare with Historical Snapshot"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="hidden lg:inline whitespace-nowrap">Compare Audits</span>
        </button>

        {/* Dataset Switcher */}
        <button
          onClick={onOpenDatasetModal}
          className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold neu-btn text-slate-800 flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0"
          title="Switch snapshot or import JSON"
        >
          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-[11px] font-mono font-bold tracking-tight text-slate-900">{meta.auditDate}</span>
          <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
        </button>
      </div>
    </header>
  );
};
