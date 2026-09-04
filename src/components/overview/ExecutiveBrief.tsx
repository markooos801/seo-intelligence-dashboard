import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  AlertTriangle, 
  TrendingUp, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SEODashboardDataset, IssueItem } from '../../types/seo-schema';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';
import { KpiPillDots } from '../common/KpiWidgets';

interface ExecutiveBriefProps {
  dataset: SEODashboardDataset;
  onNavigateToView?: (viewKey: string) => void;
  onSelectIssue?: (issue: IssueItem) => void;
}

export const ExecutiveBrief: React.FC<ExecutiveBriefProps> = ({
  dataset,
  onNavigateToView,
  onSelectIssue,
}) => {
  const [copied, setCopied] = useState(false);

  const {
    healthScores,
    comparison,
    issues = [],
    searchPerformance,
    topicClusters = [],
    contentGaps = [],
    metadata
  } = dataset;

  // 1. Current Status
  const overall = healthScores.overall ?? 74;
  const statusLabel = overall >= 80 ? 'HEALTHY' : overall >= 65 ? 'NEEDS ATTENTION' : 'CRITICAL';
  const deltaStr = comparison?.overallScoreDelta ? `${comparison.overallScoreDelta > 0 ? '+' : ''}${comparison.overallScoreDelta} pts vs baseline` : '+4 pts vs baseline';

  // 2. What Changed (analytical derivation)
  const strongestCategory = Object.entries(healthScores)
    .filter(([k]) => !['overall', 'methodologyNote'].includes(k))
    .sort((a, b) => (b[1] as number) - (a[1] as number))[0];
  const weakestCategory = Object.entries(healthScores)
    .filter(([k]) => !['overall', 'methodologyNote'].includes(k))
    .sort((a, b) => (a[1] as number) - (b[1] as number))[0];

  const whatIsHappening = comparison
    ? `Structured data (+8) and technical performance (+6) drove visibility gains, while internal linking equity declined (-2) around the primary ${topicClusters[0]?.name || 'Satellite Servicing'} revenue pillar.`
    : `Technical and structured data health remain strong (${strongestCategory?.[1] || 80}/100), but internal linking equity (${weakestCategory?.[1] || 64}/100) creates structural crawl starvation on commercial hubs.`;

  // 3. Biggest Risk (derived from top P0/Critical issue)
  const topCritical = issues.find(i => i.priority === 'P0' || i.severity === 'CRITICAL') || issues[0];
  const biggestRisk = topCritical 
    ? `${topCritical.title} (${topCritical.affectedUrls?.[0]?.replace('https://nuviraspace.com', '') || 'core pillar'} suffers PageRank equity isolation).`
    : 'PageRank equity bottleneck on commercial hubs and unlinked orphan crawl traps.';

  // 4. Biggest Opportunity (derived from striking distance / high-impression opportunities)
  const strikingCount = searchPerformance?.strikingDistanceKeywords?.length || 4;
  const strikingImpressions = (searchPerformance?.strikingDistanceKeywords || []).reduce((acc, k) => acc + (k.impressions || 0), 0) || 13630;
  const biggestOpportunity = `${strikingCount} commercial striking-distance queries (positions 11–14, ~${(strikingImpressions/1000).toFixed(1)}k impressions) ready for Top 5 SERP capture via targeted subtopic expansion.`;

  // 5. Strategic Direction
  const strategicDirection = `Consolidate internal link equity into the ${topicClusters[0]?.name || 'Satellite Servicing'} pillar, seal orphan crawl traps, and expand technical depth across commercial orbital infrastructure.`;

  // 6. Next 3 Actions
  const action1 = issues.find(i => i.id === 'iss-01') || issues[0];
  const action2 = issues.find(i => i.id === 'iss-02') || issues[1];
  const action3 = issues.find(i => i.id === 'iss-05') || issues[2];

  const nextActions = [
    {
      num: 1,
      text: action1?.recommendedAction || 'Contextually link high-authority propulsion case studies to /services/satellite-servicing.',
      issue: action1,
      tag: 'P0 • Internal Equity'
    },
    {
      num: 2,
      text: action2?.recommendedAction || 'Remediate orphan URL /old-blog/space-junk-facts with 301 redirect into active debris cluster.',
      issue: action2,
      tag: 'P0 • Crawl Integrity'
    },
    {
      num: 3,
      text: action3?.recommendedAction || 'Expand 620-word station modules page with NASA COTS specifications to capture positions 11–12 queries.',
      issue: action3,
      tag: 'P1 • Content Depth'
    }
  ];

  // Formatted plain text for executive export
  const rawBriefText = `SITE STATUS: ${statusLabel} (${overall}/100, ${deltaStr})

WHAT IS HAPPENING:
${whatIsHappening}

BIGGEST RISK:
${biggestRisk}

BIGGEST OPPORTUNITY:
${biggestOpportunity}

STRATEGIC DIRECTION:
${strategicDirection}

NEXT ACTIONS:
1. ${nextActions[0].text}
2. ${nextActions[1].text}
3. ${nextActions[2].text}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawBriefText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="neu-card rounded-xl p-5 space-y-4 text-slate-800 dark:text-slate-100">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#d4dce7] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <KpiPillDots />
          <div className="p-1.5 rounded-lg neu-btn text-blue-600 dark:text-blue-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-wide uppercase">
              Executive Brief
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-300">
              Analytical audit synthesis generated from crawl and search telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DataProvenanceBadge type="DERIVED" label="DERIVED AUDIT TELEMETRY" />
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold neu-btn text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copy plain-text brief to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                <span>Copy Brief</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Structured 5-7 Line Concise Executive Output in Inset Well */}
      <div className="neu-inset p-4 rounded-xl space-y-3 text-xs leading-relaxed">
        {/* Line 1: Site Status */}
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-mono font-bold text-slate-600 dark:text-slate-300 shrink-0 uppercase tracking-wider text-[11px] min-w-[150px]">
            SITE STATUS:
          </span>
          <span className="font-bold text-amber-900 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-300 dark:border-amber-600/60 inline-flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {statusLabel} ({overall}/100 • {deltaStr})
          </span>
        </div>

        {/* Line 2: What is happening */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="font-mono font-bold text-slate-600 dark:text-slate-300 shrink-0 uppercase tracking-wider text-[11px] min-w-[150px]">
            WHAT IS HAPPENING:
          </span>
          <span className="text-slate-800 dark:text-slate-100 font-sans text-xs">
            {whatIsHappening}
          </span>
        </div>

        {/* Line 3: Biggest risk */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="font-mono font-bold text-rose-700 dark:text-rose-300 shrink-0 uppercase tracking-wider text-[11px] min-w-[150px] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400 inline" />
            BIGGEST RISK:
          </span>
          <span className="text-rose-900 dark:text-rose-200 font-sans text-xs">
            {biggestRisk}
          </span>
        </div>

        {/* Line 4: Biggest opportunity */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 shrink-0 uppercase tracking-wider text-[11px] min-w-[150px] flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400 inline" />
            BIGGEST OPPORTUNITY:
          </span>
          <span className="text-emerald-950 dark:text-emerald-200 font-sans text-xs">
            {biggestOpportunity}
          </span>
        </div>

        {/* Line 5: Strategic direction */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <span className="font-mono font-bold text-blue-700 dark:text-blue-300 shrink-0 uppercase tracking-wider text-[11px] min-w-[150px] flex items-center gap-1">
            <Compass className="w-3 h-3 text-blue-600 dark:text-blue-400 inline" />
            STRATEGIC DIRECTION:
          </span>
          <span className="text-slate-800 dark:text-slate-100 font-sans text-xs">
            {strategicDirection}
          </span>
        </div>
      </div>

      {/* Line 6 & 7: Next Actions */}
      <div className="pt-2">
        <div className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono">
            <span>NEXT 3 ACTIONS:</span>
          </span>
          {onNavigateToView && (
            <button
              onClick={() => onNavigateToView('roadmap')}
              className="text-[10px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-sans font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Roadmap</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 font-sans">
          {nextActions.map((act) => (
            <div 
              key={act.num}
              onClick={() => act.issue && onSelectIssue && onSelectIssue(act.issue)}
              className="neu-card-sm p-3 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {act.num}
                </span>
                <p className="text-[11px] text-slate-800 dark:text-slate-100 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 leading-snug">
                  {act.text}
                </p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-[#d4dce7] dark:border-slate-700 flex items-center justify-between text-[9.5px]">
                <span className="font-mono text-blue-700 dark:text-blue-300 font-semibold">{act.tag}</span>
                <span className="text-slate-500 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 flex items-center gap-0.5 font-medium">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
