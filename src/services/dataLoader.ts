import currentDataRaw from '../../data/current.json';
import snapshot20260801Raw from '../../data/snapshots/2026-08-01.json';
import demoDataRaw from '../../data/snapshots/demo.json';
import { 
  SEODashboardDataset, 
  AuditSnapshotComparison,
  IssueItem,
  SemanticNodeData,
  SemanticEdgeData
} from '../types/seo-schema';

export const CURRENT_DATASET: SEODashboardDataset = currentDataRaw as unknown as SEODashboardDataset;
export const SNAPSHOT_2026_08_01: SEODashboardDataset = snapshot20260801Raw as unknown as SEODashboardDataset;
export const DEMO_DATASET: SEODashboardDataset = demoDataRaw as unknown as SEODashboardDataset;

export interface AvailableSnapshot {
  id: string;
  name: string;
  date: string;
  isDemo?: boolean;
  version: string;
  data: SEODashboardDataset;
}

export const BUILT_IN_SNAPSHOTS: AvailableSnapshot[] = [
  {
    id: 'current',
    name: 'NuVira Space — 2026-09-01 (Current)',
    date: '2026-09-01',
    version: '3.8.1-prod',
    data: CURRENT_DATASET,
  },
  {
    id: '2026-08-01',
    name: 'NuVira Space — 2026-08-01 (Baseline Snapshot)',
    date: '2026-08-01',
    version: '3.7.4-prod',
    data: SNAPSHOT_2026_08_01,
  },
  {
    id: 'demo',
    name: 'AeroRobotics Labs [DEMO DATA]',
    date: '2026-07-15',
    isDemo: true,
    version: '3.5.0-demo',
    data: DEMO_DATASET,
  }
];

/**
 * Compare two audit snapshots dynamically to produce diffs
 */
export function computeSnapshotComparison(
  base: SEODashboardDataset,
  target: SEODashboardDataset
): AuditSnapshotComparison {
  const overallScoreDelta = target.healthScores.overall - base.healthScores.overall;

  const baseIssueMap = new Map<string, IssueItem>();
  (base.issues || []).forEach(i => baseIssueMap.set(i.title.toLowerCase().trim(), i));

  const targetIssueMap = new Map<string, IssueItem>();
  (target.issues || []).forEach(i => targetIssueMap.set(i.title.toLowerCase().trim(), i));

  let resolvedCount = 0;
  let newCount = 0;
  let worseningCount = 0;
  let improvingCount = 0;

  const diffItems: AuditSnapshotComparison['diffItems'] = [];

  // Check issues in base that are resolved in target
  baseIssueMap.forEach((baseIssue, title) => {
    const targetIssue = targetIssueMap.get(title);
    if (!targetIssue || targetIssue.status === 'RESOLVED') {
      resolvedCount++;
      diffItems.push({
        findingTitle: baseIssue.title,
        previousStatus: baseIssue.status,
        currentStatus: 'RESOLVED',
        category: baseIssue.category,
        impact: baseIssue.impact
      });
    } else {
      // Check if worsening or improving
      const sevRank = (s: string) => s === 'CRITICAL' ? 4 : s === 'HIGH' ? 3 : s === 'MEDIUM' ? 2 : 1;
      if (sevRank(targetIssue.severity) > sevRank(baseIssue.severity)) {
        worseningCount++;
      } else if (sevRank(targetIssue.severity) < sevRank(baseIssue.severity)) {
        improvingCount++;
      }
    }
  });

  // Check issues in target that are new
  targetIssueMap.forEach((targetIssue, title) => {
    if (!baseIssueMap.has(title)) {
      newCount++;
      diffItems.push({
        findingTitle: targetIssue.title,
        previousStatus: 'NOT_PRESENT',
        currentStatus: targetIssue.status,
        category: targetIssue.category,
        impact: targetIssue.impact
      });
    }
  });

  // Page diffs
  const basePages = new Set((base.semanticGraph?.nodes || []).filter(n => n.type === 'PAGE').map(n => n.url || n.id));
  const targetPages = new Set((target.semanticGraph?.nodes || []).filter(n => n.type === 'PAGE').map(n => n.url || n.id));

  const newPagesDiscovered: string[] = [];
  const removedPages: string[] = [];

  targetPages.forEach(p => {
    if (!basePages.has(p)) newPagesDiscovered.push(p);
  });

  basePages.forEach(p => {
    if (!targetPages.has(p)) removedPages.push(p);
  });

  const baseLinksCount = base.internalLinking?.totalLinks || 0;
  const targetLinksCount = target.internalLinking?.totalLinks || 0;

  const baseCoverage = base.healthScores.semantic || 0;
  const targetCoverage = target.healthScores.semantic || 0;

  return {
    baseAuditDate: base.metadata.auditDate,
    compareAuditDate: target.metadata.auditDate,
    overallScoreDelta,
    resolvedIssuesCount: resolvedCount,
    newIssuesCount: newCount,
    worseningIssuesCount: worseningCount,
    improvingIssuesCount: improvingCount,
    newPagesDiscovered,
    removedPages,
    changedInternalLinksCount: targetLinksCount - baseLinksCount,
    topicalCoverageDelta: targetCoverage - baseCoverage,
    diffItems
  };
}

/**
 * Validate imported JSON against required Lead SEO fields
 */
export function validateLeadSeoDataset(json: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (typeof json !== 'object' || json === null) {
    return { valid: false, errors: ['Invalid JSON object: Root must be an object.'] };
  }

  const obj = json as Record<string, unknown>;

  if (!obj.metadata || typeof obj.metadata !== 'object') {
    errors.push("Missing 'metadata' object.");
  } else {
    const meta = obj.metadata as Record<string, unknown>;
    if (!meta.siteUrl) errors.push("Missing 'metadata.siteUrl'");
    if (!meta.auditDate) errors.push("Missing 'metadata.auditDate'");
  }

  if (!obj.healthScores || typeof obj.healthScores !== 'object') {
    errors.push("Missing 'healthScores' object.");
  } else {
    const hs = obj.healthScores as Record<string, unknown>;
    if (typeof hs.overall !== 'number') errors.push("Missing or invalid 'healthScores.overall'");
  }

  if (!obj.semanticGraph || typeof obj.semanticGraph !== 'object') {
    errors.push("Missing 'semanticGraph' object.");
  } else {
    const sg = obj.semanticGraph as Record<string, unknown>;
    if (!Array.isArray(sg.nodes)) errors.push("Missing 'semanticGraph.nodes' array.");
    if (!Array.isArray(sg.edges)) errors.push("Missing 'semanticGraph.edges' array.");
  }

  if (!Array.isArray(obj.issues)) {
    errors.push("Missing 'issues' array.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
