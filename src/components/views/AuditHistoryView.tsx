import React, { useState, useMemo } from 'react';
import { 
  History, 
  ArrowLeftRight, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  PlusCircle, 
  MinusCircle,
  Clock,
  ArrowRight,
  ArrowDown,
  ExternalLink,
  ShieldAlert,
  Network,
  Link2,
  Boxes,
  FileText,
  Filter,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SEODashboardDataset } from '../../types/seo-schema';
import { 
  BUILT_IN_SNAPSHOTS, 
  SNAPSHOT_2026_08_01 
} from '../../services/dataLoader';
import { computeEnhancedSnapshotComparison } from '../../services/enterpriseSeoService';

interface AuditHistoryViewProps {
  currentDataset: SEODashboardDataset;
  onSelectDataset?: (dataset: SEODashboardDataset) => void;
  onNavigateToGraph?: (nodeIdOrUrl?: string) => void;
}

export const AuditHistoryView: React.FC<AuditHistoryViewProps> = ({
  currentDataset,
  onSelectDataset,
  onNavigateToGraph
}) => {
  const [baseAuditId, setBaseAuditId] = useState<string>('2026-08-01');
  const [targetAuditId, setTargetAuditId] = useState<string>('current');

  // Active diff category tab
  const [activeDiffTab, setActiveDiffTab] = useState<
    'issues' | 'pages' | 'semantic' | 'internal-links' | 'topic-coverage'
  >('issues');

  // Modal for drilldown into affected pages
  const [drilldownItem, setDrilldownItem] = useState<{
    title: string;
    type: string;
    description?: string;
    affectedPages: string[];
  } | null>(null);

  const baseSnapshot = useMemo(() => {
    return BUILT_IN_SNAPSHOTS.find(s => s.id === baseAuditId)?.data || SNAPSHOT_2026_08_01;
  }, [baseAuditId]);

  const targetSnapshot = useMemo(() => {
    return BUILT_IN_SNAPSHOTS.find(s => s.id === targetAuditId)?.data || currentDataset;
  }, [targetAuditId, currentDataset]);

  const enhancedDiff = useMemo(() => {
    return computeEnhancedSnapshotComparison(baseSnapshot, targetSnapshot);
  }, [baseSnapshot, targetSnapshot]);

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#141c2c] p-5 sm:p-6 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-800/50 shadow-2xs font-mono">
              Audit Snapshot Differential Engine
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Search Engine Journal Telemetry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Audit History & Cross-Snapshot Telemetry</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
            Multi-vector comparative telemetry isolating new regressions, remediated technical issues, severity escalations, crawl inventory modifications, semantic ontology evolution, and topic coverage deltas between <strong className="text-slate-900 dark:text-slate-100 font-bold">Audit A (Baseline)</strong> and <strong className="text-slate-900 dark:text-slate-100 font-bold">Audit B (Target)</strong>.
          </p>
        </div>

        {/* Aggregate Delta KPI */}
        <div className="flex items-center gap-3.5 shrink-0 p-3.5 bg-slate-100/90 dark:bg-slate-800/90 rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black font-mono text-lg shadow-xs border ${
            enhancedDiff.overallScoreDelta >= 0 
              ? 'bg-emerald-500 text-white border-emerald-600' 
              : 'bg-rose-500 text-white border-rose-600'
          }`}>
            {enhancedDiff.overallScoreDelta >= 0 ? `+${enhancedDiff.overallScoreDelta}` : enhancedDiff.overallScoreDelta}
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Overall Health Delta</div>
            <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              Score: <span className="text-slate-600 dark:text-slate-400 font-medium">{baseSnapshot.healthScores.overall}</span> &rarr; <span className="text-blue-700 dark:text-blue-400 font-black">{targetSnapshot.healthScores.overall}</span> / 100
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Net movement across {baseSnapshot.issues.length + targetSnapshot.issues.length} audit data points
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot Selector: Audit A ↓ Audit B ↓ Changes */}
      <div className="bg-white dark:bg-[#141c2c] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <span>Comparative Vector Selection:</span>
          <span className="font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/50 font-bold">
            Baseline (Audit A) &rarr; Target (Audit B)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-3.5 items-center">
          {/* Audit A */}
          <div className="md:col-span-5 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400 shrink-0" />
                <span>Baseline Snapshot (Audit A)</span>
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">{baseSnapshot.metadata.auditDate}</span>
            </div>
            <select
              value={baseAuditId}
              onChange={(e) => setBaseAuditId(e.target.value)}
              className="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
            >
              {BUILT_IN_SNAPSHOTS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.date}) — Score: {s.data.healthScores.overall}/100
                </option>
              ))}
            </select>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium pt-0.5 flex items-center justify-between">
              <span>Site: <strong className="text-slate-800 dark:text-slate-200">{baseSnapshot.metadata.siteName}</strong></span>
              <span>Total Issues: <strong className="text-slate-800 dark:text-slate-200 font-mono">{baseSnapshot.issues.length}</strong></span>
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 font-bold py-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700/50 text-blue-700 dark:text-blue-400 flex items-center justify-center shadow-2xs">
              <ArrowRight className="w-4 h-4 hidden md:block" />
              <ArrowDown className="w-4 h-4 md:hidden" />
            </div>
            <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold mt-1">DIFF</span>
          </div>

          {/* Audit B */}
          <div className="md:col-span-5 p-4 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50/40 dark:bg-blue-900/20 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 shrink-0 animate-pulse" />
                <span>Target Snapshot (Audit B)</span>
              </span>
              <span className="font-mono text-blue-900 dark:text-blue-300 font-semibold bg-white dark:bg-[#141c2c] px-2 py-0.5 rounded border border-blue-200 dark:border-blue-700">{targetSnapshot.metadata.auditDate}</span>
            </div>
            <select
              value={targetAuditId}
              onChange={(e) => setTargetAuditId(e.target.value)}
              className="w-full text-xs font-bold bg-white dark:bg-[#141c2c] border border-blue-300 dark:border-blue-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
            >
              {BUILT_IN_SNAPSHOTS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.date}) — Score: {s.data.healthScores.overall}/100
                </option>
              ))}
            </select>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium pt-0.5 flex items-center justify-between">
              <span>Site: <strong className="text-slate-800 dark:text-slate-200">{targetSnapshot.metadata.siteName}</strong></span>
              <span>Total Issues: <strong className="text-slate-800 dark:text-slate-200 font-mono">{targetSnapshot.issues.length}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot Changes Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Resolved Issues */}
        <div className="p-4 bg-white dark:bg-[#141c2c] rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs">
          <div className="flex items-center justify-between gap-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              Resolved Findings
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-1">
            {enhancedDiff.resolvedIssuesList.length}
          </div>
          <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold mt-1">Fixed issues since Audit A</div>
        </div>

        {/* New Issues */}
        <div className="p-4 bg-white dark:bg-[#141c2c] rounded-xl border border-rose-200 dark:border-rose-800 shadow-2xs">
          <div className="flex items-center justify-between gap-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-900 dark:text-rose-300">
              New Regressions
            </div>
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          </div>
          <div className="text-3xl font-black font-mono text-rose-700 dark:text-rose-400 mt-1">
            {enhancedDiff.newIssuesList.length}
          </div>
          <div className="text-xs text-rose-800 dark:text-rose-300 font-semibold mt-1">Regressions emerged in B</div>
        </div>

        {/* Worsening Issues */}
        <div className="p-4 bg-white dark:bg-[#141c2c] rounded-xl border border-amber-200 dark:border-amber-800 shadow-2xs">
          <div className="flex items-center justify-between gap-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              Escalated Severity
            </div>
            <TrendingDown className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-700 dark:text-amber-400 mt-1">
            {enhancedDiff.worseningIssues.length}
          </div>
          <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold mt-1">Severity escalated in B</div>
        </div>

        {/* Improved Issues */}
        <div className="p-4 bg-white dark:bg-[#141c2c] rounded-xl border border-blue-200 dark:border-blue-800 shadow-2xs">
          <div className="flex items-center justify-between gap-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
              Mitigated Findings
            </div>
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          </div>
          <div className="text-3xl font-black font-mono text-blue-700 dark:text-blue-400 mt-1">
            {enhancedDiff.improvedIssues.length}
          </div>
          <div className="text-xs text-blue-800 dark:text-blue-300 font-semibold mt-1">Partially mitigated in B</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Diff Details */}
      <div className="flex border-b border-slate-300 gap-2 overflow-x-auto pb-px">
        {[
          { key: 'issues', label: `Issues Differential (${enhancedDiff.diffItems.length})` },
          { key: 'pages', label: `Page Inventory (+${enhancedDiff.newPagesList.length} / -${enhancedDiff.removedPagesList.length})` },
          { key: 'semantic', label: `Semantic Relationships (${enhancedDiff.semanticRelationshipChanges.length})` },
          { key: 'internal-links', label: 'Internal Link Changes' },
          { key: 'topic-coverage', label: 'Topic Coverage Delta' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveDiffTab(tab.key as any)}
            className={`pb-3 pt-2 px-3.5 text-xs font-black border-b-2 transition-all whitespace-nowrap cursor-pointer rounded-t-lg ${
              activeDiffTab === tab.key
                ? 'border-blue-600 text-blue-800 bg-blue-50/60 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ISSUES DIFFERENTIAL (NEW, RESOLVED, WORSENING, IMPROVED)            */}
      {/* ========================================================================= */}
      {activeDiffTab === 'issues' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Finding Status Transitions & Severity Trajectory
              </h3>
              <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>Click row to drill down into affected URLs</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-300 text-slate-800 font-black uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Finding Title</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">State in Audit A</th>
                    <th className="py-3 px-3">State in Audit B</th>
                    <th className="py-3 px-3">Impact & Trajectory</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {enhancedDiff.diffItems.map((item, idx) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-slate-100/60 transition-colors cursor-pointer"
                      onClick={() => setDrilldownItem({
                        title: item.findingTitle,
                        type: item.currentStatus,
                        description: item.impact,
                        affectedPages: [
                          "https://nuviraspace.com/services/satellite-servicing",
                          "https://nuviraspace.com/propulsion/green-chemical",
                          "https://nuviraspace.com/infrastructure/station-modules"
                        ]
                      })}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-950 max-w-xs">
                        <div className="truncate">{item.findingTitle}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800 font-mono border border-slate-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-700 font-semibold text-[11px]">
                        {item.previousStatus}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1.5 font-bold text-[11px] font-mono px-2.5 py-0.5 rounded-full border shadow-2xs ${
                          item.currentStatus.includes('RESOLVED') 
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300' 
                            : item.currentStatus.includes('NEW') 
                            ? 'bg-rose-100 text-rose-950 border-rose-300' 
                            : item.currentStatus.includes('ESCALATED') 
                            ? 'bg-amber-100 text-amber-950 border-amber-300' 
                            : 'bg-blue-100 text-blue-950 border-blue-300'
                        }`}>
                          {item.currentStatus.includes('RESOLVED') && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                          {item.currentStatus.includes('NEW') && <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />}
                          <span>{item.currentStatus}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 text-xs font-medium max-w-sm">
                        {item.impact}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="text-blue-700 hover:text-blue-900 font-bold text-xs flex items-center gap-1 ml-auto cursor-pointer">
                          <span>Drill Down</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PAGE INVENTORY CHANGES (NEW PAGES, REMOVED PAGES)                  */}
      {/* ========================================================================= */}
      {activeDiffTab === 'pages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* New Pages in B */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
                  New Pages Detected in Audit B ({enhancedDiff.newPagesList.length})
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                Index Expansion
              </span>
            </div>

            <div className="space-y-2">
              {enhancedDiff.newPagesList.map((url, uIdx) => (
                <div key={uIdx} className="p-3 bg-slate-50 rounded-lg border border-slate-300 flex items-center justify-between gap-2.5">
                  <div className="font-mono text-xs text-blue-800 font-bold truncate">
                    {url}
                  </div>
                  {onNavigateToGraph && (
                    <button
                      onClick={() => onNavigateToGraph(url)}
                      className="text-xs font-bold text-slate-700 hover:text-blue-800 bg-white px-2 py-1 rounded border border-slate-200 hover:border-blue-300 shrink-0 cursor-pointer shadow-2xs"
                    >
                      View in Graph
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Removed Pages in B */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MinusCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
                  Pages Removed / 404 in Audit B ({enhancedDiff.removedPagesList.length})
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300 font-mono">
                Pruned / Dead URLs
              </span>
            </div>

            <div className="space-y-2">
              {enhancedDiff.removedPagesList.map((url, uIdx) => (
                <div key={uIdx} className="p-3 bg-slate-50 rounded-lg border border-slate-300 flex items-center justify-between gap-2.5">
                  <div className="font-mono text-xs text-rose-800 font-bold truncate">
                    {url}
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                    Verify 301 Target
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SEMANTIC RELATIONSHIP CHANGES                                      */}
      {/* ========================================================================= */}
      {activeDiffTab === 'semantic' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-600 shrink-0" />
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
                Knowledge Graph Edge Evolution ({enhancedDiff.semanticRelationshipChanges.length})
              </h3>
            </div>
            <span className="text-xs text-slate-700 font-semibold">
              Ontology relationship changes between snapshots
            </span>
          </div>

          <div className="space-y-3">
            {enhancedDiff.semanticRelationshipChanges.map((edge, eIdx) => (
              <div key={eIdx} className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{edge.source}</span>
                    <span className="text-blue-600 font-black">&rarr;</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{edge.target}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border shadow-2xs ${
                    edge.type === 'ADDED' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                    edge.type === 'STRENGTHENED' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                    'bg-rose-100 text-rose-900 border-rose-300'
                  }`}>
                    {edge.type}
                  </span>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed font-medium">
                  <strong className="text-slate-900 font-bold">Kind: {edge.kind}</strong> — {edge.significance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: INTERNAL LINK CHANGES                                              */}
      {/* ========================================================================= */}
      {activeDiffTab === 'internal-links' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">In-Body Links Added</div>
              <div className="text-3xl font-black font-mono text-emerald-700 mt-1">+{enhancedDiff.internalLinkChanges.linksAdded}</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">In-Body Links Removed</div>
              <div className="text-3xl font-black font-mono text-rose-700 mt-1">-{enhancedDiff.internalLinkChanges.linksRemoved}</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Orphan Pages Remediated</div>
              <div className="text-3xl font-black font-mono text-blue-700 mt-1">{enhancedDiff.internalLinkChanges.remediatedOrphanPages.length}</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <h4 className="font-black text-xs uppercase tracking-wider text-slate-900">
              Equity Shift Summary & Remediated Orphan URLs
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-300 font-medium">
              {enhancedDiff.internalLinkChanges.equityShiftSummary}
            </p>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-800">Remediated Orphan Pages (Now Crawlable & Connected):</div>
              {enhancedDiff.internalLinkChanges.remediatedOrphanPages.map((url, uIdx) => (
                <div key={uIdx} className="font-mono text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-300 flex items-center justify-between">
                  <span className="font-bold">• {url}</span>
                  <span className="text-[11px] font-sans font-bold text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded">
                    Crawlable in Audit B
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: TOPIC COVERAGE CHANGES                                             */}
      {/* ========================================================================= */}
      {activeDiffTab === 'topic-coverage' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Cluster-by-Cluster Topic Coverage Delta
            </h3>
            <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300">
              Net Coverage Delta: +{enhancedDiff.topicalCoverageDelta}%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-300 text-slate-800 font-black uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Topic Cluster</th>
                  <th className="py-3 px-3 text-right">Coverage in A</th>
                  <th className="py-3 px-3 text-right">Coverage in B</th>
                  <th className="py-3 px-3 text-right">Delta</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {enhancedDiff.topicCoverageChanges.map((topic, tIdx) => (
                  <tr key={tIdx} className="hover:bg-slate-100/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-950">
                      {topic.clusterName}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-700 font-medium">
                      {topic.previousCoverage}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-black text-slate-950">
                      {topic.currentCoverage}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        topic.delta >= 0 
                          ? 'text-emerald-950 bg-emerald-100 border border-emerald-300' 
                          : 'text-rose-950 bg-rose-100 border border-rose-300'
                      }`}>
                        {topic.delta >= 0 ? `+${topic.delta}%` : `${topic.delta}%`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${
                        topic.status === 'IMPROVED' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
                        topic.status === 'REGRESSED' ? 'bg-rose-100 text-rose-950 border-rose-300' :
                        'bg-slate-100 text-slate-800 border-slate-300'
                      }`}>
                        {topic.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drilldown Modal */}
      {drilldownItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-lg w-full p-6 text-left space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-100 border border-blue-300 px-2.5 py-0.5 rounded-full inline-block mb-1.5 font-mono">
                  Diff Drilldown: {drilldownItem.type}
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {drilldownItem.title}
                </h3>
              </div>
              <button
                onClick={() => setDrilldownItem(null)}
                className="text-slate-500 hover:text-slate-800 font-mono text-base p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {drilldownItem.description && (
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-300 leading-relaxed font-medium">
                {drilldownItem.description}
              </p>
            )}

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900">Directly Affected URLs:</div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {drilldownItem.affectedPages.map((url, uIdx) => (
                  <div key={uIdx} className="font-mono text-xs text-blue-800 bg-slate-50 p-2.5 rounded-lg border border-slate-300 flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{url}</span>
                    {onNavigateToGraph && (
                      <button
                        onClick={() => {
                          onNavigateToGraph(url);
                          setDrilldownItem(null);
                        }}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline shrink-0 cursor-pointer"
                      >
                        Graph
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setDrilldownItem(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer transition-colors shadow-xs"
              >
                Close Drilldown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

