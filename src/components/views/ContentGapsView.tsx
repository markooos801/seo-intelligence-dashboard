import React, { useState } from 'react';
import { 
  GitPullRequest, 
  Search, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Flame,
  FilePlus,
  HelpCircle
} from 'lucide-react';
import { SEODashboardDataset, ContentGapItem } from '../../types/seo-schema';

interface ContentGapsViewProps {
  dataset: SEODashboardDataset;
  onNavigateToGraph: (nodeIdOrUrl?: string) => void;
}

export const ContentGapsView: React.FC<ContentGapsViewProps> = ({
  dataset,
  onNavigateToGraph,
}) => {
  const [selectedGap, setSelectedGap] = useState<ContentGapItem | null>(
    dataset.contentGaps?.[0] || null
  );
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const gaps = dataset.contentGaps || [];

  const filteredGaps = gaps.filter(g => {
    if (priorityFilter === 'ALL') return true;
    return g.priority === priorityFilter;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-rose-600" />
            <span>Topical Content Gap Matrix & Opportunity Map</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Missing subtopics, competitor topical advantages, and high-value search expansion opportunities.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          {gaps.length} Actionable Content Gaps
        </span>
      </div>

      {/* Priority Filter Bar */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-slate-700 text-[11px] uppercase">Priority Filter:</span>
        {['ALL', 'P0', 'P1', 'P2'].map(p => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              priorityFilter === p
                ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p === 'ALL' ? 'All Priorities' : `${p} Gaps`}
          </button>
        ))}
      </div>

      {/* Gap Matrix Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Gaps List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredGaps.map(gap => {
            const isSelected = selectedGap?.id === gap.id;

            return (
              <div
                key={gap.id}
                onClick={() => setSelectedGap(gap)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/60 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      gap.priority === 'P0' ? 'bg-red-100 text-red-800' :
                      gap.priority === 'P1' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {gap.priority}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {gap.clusterName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-600 font-bold uppercase">Opportunity</span>
                    <span className="font-extrabold font-mono text-sm text-emerald-700">
                      {gap.opportunityScore}/100
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {gap.expectedSubtopic}
                </h3>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {gap.reasonItMatters}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Est Volume: <strong className="text-slate-800 font-mono">{gap.estimatedSearchVolume?.toLocaleString()} / mo</strong></span>
                  <span className="text-blue-600 font-medium flex items-center gap-1">
                    Inspect Strategy <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Gap Strategy Drawer */}
        <div className="lg:col-span-5">
          {selectedGap ? (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] uppercase">
                  Content Gap Blueprint
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">{selectedGap.id}</span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {selectedGap.expectedSubtopic}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  Parent Cluster: <strong className="text-slate-800">{selectedGap.clusterName}</strong>
                </div>
              </div>

              {/* Strategic Rationale */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Why This Subtopic Matters
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedGap.reasonItMatters}
                </p>
              </div>

              {/* Crawl & Market Evidence */}
              <div className="p-3.5 rounded-lg bg-amber-50/40 border border-amber-200">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Crawl & Market Evidence</span>
                </h4>
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  {selectedGap.evidence}
                </p>
              </div>

              {/* Suggested Implementation */}
              <div className="space-y-2 border-t border-slate-200 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Recommended Page Format:</span>
                  <span className="font-semibold text-slate-900">{selectedGap.suggestedPageType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Search Intent:</span>
                  <span className="font-semibold text-slate-900">{selectedGap.intent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Search Volume:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedGap.estimatedSearchVolume?.toLocaleString()} searches/mo</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateToGraph(selectedGap.clusterId)}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs mt-2"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Locate Cluster in Semantic Graph</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-600 text-xs font-medium">
              Select a content gap from the left to view detailed strategic recommendations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
