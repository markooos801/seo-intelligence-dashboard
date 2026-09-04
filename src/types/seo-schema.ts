/**
 * SEO Intelligence Command Center - Data Schema
 * Target: https://nuviraspace.com
 * Source: Hermes Lead SEO & Specialist Agents
 */

export type DataAvailabilityStatus = 'AVAILABLE' | 'PARTIAL' | 'UNKNOWN' | 'BLOCKED' | 'NOT_APPLICABLE';

export type SemanticNodeType = 'SITE' | 'ENTITY' | 'TOPIC' | 'CLUSTER' | 'SUBTOPIC' | 'PAGE';

export type SemanticNodeStatus = 
  | 'COVERED' 
  | 'STRONG' 
  | 'WEAK' 
  | 'MISSING' 
  | 'ORPHAN' 
  | 'OFF-TOPIC' 
  | 'OPPORTUNITY';

export type SemanticRelationKind = 
  | 'semantic relationship' 
  | 'content relationship' 
  | 'internal-link relationship' 
  | 'canonical relationship';

export type IssueSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
export type IssueCategory = 
  | 'TECHNICAL' 
  | 'CONTENT' 
  | 'SEMANTIC' 
  | 'INTERNAL_LINKS' 
  | 'STRUCTURED_DATA' 
  | 'EEAT' 
  | 'AEO' 
  | 'PERFORMANCE';

export type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3';

export type RoadmapTimeframe = 'NOW' | 'THIS WEEK' | 'THIS MONTH' | 'LATER';

export interface AuditMetadata {
  siteUrl: string;
  siteName: string;
  auditId: string;
  auditDate: string; // ISO 8601 YYYY-MM-DD
  datasetVersion: string;
  generatedBy: string; // e.g., "Hermes Lead SEO v3.8.1"
  dataAvailability: {
    gsc: DataAvailabilityStatus;
    ga4: DataAvailabilityStatus;
    wordpress: DataAvailabilityStatus;
    bing: DataAvailabilityStatus;
    psi: DataAvailabilityStatus;
    technical: DataAvailabilityStatus;
    semantic: DataAvailabilityStatus;
    clusters: DataAvailabilityStatus;
    internalLinks: DataAvailabilityStatus;
    content: DataAvailabilityStatus;
    structuredData: DataAvailabilityStatus;
    eeat: DataAvailabilityStatus;
    aeo: DataAvailabilityStatus;
    embeddings: DataAvailabilityStatus;
  };
  notes?: string;
}

export interface HealthScores {
  overall: number; // 0-100
  technical: number;
  content: number;
  semantic: number;
  internalLinks: number;
  structuredData: number;
  eeat: number;
  aeo: number;
  searchPerformance: number;
  methodologyNote?: string;
}

export interface ExecutiveTakeaway {
  whatChanged?: string[];
  whatIsWrong: string[];
  whyItMatters: string[];
  whatToDoNext: string[];
}

export interface EvidenceItem {
  id: string;
  findingId: string;
  source: string; // e.g. "Hermes Technical Agent #4", "Chromium Render Log", "GSC API 2026-08"
  sourceType: 'CRAWL_LOG' | 'HEADLESS_RENDER' | 'API_GSC' | 'SCHEMA_VALIDATOR' | 'SPECIALIST_AGENT' | 'NLP_EMBEDDING';
  url?: string;
  timestamp: string;
  rawMetricValue?: string | number;
  snippet?: string;
  verificationStep: string;
}

export interface IssueItem {
  id: string;
  title: string;
  category: IssueCategory;
  severity: IssueSeverity;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  effort: 'HIGH' | 'MEDIUM' | 'LOW';
  priority: PriorityLevel;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'WONT_FIX';
  rootCause: string;
  affectedUrls: string[];
  evidenceIds: string[];
  recommendedAction: string;
  owner?: string;
  estimatedTrafficGain?: string;
  timeframe?: RoadmapTimeframe;
}

export interface SemanticNodeData {
  id: string;
  label: string;
  type: SemanticNodeType;
  status: SemanticNodeStatus;
  url?: string;
  clusterId?: string;
  description?: string;
  coverageScore?: number; // 0-100
  visibilityScore?: number; // 0-100
  searchVisibility?: number;
  isDimmed?: boolean;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
  inboundLinks?: number;
  outboundLinks?: number;
  contentQuality?: number;
  schemaValid?: boolean;
  eeatScore?: number;
  aeoStatus?: 'OPTIMIZED' | 'PARTIAL' | 'UNREADY';
  findingsCount?: number;
  findings?: string[];
  evidenceIds?: string[];
  semanticDistance?: number; // from topical center 0.0 - 1.0
  isOrphan?: boolean;
  isConsolidationCandidate?: boolean;
}

