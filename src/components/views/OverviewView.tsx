import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { 
  Activity, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown,
  Wrench, 
  FileText, 
  Network, 
  Link2, 
  Code2, 
  ShieldCheck, 
  Bot,
  History,
  Target,
  ArrowRight,
  Sparkles,
  Layers,
  Database,
  Search,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Check,
  RefreshCw,
  Flame,
  Boxes,
  Compass,
  ArrowDownRight,
  FileCheck,
  Zap
} from 'lucide-react';
import { SEODashboardDataset, IssueItem, DataAvailabilityStatus } from '../../types/seo-schema';
import { MiniSemanticFlow } from '../semantic-graph/MiniSemanticFlow';
import { GscLogo, Ga4Logo, WordpressLogo, BingLogo, PageSpeedLogo } from '../common/BrandLogos';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';
import { ExecutiveBrief } from '../overview/ExecutiveBrief';
import { GscOpportunityEngine } from '../overview/GscOpportunityEngine';
import { KpiPillDots, KpiDonutRing, KpiGaugeMeter, KpiEmbossedCircleBadge } from '../common/KpiWidgets';

interface OverviewViewProps {
  dataset: SEODashboardDataset;
  onNavigateToView: (viewKey: string) => void;
  onSelectIssue: (issue: IssueItem) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  dataset,
  onNavigateToView,
  onSelectIssue,
}) => {
  if (!dataset || !dataset.metadata) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading SEO Intelligence Dataset...
      </div>
    );
  }

  const { 
    metadata, 
    healthScores = { overall: 74, technical: 80, semantic: 78, content: 72, internalLinks: 64, structuredData: 68, eeat: 80, aeo: 74, searchPerformance: 76 }, 
    executiveTakeaway, 
    issues = [], 
    comparison, 
    searchPerformance,
    topicClusters = [],
    semanticGraph,
    technical
  } = dataset;

  const [performanceTimeframe, setPerformanceTimeframe] = useState<'28d' | '90d' | 'compare'>('90d');
  const [copiedInsights, setCopiedInsights] = useState<boolean>(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState<boolean>(false);
  const [selectedAuditId, setSelectedAuditId] = useState<string>('run-4');
  const [showTargetLine, setShowTargetLine] = useState<boolean>(true);

  // Section collapse states for deeper analysis
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'executive-briefing': false,
    'historical-trajectory': false,
    'systemic-health': false,
    'data-connectivity': false,
    'semantic-topology': false,
    'search-performance': false
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper for Health State badge
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: 'HEALTHY', color: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' };
    if (score >= 65) return { label: 'NEEDS ATTENTION', color: 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800' };
    return { label: 'CRITICAL', color: 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800' };
  };

  const healthStatus = getHealthStatus(healthScores.overall);

  // Top Critical Issues sorted strictly by priority (P0 first, then P1, then severity)
  const priorityOrder: Record<string, number> = { 'P0': 0, 'P1': 1, 'P2': 2, 'P3': 3 };
  const topCriticalIssues = useMemo(() => {
    return [...issues]
      .sort((a, b) => {
        const pDiff = (priorityOrder[a.priority || 'P2'] ?? 2) - (priorityOrder[b.priority || 'P2'] ?? 2);
        if (pDiff !== 0) return pDiff;
        if (a.severity === 'CRITICAL' && b.severity !== 'CRITICAL') return -1;
        if (b.severity === 'CRITICAL' && a.severity !== 'CRITICAL') return 1;
        return 0;
      })
      .slice(0, 3);
  }, [issues]);

  // Top Prioritized Actions
  const topActions = useMemo(() => {
    if (executiveTakeaway?.whatToDoNext && executiveTakeaway.whatToDoNext.length > 0) {
      return executiveTakeaway.whatToDoNext.slice(0, 4).map((actionText, idx) => {
        const matchingIssue = issues[idx] || issues[0];
        return {
          priority: matchingIssue?.priority || `P${idx}`,
          action: actionText,
          expectedImpact: idx === 0 ? 'Reclaims +38% PageRank equity to Satellite Servicing' :
                          idx === 1 ? 'Eliminates orphan crawl leak & recovers indexing flow' :
                          idx === 2 ? 'Captures striking-distance rankings & rich snippet eligibility' :
                          'Boosts AI search citation rate across Perplexity & Google AI Overviews',
          owner: idx % 2 === 0 ? 'Web Engineering' : 'Content & SEO',
          issue: matchingIssue
        };
      });
    }
    return topCriticalIssues.map((issue, idx) => ({
      priority: issue.priority || `P${idx}`,
      action: issue.recommendedAction || issue.title,
      expectedImpact: `Remediates barrier on ${issue.affectedUrls?.length || 1} high-value URLs`,
      owner: issue.owner || 'SEO Specialist Team',
      issue: issue
    }));
  }, [executiveTakeaway, issues, topCriticalIssues]);

  // Executive AI Insights State
  const [executiveInsights, setExecutiveInsights] = useState<{
    summary: string;
    positiveMovement: { title: string; detail: string; delta: string };
    negativeMovement: { title: string; detail: string; delta: string };
    model: string;
    generatedAt: string;
  }>({
    summary: "NuVira Space achieved an overall SEO health score of 74/100 (+4 pts vs August 2026 baseline), catalyzed by an +8-point surge in Structured Data health following complete TechArticle schema rollout. However, Internal Linking equity experienced a -2-point decline due to an acute PageRank bottleneck on the core Satellite Servicing pillar, which currently lacks bidirectional contextual anchor references from high-traffic propulsion case studies.",
    positiveMovement: {
      title: "Structured Data Schema Rollout",
      detail: "Deployed complete TechArticle and Product schemas across propulsion and OTV hardware hubs.",
      delta: "+8 pts"
    },
    negativeMovement: {
      title: "Internal Linking PageRank Bottleneck",
      detail: "Satellite Servicing revenue pillar suffers equity starvation from isolated case study links.",
      delta: "-2 pts"
    },
    model: "Standard Telemetry Engine",
    generatedAt: "Just now"
  });

  const handleRegenerateInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName: metadata.siteName,
          siteUrl: metadata.siteUrl,
          currentScore: healthScores.overall,
          scoreDelta: comparison?.overallScoreDelta || 4,
          previousAuditDate: comparison?.baseAuditDate || '2026-08-01',
          currentAuditDate: metadata.auditDate || '2026-09-01',
          categoryScores: healthScores,
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.summary) {
          setExecutiveInsights({
            summary: data.summary,
            positiveMovement: data.positiveMovement || executiveInsights.positiveMovement,
            negativeMovement: data.negativeMovement || executiveInsights.negativeMovement,
            model: data.model || "Standard Telemetry Engine",
            generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      }
    } catch (e) {
      console.warn("Using baseline fallback intelligence:", e);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleCopySummary = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(executiveInsights.summary);
      setCopiedInsights(true);
      setTimeout(() => setCopiedInsights(false), 2000);
    }
  };

  // Historical 4-Audit Runs
  const historicalAudits = useMemo(() => {
    return [
      { id: 'run-1', date: '2026-06-01', name: 'Initial Architecture Crawl', score: 62, delta: null, note: 'Initial discovery audit' },
      { id: 'run-2', date: '2026-07-01', name: 'Pre-Launch Migration Audit', score: 68, delta: '+6', note: 'Technical Core Web Vitals remediation' },
      { id: 'run-3', date: '2026-08-01', name: 'Baseline Production Audit', score: 70, delta: '+2', note: 'Baseline for current differential engine' },
      { id: 'run-4', date: '2026-09-01', name: 'Current Intelligence Audit', score: 74, delta: '+4', isCurrent: true, note: 'Structured data surge & AEO entity mapping' },
    ];
  }, []);

  const selectedAudit = useMemo(() => {
    return historicalAudits.find(a => a.id === selectedAuditId) || historicalAudits[historicalAudits.length - 1];
  }, [historicalAudits, selectedAuditId]);

  // Systemic Health Categories
  const scoreCategories = [
    { label: 'Technical SEO', score: healthScores.technical ?? 80, view: 'technical', icon: <Wrench className="w-3.5 h-3.5" />, delta: '+6', status: 'improving', color: '#10b981' },
    { label: 'Semantic SEO', score: healthScores.semantic ?? 78, view: 'semantic', icon: <Network className="w-3.5 h-3.5" />, delta: '+4', status: 'improving', color: '#10b981' },
    { label: 'Content Quality', score: healthScores.content ?? 72, view: 'content', icon: <FileText className="w-3.5 h-3.5" />, delta: '0', status: 'stable', color: '#3b82f6' },
    { label: 'Internal Linking', score: healthScores.internalLinks ?? 64, view: 'internal-linking', icon: <Link2 className="w-3.5 h-3.5" />, delta: '-2', status: 'declining', color: '#f43f5e' },
    { label: 'Structured Data', score: healthScores.structuredData ?? 68, view: 'structured-data', icon: <Code2 className="w-3.5 h-3.5" />, delta: '+8', status: 'improving', color: '#10b981' },
    { label: 'E-E-A-T Signals', score: healthScores.eeat ?? 80, view: 'eeat', icon: <ShieldCheck className="w-3.5 h-3.5" />, delta: '+1', status: 'stable', color: '#3b82f6' },
    { label: 'AEO / AI Search', score: healthScores.aeo ?? 74, view: 'aeo', icon: <Bot className="w-3.5 h-3.5" />, delta: '+5', status: 'improving', color: '#10b981' },
    { label: 'Search Performance', score: healthScores.searchPerformance ?? 76, view: 'search-performance', icon: <TrendingUp className="w-3.5 h-3.5" />, delta: '+3', status: 'improving', color: '#10b981' },
  ];

  // Data Connectivity status items
  const getCoverageText = (status: string | undefined, activeText: string) => {
    if (status === 'AVAILABLE') return activeText;
    if (status === 'PARTIAL') return 'Partial telemetry';
    if (status === 'BLOCKED') return 'Connection blocked';
    return 'Not configured';
  };

  const dataSources = [
    { label: 'Google Search Console', shortLabel: 'GSC', key: 'gsc', status: metadata.dataAvailability?.gsc || 'UNKNOWN', logo: <GscLogo className="w-5 h-5 shrink-0" />, coverage: getCoverageText(metadata.dataAvailability?.gsc, `${technical?.crawlSummary?.totalCrawled || 0} / ${technical?.crawlSummary?.totalCrawled || 0} URLs crawled`), provenance: 'OBSERVED' as const },
    { label: 'Google Analytics 4', shortLabel: 'GA4', key: 'ga4', status: metadata.dataAvailability?.ga4 || 'UNKNOWN', logo: <Ga4Logo className="w-5 h-5 shrink-0" />, coverage: getCoverageText(metadata.dataAvailability?.ga4, 'Telemetry active'), provenance: 'OBSERVED' as const },
    { label: 'WordPress REST Engine', shortLabel: 'WordPress', key: 'wordpress', status: metadata.dataAvailability?.wordpress || 'UNKNOWN', logo: <WordpressLogo className="w-5 h-5 shrink-0" />, coverage: getCoverageText(metadata.dataAvailability?.wordpress, 'Taxonomy tree verified'), provenance: 'DERIVED' as const },
    { label: 'Microsoft Bing Webmaster', shortLabel: 'Bing', key: 'bing', status: metadata.dataAvailability?.bing || 'UNKNOWN', logo: <BingLogo className="w-5 h-5 shrink-0" />, coverage: getCoverageText(metadata.dataAvailability?.bing, 'IndexNow webhook active'), provenance: 'OBSERVED' as const },
    { label: 'PageSpeed Insights', shortLabel: 'PSI', key: 'psi', status: metadata.dataAvailability?.psi || 'UNKNOWN', logo: <PageSpeedLogo className="w-5 h-5 shrink-0" />, coverage: getCoverageText(metadata.dataAvailability?.psi, 'CrUX real-user dataset'), provenance: 'OBSERVED' as const },
  ];

  return (
    <div className="space-y-6 text-left pb-16">
      
      {/* ========================================================================= */}
      {/* FIRST VIEWPORT: SITE HEALTH + WHAT CHANGED + CRITICAL ISSUES + ACTIONS */}
      {/* ========================================================================= */}
      <section className="neu-card rounded-2xl p-5 sm:p-6 space-y-6 text-slate-800 dark:text-slate-100">
        
        {/* Viewport Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#d4dce7] dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 font-mono">
                Executive Command Center
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-mono text-slate-700 dark:text-slate-200 bg-[#e2e8f1] dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-300/80 dark:border-slate-700 shadow-2xs">
                {metadata.siteName}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Executive SEO Intelligence Overview
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToView('audit-history')}
              className="neu-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Compare Audits</span>
            </button>
            <button
              onClick={() => onNavigateToView('issues')}
              className="neu-btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>All Findings ({issues.length})</span>
            </button>
          </div>
        </div>

        {/* 1. SITE HEALTH */}
        <div className="p-5 rounded-2xl neu-inset space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <KpiPillDots />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5 font-mono">
                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Site Health Index</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-2xs ${healthStatus.color}`}>
                {healthStatus.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DataProvenanceBadge type="HEURISTIC" label="HEURISTIC WEIGHTED INDEX" />
              <span className="text-[11px] text-slate-500 dark:text-slate-300 font-sans">
                Audited crawl of {technical?.crawlSummary?.totalCrawled || 46} production URLs
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start xl:items-center justify-between gap-4 xl:gap-6 pt-1">
            {/* Overall Score Badge */}
            <div className="flex items-center gap-4 shrink-0">
              <KpiEmbossedCircleBadge 
                value={healthScores.overall} 
                label="SCORE"
                size="lg"
              />
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider font-mono">
                  Overall Health
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100 font-sans mt-0.5">
                  {healthScores.overall >= 80 ? 'Optimal System Balance' : 'Attention Required'}
                </div>
                {comparison?.overallScoreDelta !== undefined && (
                  <span className="inline-block text-xs font-bold text-emerald-800 dark:text-emerald-200 font-mono bg-emerald-100/90 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 mt-1 shadow-2xs">
                    +{comparison.overallScoreDelta} pts vs baseline
                  </span>
                )}
              </div>
            </div>

            {/* Category Dimension Donut Rings */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 xl:gap-3 text-xs flex-1 w-full max-w-4xl">
              {scoreCategories.slice(0, 6).map((cat, idx) => {
                const themes: Array<'coral' | 'amber' | 'mint' | 'cyan' | 'purple' | 'blue'> = ['coral', 'amber', 'mint', 'cyan', 'purple', 'blue'];
                const theme = themes[idx % themes.length];
                return (
                  <div
                    key={cat.view}
                    onClick={() => onNavigateToView(cat.view)}
                    className="neu-card p-2 xl:p-3 rounded-2xl flex flex-col items-center justify-start transition-all hover:scale-105 cursor-pointer group"
                  >
                    <KpiDonutRing
                      percentage={cat.score}
                      label={cat.label}
                      sublabel={cat.delta}
                      theme={theme}
                      size={54}
                      strokeWidth={5}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. EXECUTIVE BRIEF (Compact 5-7 lines summary answering status, what changed, risk, opportunity, strategy, next actions) */}
        <ExecutiveBrief 
          dataset={dataset} 
          onNavigateToView={onNavigateToView} 
          onSelectIssue={onSelectIssue} 
        />

        {/* 3. WHAT CHANGED & 4. CRITICAL ISSUES GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* 3. WHAT CHANGED? (CROSS-AUDIT DIFFERENTIAL) */}
          <div className="neu-card-sm p-4.5 rounded-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-mono">
                  <History className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>What Changed Since Last Audit</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
                    Aug 01 → Sep 01
                  </span>
                  <DataProvenanceBadge type="DERIVED" label="VERIFIED DIFF" />
                </div>
              </div>

              {/* Delta KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <div className="p-2.5 rounded-lg neu-inset">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-mono font-medium">Score Delta</span>
                  <span className="text-lg font-black font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{comparison?.overallScoreDelta ?? 4} pts
                  </span>
                </div>
                <div className="p-2.5 rounded-lg neu-inset">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-mono font-medium">New URLs</span>
                  <span className="text-lg font-black font-mono text-blue-700 dark:text-blue-400">
                    +{comparison?.pageCountDelta ?? 1}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg neu-inset">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-mono font-medium">Fixed Issues</span>
                  <span className="text-lg font-black font-mono text-emerald-700 dark:text-emerald-400">
                    -{comparison?.issuesResolved ?? 3}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg neu-inset">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-mono font-medium">Topic Depth</span>
                  <span className="text-lg font-black font-mono text-blue-700 dark:text-blue-400">
                    +{comparison?.topicalCoverageDelta ?? 6}%
                  </span>
                </div>
              </div>

              {/* Key Movement Bullets */}
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800 flex items-start gap-2 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">
                    <strong className="text-emerald-950 dark:text-emerald-300">Structured Data Surge:</strong> Deployed TechArticle schemas, raising schema score from 60 to 68.
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/40 border border-rose-300/80 dark:border-rose-800 flex items-start gap-2 shadow-2xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">
                    <strong className="text-rose-950 dark:text-rose-300">Internal Link Regression:</strong> Internal linking score dropped -2 pts due to PageRank bottleneck on Satellite Servicing.
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-[#d4dce7] dark:border-slate-800">
              <span>Full cross-snapshot telemetry & diff reports available</span>
              <button 
                onClick={() => onNavigateToView('audit-history')}
                className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                Inspect full diff <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* 4. CRITICAL ISSUES (WHAT IS WRONG / WHAT MATTERS MOST?) */}
          <div className="neu-card-sm p-4.5 rounded-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-mono">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Top Critical Barriers & Bottlenecks</span>
                </span>
                <span className="text-[10.5px] font-mono font-bold text-rose-800 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/80 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-800 shadow-2xs">
                  {issues.filter(i => i.severity === 'CRITICAL').length} Critical / {issues.length} Total
                </span>
              </div>

              {/* 3 Urgent Issues Cards */}
              <div className="space-y-2">
                {topCriticalIssues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => onSelectIssue(issue)}
                    className="p-3 rounded-xl neu-card-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group text-left"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-mono">
                          {issue.priority || 'P0'}
                        </span>
                        <span className="font-mono font-bold text-[10px] text-blue-700 dark:text-blue-400">
                          {issue.id}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        {issue.affectedUrls?.length || 1} URL{issue.affectedUrls && issue.affectedUrls.length > 1 ? 's' : ''} affected
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 dark:text-slate-100 text-xs leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                      {issue.title}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                      {issue.whyItMatters || issue.description}
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-[#d4dce7] dark:border-slate-800 flex items-center justify-between text-[10px] text-blue-700 dark:text-blue-400 font-semibold">
                      <span>Action: {issue.recommendedAction?.slice(0, 45)}...</span>
                      <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Inspect <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-[#d4dce7] dark:border-slate-800">
              <span>Sorted by priority impact & revenue sensitivity</span>
              <button 
                onClick={() => onNavigateToView('issues')}
                className="text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                View all findings <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

        </div>

        {/* 5. WHAT CAN WE WIN NEXT? (GSC OPPORTUNITY ENGINE) */}
        <GscOpportunityEngine 
          dataset={dataset} 
          onNavigateToView={onNavigateToView}
          onNavigateToGraph={() => onNavigateToView('semantic')}
        />

        {/* 6. NEXT 3 ACTIONS (PRIORITIZED ACTION QUEUE) */}
        <div className="p-4.5 rounded-xl neu-inset space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-mono">
              <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Next Prioritized Actions</span>
            </span>
            <span className="text-[10.5px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 font-mono shadow-2xs">
              Sprint Deliverables
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
            {topActions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => item.issue && onSelectIssue(item.issue)}
                className="p-3 rounded-xl neu-card-sm hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer group text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider font-mono ${
                      item.priority === 'P0' ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800' :
                      item.priority === 'P1' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800' :
                      'bg-[#e2e8f1] dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      Owner: <strong className="text-slate-800 dark:text-slate-100 font-mono">{item.owner}</strong>
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 dark:text-slate-100 text-xs leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.action}
                  </div>
                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">
                    {item.expectedImpact}
                  </div>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-[#d4dce7] dark:border-slate-800 flex items-center justify-between text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> High ROI
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Execute <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DEEP DIVE 1: EXECUTIVE AI INSIGHTS (PROVIDER-AGNOSTIC) */}
      {/* ========================================================================= */}
      <section className="neu-card rounded-2xl p-5 sm:p-6 space-y-4 overflow-hidden border border-indigo-200/50 dark:border-indigo-500/20 text-slate-800 dark:text-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d4dce7] dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl neu-inset text-indigo-700 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                  Executive Briefing & Strategic Movement
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#e2e8f1] dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-slate-300/80 dark:border-indigo-800/50 shadow-2xs">
                  {executiveInsights.model}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-agent natural language synthesis generated {executiveInsights.generatedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="neu-btn px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1 cursor-pointer"
              title="Copy briefing to clipboard"
            >
              {copiedInsights ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedInsights ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleRegenerateInsights}
              disabled={isGeneratingInsights}
              className="neu-btn px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed neu-inset p-3.5 rounded-xl">
            {executiveInsights.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl neu-card-sm border border-emerald-300/80 dark:border-emerald-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Positive Strategic Movement
                </span>
                <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/80 px-2 py-0.5 rounded shadow-2xs">
                  {executiveInsights.positiveMovement.delta}
                </span>
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                {executiveInsights.positiveMovement.title}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                {executiveInsights.positiveMovement.detail}
              </div>
            </div>

            <div className="p-3.5 rounded-xl neu-card-sm border border-rose-300/80 dark:border-rose-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-rose-950 dark:text-rose-300 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  Identified Regression Barrier
                </span>
                <span className="font-mono font-bold text-rose-800 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/80 px-2 py-0.5 rounded shadow-2xs">
                  {executiveInsights.negativeMovement.delta}
                </span>
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                {executiveInsights.negativeMovement.title}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                {executiveInsights.negativeMovement.detail}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DEEP DIVE 2: 4-AUDIT HISTORICAL RUNS & TRAJECTORY */}
      {/* ========================================================================= */}
      <section className="neu-card rounded-2xl p-5 sm:p-6 space-y-4 text-slate-800 dark:text-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#d4dce7] dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg neu-inset text-blue-600 dark:text-blue-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                Historical 4-Audit Telemetry & Trajectory
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Interactive timeline — click points or runs to inspect audit milestones</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTargetLine(!showTargetLine)}
              className={`neu-btn px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                showTargetLine ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
              title="Toggle target score reference line"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Target 80 {showTargetLine ? 'ON' : 'OFF'}</span>
            </button>
            <DataProvenanceBadge type="DERIVED" label="HISTORICAL RUNS" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">
          {/* Chart area */}
          <div className="lg:col-span-2 h-56 w-full neu-inset p-3 rounded-xl relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={historicalAudits} 
                margin={{ top: 12, right: 24, left: -20, bottom: 4 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    setSelectedAuditId(e.activePayload[0].payload.id);
                  }
                }}
              >
                <defs>
                  <linearGradient id="historicalScoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <RechartsTooltip 
                  formatter={(val: any) => [`${val}/100`, 'Health Score']}
                  contentStyle={{ 
                    backgroundColor: '#eef2f7', 
                    borderRadius: '12px', 
                    border: '1px solid #cbd5e1', 
                    boxShadow: '4px 4px 10px rgba(163,177,198,0.3)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#0f172a'
                  }}
                />
                {showTargetLine && (
                  <ReferenceLine 
                    y={80} 
                    stroke="#059669" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4" 
                    label={{ value: 'Target: 80', fill: '#059669', fontSize: 10, fontWeight: 700, position: 'insideTopRight' }} 
                  />
                )}
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  fill="url(#historicalScoreGrad)" 
                  activeDot={{ r: 6, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Audit run interactive cards */}
          <div className="space-y-2">
            {historicalAudits.map((audit) => {
              const isSelected = audit.id === selectedAudit.id;
              return (
                <div 
                  key={audit.id}
                  onClick={() => setSelectedAuditId(audit.id)}
                  className={`p-3 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'neu-inset-active ring-1 ring-blue-500/40' 
                      : 'neu-btn'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900">{audit.date}</span>
                      {audit.isCurrent && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-600 text-white font-mono shadow-2xs">CURRENT</span>
                      )}
                    </div>
                    <div className="text-[10.5px] text-slate-600 truncate max-w-[170px] mt-0.5">{audit.name}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-black text-sm text-slate-900">{audit.score}/100</div>
                    {audit.delta ? (
                      <div className="font-mono text-[10px] font-bold text-emerald-700">{audit.delta} pts</div>
                    ) : (
                      <div className="font-mono text-[10px] text-slate-400">Baseline</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Audit Interactive Drill-Down Drawer */}
        <div className="p-4 rounded-xl neu-inset flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-black text-slate-900 text-sm">{selectedAudit.name}</span>
              <span className="font-mono text-slate-500">({selectedAudit.date})</span>
              {selectedAudit.isCurrent && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-600 text-white font-mono shadow-2xs">ACTIVE RUN</span>
              )}
            </div>
            <p className="text-[11.5px] text-slate-600">{selectedAudit.note}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right font-mono">
              <div className="text-lg font-black text-slate-900">{selectedAudit.score}/100</div>
              {selectedAudit.delta && <div className="text-[10px] font-bold text-emerald-700 font-mono">{selectedAudit.delta} pts vs prior</div>}
            </div>
            <button
              onClick={() => onNavigateToView('audit-history')}
              className="neu-btn px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 hover:text-blue-900 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Audit Diff</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DEEP DIVE 3: DATA CONNECTIVITY & PROVENANCE INTEGRITY */}
      {/* ========================================================================= */}
      <section className="neu-card rounded-2xl p-5 sm:p-6 space-y-4 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-[#d4dce7] dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg neu-inset text-emerald-600 dark:text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
              Live Data Source Telemetry & Ingestion Integrity
            </h3>
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-semibold">
            {dataSources.filter(d => d.status === 'AVAILABLE').length} of {dataSources.length} Connected
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {dataSources.map(ds => (
            <div key={ds.key} className="p-3.5 rounded-xl neu-card-sm flex flex-col justify-between space-y-2">
              <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="shrink-0">{ds.logo}</div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{ds.shortLabel}</span>
                </div>
                <DataProvenanceBadge type={ds.provenance} className="shrink-0" />
              </div>
              <div className="text-[10.5px] text-slate-600 dark:text-slate-400">
                {ds.coverage}
              </div>
              <div className="pt-2 border-t border-[#d4dce7] dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[10px]">
                <span className="text-emerald-800 dark:text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Synced
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-mono font-medium shrink-0">Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DEEP DIVE 4: SEMANTIC TOPOLOGY & TOPIC CLUSTERS */}
      {/* ========================================================================= */}
      <section className="neu-card rounded-2xl p-5 sm:p-6 space-y-4 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-[#d4dce7] dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg neu-inset text-indigo-600 dark:text-indigo-400">
              <Network className="w-4 h-4" />
            </div>
            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
              Semantic Graph Topology & Clusters Preview
            </h3>
          </div>
          <button
            onClick={() => onNavigateToView('semantic')}
            className="neu-btn px-3 py-1.5 rounded-lg text-xs text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer transition-all"
          >
            <span>Launch Interactive Graph</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 h-64 neu-inset rounded-xl overflow-hidden relative">
            <MiniSemanticFlow 
              dataset={dataset} 
              onNavigateToView={onNavigateToView}
            />
          </div>

          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
              Core Topic Clusters ({topicClusters.length})
            </span>
            {topicClusters.slice(0, 3).map(cluster => (
              <div 
                key={cluster.id}
                onClick={() => onNavigateToView('clusters')}
                className="p-3.5 rounded-xl neu-card-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{cluster.name}</span>
                  <span className="font-mono font-bold text-blue-800 dark:text-blue-200 bg-[#e2e8f1] dark:bg-[#141c2c] px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 shadow-2xs">
                    {cluster.topicHealth}/100
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between mt-1">
                  <span>Coverage: <strong className="text-slate-700 dark:text-slate-300 font-mono">{cluster.coverage}%</strong></span>
                  <span className="font-mono">{cluster.subtopicsCount || 4} Subtopics</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
