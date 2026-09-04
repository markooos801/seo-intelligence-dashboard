import React, { useState } from 'react';
import { 
  GitCommit, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  AlertTriangle, 
  Info, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { SEODashboardDataset, ReleaseTimelineItem } from '../../types/seo-schema';
import { ENTERPRISE_RELEASE_TIMELINE } from '../../services/enterpriseSeoService';

interface ReleaseTimelineViewProps {
  dataset: SEODashboardDataset;
  onNavigateToGraph?: (nodeIdOrUrl?: string) => void;
}

export const ReleaseTimelineView: React.FC<ReleaseTimelineViewProps> = ({
  dataset,
  onNavigateToGraph
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [windowDays, setWindowDays] = useState<'14' | '30'>('14');
  const [selectedRelease, setSelectedRelease] = useState<ReleaseTimelineItem>(ENTERPRISE_RELEASE_TIMELINE[0]);

  const releases = dataset.releaseTimeline || ENTERPRISE_RELEASE_TIMELINE;

  const filteredReleases = releases.filter(rel => {
    if (selectedCategory !== 'ALL' && rel.category !== selectedCategory) return false;
    return true;
  });

  const getCategoryBadge = (category: ReleaseTimelineItem['category']) => {
    switch (category) {
      case '301_REDIRECTS':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">301 REDIRECT ARCHITECTURE</span>;
      case 'INTERNAL_LINKING':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">INTERNAL LINK ROLLOUT</span>;
      case 'CONTENT_EXPANSION':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">CONTENT CLUSTER EXPANSION</span>;
      case 'SCHEMA_DEPLOY':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">SCHEMA DEPLOYMENT</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">TECHNICAL RELEASE</span>;
    }
  };

  const getConfidenceBadge = (confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'INCONCLUSIVE') => {
    switch (confidence) {
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">HIGH CORRELATION</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">MODERATE CORRELATION</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">LOW / INCONCLUSIVE</span>;
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0f172a] p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Causal & Correlation Telemetry
            </span>
            <span className="text-slate-300 dark:text-slate-600 text-xs">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Search Engine Journal Framework</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Release / Change Timeline: Pre vs Post SEO Impact</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Attach verified website releases (301 architecture rewrites, in-body linking additions, semantic expansions) to compare search performance before and after deployment, while methodically distinguishing <strong className="text-slate-800 dark:text-slate-200">Observed Change</strong> from <strong className="text-slate-800 dark:text-slate-200">Possible Correlation</strong>.
          </p>
        </div>

        {/* Window Selector */}
        <div className="flex items-center gap-2 shrink-0 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 pl-2">Window:</span>
          <button
            onClick={() => setWindowDays('14')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              windowDays === '14'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'
            }`}
          >
            14 Days Pre / Post
          </button>
          <button
            onClick={() => setWindowDays('30')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              windowDays === '30'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'
            }`}
          >
            30 Days Pre / Post
          </button>
        </div>
      </div>

      {/* Principle Callout Box (Distinguish Observed vs Possible Correlation) */}
      <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/80 p-4 rounded-xl flex items-start gap-3 shadow-2xs">
        <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 dark:text-amber-200 space-y-1">
          <div className="font-bold uppercase tracking-wider text-[11px] text-amber-900 dark:text-amber-300">
            Enterprise Reporting Principle: Correlation vs. Causation
          </div>
          <p className="leading-relaxed">
            SEO performance changes following a release must not be assumed to be 100% caused by that deployment. 
            External variables such as competitor deployments, Google Core Algorithm updates, and market query volume seasonality 
            always co-exist. We explicitly label <strong className="font-semibold text-amber-900 dark:text-amber-300">Observed Empirical Change</strong> alongside our <strong className="font-semibold text-amber-900 dark:text-amber-300">Assessed Correlation Confidence</strong>.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          Filter Type:
        </span>
        {[
          { key: 'ALL', label: 'All Releases' },
          { key: '301_REDIRECTS', label: '301 Redirects' },
          { key: 'INTERNAL_LINKING', label: 'Internal Linking' },
          { key: 'CONTENT_EXPANSION', label: 'Content Expansion' },
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Timeline & Detail Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Timeline List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 px-1">
            Releases Attached to Timeline ({filteredReleases.length})
          </div>

          <div className="space-y-3">
            {filteredReleases.map(rel => {
              const isSelected = selectedRelease.id === rel.id;
              return (
                <div
                  key={rel.id}
                  onClick={() => setSelectedRelease(rel)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left shadow-2xs ${
                    isSelected
                      ? 'border-emerald-500 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                      : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0f172a] hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {rel.date}
                    </span>
                    {getCategoryBadge(rel.category)}
                  </div>

                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                    {rel.title}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {rel.description}
                  </p>

                  {/* Quick Metric Delta preview */}
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono flex-wrap gap-1">
                    <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                      <TrendingUp className="w-3 h-3" />
                      <span>Clicks: +{rel.observedChanges.clicksDeltaPercent}%</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Impr: +{rel.observedChanges.impressionsDeltaPercent}%
                    </div>
                    <div className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                      Rank: {rel.observedChanges.avgPositionDelta}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Comparison: Before vs After + Scientific Correlation */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-[#0f172a] p-4 sm:p-6 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Deployed: {selectedRelease.date}
                </span>
                {getConfidenceBadge(selectedRelease.correlationAnalysis.correlationConfidence)}
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {selectedRelease.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                {selectedRelease.description}
              </p>
            </div>

            {/* Affected Pages & Clusters */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Direct Scope of Deployment
              </div>
              <div className="text-xs text-slate-800 dark:text-slate-200">
                <strong>Affected Clusters:</strong> {selectedRelease.affectedClusters.join(', ')}
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Monitored Pages:</div>
                {selectedRelease.affectedPages.map((url, uIdx) => (
                  <div key={uIdx} className="font-mono text-[11px] text-blue-700 dark:text-blue-400 flex items-center gap-1 truncate">
                    <span>• {url}</span>
                    {onNavigateToGraph && (
                      <button 
                        onClick={() => onNavigateToGraph(url)}
                        className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 ml-1 cursor-pointer"
                        title="View in graph"
                      >
                        <ArrowUpRight className="w-3 h-3 inline" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Empirical Before vs After Delta Table */}
            <div>
              <div className="flex items-center justify-between mb-2.5 flex-wrap gap-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Observed Search Telemetry ({windowDays}-Day Comparison)
                </h3>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-medium">
                  {selectedRelease.observedChanges.periodBefore} vs {selectedRelease.observedChanges.periodAfter}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Organic Clicks
                  </div>
                  <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                    +{selectedRelease.observedChanges.clicksDeltaPercent}%
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Empirical Post-Launch Gain</div>
                </div>

                <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-800 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                    SERP Impressions
                  </div>
                  <div className="text-xl font-black text-blue-700 dark:text-blue-400 font-mono mt-0.5">
                    +{selectedRelease.observedChanges.impressionsDeltaPercent}%
                  </div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5 font-medium">Visibility Expansion</div>
                </div>

                <div className="p-3.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200/80 dark:border-purple-800 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
                    Avg SERP Position
                  </div>
                  <div className="text-xl font-black text-purple-700 dark:text-purple-400 font-mono mt-0.5">
                    {selectedRelease.observedChanges.avgPositionDelta}
                  </div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5 font-medium">Rank Improvement</div>
                </div>
              </div>

              <div className="mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700">
                Log note: {selectedRelease.observedChanges.metricNotes}
              </div>
            </div>

            {/* Rigorous Scientific Separation: Observed Change vs Possible Correlation */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>1. Working Hypothesis</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
                  {selectedRelease.correlationAnalysis.hypothesis}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/30 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>2. Observed Change vs. Possible Correlation</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed pl-6">
                  {selectedRelease.correlationAnalysis.causationDisclaimer}
                </p>
              </div>

              {/* Coinciding Factors */}
              {selectedRelease.correlationAnalysis.coincidingFactors && selectedRelease.correlationAnalysis.coincidingFactors.length > 0 && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Coinciding Confounding Factors in this Window
                  </div>
                  <ul className="space-y-1.5 pl-2">
                    {selectedRelease.correlationAnalysis.coincidingFactors.map((factor, fIdx) => (
                      <li key={fIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