export interface SemanticEdgeData {
  id: string;
  source: string;
  target: string;
  relationType: 'ENTITY_TO_TOPIC' | 'TOPIC_TO_CLUSTER' | 'CLUSTER_TO_SUBTOPIC' | 'SUBTOPIC_TO_PAGE' | 'PAGE_TO_PAGE' | 'PAGE_TO_ENTITY';
  relationKind: SemanticRelationKind;
  weight?: number; // 1-10
  anchorText?: string;
  isBidirectional?: boolean;
  isBroken?: boolean;
}

export interface TopicClusterItem {
  id: string;
  name: string;
  pillarUrl: string;
  pillarTitle: string;
  supportingTopicIds: string[];
  supportingPageUrls: string[];
  coverage: number; // 0-100
  searchVisibility: number; // 0-100
  traffic: number;
  impressions: number;
  clicks: number;
  avgRanking: number;
  opportunityScore: number; // 0-100
  confidenceScore: number; // 0-100
  topicHealth: number; // 0-100
  healthBreakdown: {
    coverage: number;
    depth: number;
    connectivity: number;
    visibility: number;
    evidence: number;
  };
  gaps: Array<{
    subtopic: string;
    reason: string;
    suggestedPageType: string;
    priority: PriorityLevel;
  }>;
  opportunities: string[];
}

export interface ContentGapItem {
  id: string;
  clusterId: string;
  clusterName: string;
  coreTopic: string;
  expectedSubtopic: string;
  missingPageSuggestedUrl: string;
  suggestedPageType: 'PILLAR' | 'GUIDE' | 'SPECIFICATION' | 'CASE_STUDY' | 'COMPARISON' | 'PRODUCT_DETAIL';
  intent: 'INFORMATIONAL' | 'COMMERCIAL' | 'TRANSACTIONAL' | 'NAVIGATIONAL';
  reasonItMatters: string;
  evidence: string;
  relatedExistingUrls: string[];
  opportunityScore: number; // 0-100
  searchVolumeEstimate: string;
  priority: PriorityLevel;
}

export interface InternalLinkRelationship {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  isContextual: boolean;
  isNavigational: boolean;
  isFollow: boolean;
  status: 'VALID' | 'BROKEN_404' | 'REDIRECT_301' | 'REDIRECT_CHAIN' | 'ORPHAN';
}

export interface InternalLinkingData {
  totalLinks: number;
  internalLinksRatio: number;
  orphanPages: string[];
  hubPages: Array<{ url: string; title: string; inboundCount: number; outboundCount: number }>;
  underlinkedPages: Array<{ url: string; title: string; inboundCount: number; recommendedMin: number }>;
  overlinkedPages: Array<{ url: string; outboundCount: number; maxRecommended: number }>;
  brokenLinks: Array<{ sourceUrl: string; targetUrl: string; anchorText: string; statusCode: number }>;
  relationships: InternalLinkRelationship[];
}

export interface TechnicalAuditData {
  crawlSummary: {
    totalCrawled: number;
    indexablePages: number;
    nonIndexablePages: number;
    blockedByRobots: number;
    canonicalMismatches: number;
    redirectCount: number;
    serverErrors: number;
  };
  coreWebVitals: {
    lcpSeconds: number; // e.g. 2.1s
    fidMs: number; // e.g. 48ms
    clsScore: number; // e.g. 0.04
    inpMs: number; // e.g. 110ms
    overallStatus: 'PASS' | 'NEEDS_IMPROVEMENT' | 'FAIL';
  };
  statusCodes: Array<{ code: number; label: string; count: number }>;
  httpSecurityHeaders: Array<{ header: string; status: 'PRESENT' | 'MISSING' | 'INVALID'; notes: string }>;
  robotsTxtStatus: {
    valid: boolean;
    sitemapLinked: boolean;
    disallowedRulesCount: number;
    crawlDelay?: number;
  };
  sitemapStatus: {
    url: string;
    urlsFound: number;
    orphanedInSitemap: number;
    missingFromSitemap: number;
    validXml: boolean;
  };
  mobileParity: {
    isResponsive: boolean;
    viewportConfigured: boolean;
    tapTargetIssuesCount: number;
    fontLegibilityPass: boolean;
  };
}

