import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Filter,
  Layers
} from 'lucide-react';
import { SEODashboardDataset, IssueItem } from '../../types/seo-schema';

interface OpportunitiesViewProps {
  dataset: SEODashboardDataset;
  onSelectIssue: (issue: IssueItem) => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  dataset,
  onSelectIssue,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const issues = dataset.issues || [];

  const filteredIssues = issues.filter(i => {
    if (categoryFilter === 'ALL') return true;
    return i.category === categoryFilter;
  });

  // Segregate into 4 Priority Quadrants
  // 1. Quick Wins: High Impact, Low/Medium Effort
  const quickWins = filteredIssues.filter(i => 
    (i.impact === 'HIGH' || i.impact === 'CRITICAL') && i.effort === 'LOW'
  );

  // 2. Strategic Bets: High Impact, Medium/High Effort
  const strategicBets = filteredIssues.filter(i => 
    (i.impact === 'HIGH' || i.impact === 'CRITICAL') && (i.effort === 'MEDIUM' || i.effort === 'HIGH')
  );

  // 3. Fillers / Low-Hanging: Medium/Low Impact, Low Effort
  const fillers = filteredIssues.filter(i => 
    (i.impact === 'MEDIUM' || i.impact === 'LOW') && i.effort === 'LOW'
  );

  // 4. Heavy Lifts / Re-evaluate: Medium/Low Impact, High Effort
  const heavyLifts = filteredIssues.filter(i => 
    (i.impact === 'MEDIUM' || i.impact === 'LOW') && (i.effort === 'MEDIUM' || i.effort === 'HIGH')
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Opportunities & Priority Matrix (Impact vs Effort)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Quadrant visualization mapping technical fixes and content expansions by business leverage.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
          {issues.length} Evaluated Findings
        </span>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
        <span className="font-semibold text-slate-700 dark:text-slate-200 mr-1 text-[11px] uppercase">Filter by Pillar:</span>
        {['ALL', 'TECHNICAL', 'SEMANTIC', 'CONTENT', 'INTERNAL_LINKS', 'STRUCTURED_DATA', 'AEO'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                : 'bg-white dark:bg-[#141c2c] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'All Findings' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* 4-Quadrant 2x2 Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quadrant 1: Quick Wins */}
        <div className="bg-emerald-50/10 dark:bg-emerald-950/20 p-4 rounded-xl border-2 border-emerald-300 dark:border-emerald-700/50 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-emerald-950 dark:text-emerald-300">
                1. Quick Wins (High Impact / Low Effort)
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300/30 dark:border-emerald-800/50">
              {quickWins.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            Highest return on investment. Implement immediately for rapid search visibility improvements.
          </p>

          <div className="space-y-2 flex-1">
            {quickWins.map(issue => (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#141c2c] hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-xs cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-300/30 dark:border-emerald-800/50">
                    {issue.id}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                    {issue.estimatedTrafficGain || 'High Leverage'}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug">{issue.title}</div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {issue.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 2: Strategic Bets */}
        <div className="bg-blue-50/10 dark:bg-blue-950/20 p-4 rounded-xl border-2 border-blue-300 dark:border-blue-700/50 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-blue-950 dark:text-blue-300">
                2. Strategic Bets (High Impact / High Effort)
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-300/30 dark:border-blue-800/50">
              {strategicBets.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            Substantial architectural or content depth initiatives required to build long-term moat.
          </p>

          <div className="space-y-2 flex-1">
            {strategicBets.map(issue => (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-[#141c2c] hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-[10px] font-bold text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-1.5 py-0.2 rounded border border-blue-300/30 dark:border-blue-800/50">
                    {issue.id}
                  </span>
                  <span className="text-[10px] text-blue-700 dark:text-blue-400 font-bold">
                    Strategic Pillar
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug">{issue.title}</div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {issue.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 3: Fillers */}
        <div className="bg-white dark:bg-[#141c2c] p-4 rounded-xl border border-slate-300 dark:border-slate-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                3. Low-Hanging Fruit (Low Impact / Low Effort)
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {fillers.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            Minor maintenance fixes, title tag polishes, or minor metadata adjustments.
          </p>

          <div className="space-y-2 flex-1">
            {fillers.length === 0 ? (
              <div className="p-4 text-center text-slate-400 dark:text-slate-500 text-xs italic">
                No low-hanging items currently unaddressed.
              </div>
            ) : (
              fillers.map(issue => (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded">
                      {issue.id}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug">{issue.title}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quadrant 4: Heavy Lifts */}
        <div className="bg-white dark:bg-[#141c2c] p-4 rounded-xl border border-slate-300 dark:border-slate-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                4. Deprioritize / Re-evaluate (Low Impact / High Effort)
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {heavyLifts.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            High cost tasks with low expected ranking returns. Defer or reject.
          </p>

          <div className="space-y-2 flex-1">
            {heavyLifts.length === 0 ? (
              <div className="p-4 text-center text-slate-400 dark:text-slate-500 text-xs italic">
                No low-impact high-effort tasks in this backlog.
              </div>
            ) : (
              heavyLifts.map(issue => (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all"
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug">{issue.title}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