export interface ContentAuditPage {
  url: string;
  title: string;
  wordCount: number;
  readabilityScore: number; // Flesch-Kincaid 0-100
  intentAlignment: 'HIGH' | 'MEDIUM' | 'LOW';
  duplicateRisk: 'NONE' | 'LOW' | 'HIGH';
  freshnessDays: number;
  contentQualityScore: number;
  primaryKeyword: string;
  keywordDensity: string;
}

export interface StructuredDataItem {
  id: string;
  url: string;
  schemaType: string; // 'Organization' | 'WebSite' | 'Service' | 'TechArticle' | 'BreadcrumbList' | 'Product'
  isValid: boolean;
  errors: string[];
  warnings: string[];
  richSnippetEligible: boolean;
  entitiesLinked: string[];
}

export interface EEATIndicator {
  dimension: 'EXPERIENCE' | 'EXPERTISE' | 'AUTHORITATIVENESS' | 'TRUSTWORTHINESS';
  score: number; // 0-100
  status: 'STRONG' | 'ADEQUATE' | 'WEAK';
  findings: string[];
  verifiedEvidence: string[];
  authorProfilesPresent: boolean;
  peerReviewedCitations: number;
  businessAddressVerified: boolean;
}

export interface AEOIntelligence {
  overallAeoReadiness: number; // 0-100
  llmCitationReadiness: 'OPTIMIZED' | 'PARTIAL' | 'POOR';
  directAnswerProbability: number; // 0-100
  faqStructurePresent: boolean;
  clearEntityDefinitionsCount: number;
  perplexityCitationIndex: number; // 0-100
  chatGptRetrievalIndex: number; // 0-100
  geminiSearchGroundingScore: number; // 0-100
  bulletPointsAndTablesRatio: number;
  actionableInsights: string[];
}

export interface SearchPerformanceData {
  gscAvailable: boolean;
  dateRange: string;
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number;
  averagePosition: number;
  historyTimeline: Array<{
    date: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  topPages: Array<{
    url: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    deltaClicks?: number;
  }>;
  topQueries: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  strikingDistanceKeywords: Array<{
    query: string;
    url: string;
    position: number; // 11-20
    impressions: number;
    potentialClicks: number;
  }>;
  lowCtrHighImpressionOpportunities: Array<{
    query: string;
    url: string;
    impressions: number;
    currentCtr: number;
    expectedCtr: number;
    action: string;
  }>;
}

export interface SiteArchitectureNode {
  id: string;
  url: string;
  title: string;
  level: number; // 0 = Homepage, 1 = Hub, 2 = Cluster, 3 = Page
  parentUrl?: string;
  childrenCount: number;
  status: 'INDEXABLE' | 'REDIRECT' | 'NOINDEX' | 'CANONICALIZED';
}

export interface AuditSnapshotComparison {
  baseAuditDate: string;
  compareAuditDate: string;
  overallScoreDelta: number;
  resolvedIssuesCount: number;
  newIssuesCount: number;
  worseningIssuesCount: number;
  improvingIssuesCount: number;
  newPagesDiscovered: string[];
  removedPages: string[];
  changedInternalLinksCount: number;
  topicalCoverageDelta: number;
  diffItems: Array<{
    findingTitle: string;
    previousStatus: string;
    currentStatus: string;
    category: IssueCategory;
    impact: string;
  }>;
}

export interface SEODashboardDataset {
  metadata: AuditMetadata;
  healthScores: HealthScores;
  executiveTakeaway: ExecutiveTakeaway;
  issues: IssueItem[];
  evidence: EvidenceItem[];
  semanticGraph: {
    nodes: SemanticNodeData[];
    edges: SemanticEdgeData[];
    topicalCenter: {
      available: boolean;
      centerEntity: string;
      dimensions: string[];
      zones: {
        core: string[]; // Node IDs
        relevantPeriphery: string[];
        distantOffTopic: string[];
      };
      reasonIfUnavailable?: string;
    };
  };
  topicClusters: TopicClusterItem[];
  contentGaps: ContentGapItem[];
  internalLinking: InternalLinkingData;
  technical: TechnicalAuditData;
  contentAudit: {
    pages: ContentAuditPage[];
    summary: {
      avgWordCount: number;
      thinContentPagesCount: number;
      duplicateRiskCount: number;
      freshnessWarningCount: number;
    };
  };
  structuredData: StructuredDataItem[];
  eeat: EEATIndicator[];
  aeo: AEOIntelligence;
  searchPerformance: SearchPerformanceData;
  siteArchitecture: SiteArchitectureNode[];
  comparison?: AuditSnapshotComparison;
  queryCategories?: QueryCategoryPerformanceItem[];
  cannibalization?: CannibalizationItem[];
  pageTypeGroups?: PageTypePerformanceGroup[];
  contentPerformanceList?: ContentPerformanceRecord[];
  releaseTimeline?: ReleaseTimelineItem[];
}

export type BrandedFilterType = 'ALL' | 'BRANDED' | 'NON-BRANDED';

export interface QueryCategoryPerformanceItem {
  query: string;
  topic: string;
  clusterId: string;
  clusterName: string;
  pageUrl: string;
  pageTitle: string;
  clicks: number;
  impressions: number;
  ctr: number;
  averagePosition: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  trendDelta: number;
  isBranded: boolean;
  opportunity: string;
  intent: 'INFORMATIONAL' | 'COMMERCIAL' | 'TRANSACTIONAL' | 'NAVIGATIONAL';
}

export interface StrikingDistanceItem {
  id: string;
  pageUrl: string;
  pageTitle: string;
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  topic: string;
  cluster: string;
  opportunity: string;
  potentialGain: number;
  difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
  evidenceId?: string;
  findingId?: string;
}

export interface CannibalizationItem {
  id: string;
  query: string;
  cluster: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  totalClicks: number;
  totalImpressions: number;
  avgPosition: number;
  competingUrls: Array<{
    url: string;
    title: string;
    position: number;
    clicks: number;
    impressions: number;
    ctr: number;
    intentMatch: 'PRIMARY' | 'SECONDARY' | 'ACCIDENTAL';
    pageType: string;
  }>;
  recommendedAction: string;
  actionDetails: string;
}

export interface PageTypePerformanceGroup {
  groupType: 'PAGE_TYPE' | 'TEMPLATE' | 'CATEGORY' | 'TOPIC_CLUSTER';
  groupName: string;
  pageCount: number;
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
  conversionRate?: number;
  topUrls: string[];
  shareOfClicks: number;
}

export interface ContentPerformanceRecord {
  url: string;
  title: string;
  createdDate: string;
  updatedDate: string;
  freshnessDays: number;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  conversions: number;
  conversionRate: number;
  cluster: string;
  pageType: string;
  historicalTrajectory: Array<{ date: string; clicks: number; position: number }>;
  status: 'HIGH_PERFORMER' | 'RISING' | 'DECAYING' | 'STAGNANT';
}

export interface ReleaseTimelineItem {
  id: string;
  date: string;
  title: string;
  category: '301_REDIRECTS' | 'INTERNAL_LINKING' | 'CONTENT_EXPANSION' | 'SCHEMA_DEPLOY' | 'TECHNICAL_PERF';
  description: string;
  affectedPages: string[];
  affectedClusters: string[];
  observedChanges: {
    periodBefore: string;
    periodAfter: string;
    clicksDeltaPercent: number;
    impressionsDeltaPercent: number;
    avgPositionDelta: number;
    metricNotes: string;
  };
  correlationAnalysis: {
    hypothesis: string;
    correlationConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'INCONCLUSIVE';
    causationDisclaimer: string; // Explains: OBSERVED CHANGE from POSSIBLE CORRELATION
    coincidingFactors: string[];
  };
}

export interface EnhancedSnapshotComparison extends AuditSnapshotComparison {
  semanticRelationshipChanges: Array<{
    type: 'ADDED' | 'REMOVED' | 'STRENGTHENED';
    source: string;
    target: string;
    kind: string;
    significance: string;
  }>;
  internalLinkChanges: {
    linksAdded: number;
    linksRemoved: number;
    newOrphanPages: string[];
    remediatedOrphanPages: string[];
    equityShiftSummary: string;
  };
  topicCoverageChanges: Array<{
    clusterName: string;
    previousCoverage: number;
    currentCoverage: number;
    delta: number;
    status: 'IMPROVED' | 'REGRESSED' | 'UNCHANGED';
  }>;
}
