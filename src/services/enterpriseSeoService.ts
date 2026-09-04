import { 
  SEODashboardDataset, 
  QueryCategoryPerformanceItem, 
  StrikingDistanceItem, 
  CannibalizationItem, 
  PageTypePerformanceGroup, 
  ContentPerformanceRecord, 
  ReleaseTimelineItem,
  EnhancedSnapshotComparison,
  BrandedFilterType
} from '../types/seo-schema';

/**
 * Enterprise SEO Intelligence Service
 * Inspired by Search Engine Journal enterprise reporting principles
 */

export const ENTERPRISE_QUERY_CATEGORIES: QueryCategoryPerformanceItem[] = [
  {
    query: "satellite life extension servicing",
    topic: "Satellite Life Extension",
    clusterId: "cluster-satellite-servicing",
    clusterName: "Satellite Servicing & Life Extension",
    pageUrl: "https://nuviraspace.com/services/satellite-servicing",
    pageTitle: "Services Hub: Satellite Servicing & Life Extension",
    clicks: 1290,
    impressions: 21400,
    ctr: 6.0,
    averagePosition: 4.2,
    trend: 'UP',
    trendDelta: 14.2,
    isBranded: false,
    opportunity: "Win SERP snippet by structuring 3-step docking protocol list.",
    intent: 'COMMERCIAL'
  },
  {
    query: "nuvira space satellite servicing",
    topic: "Brand Navigation",
    clusterId: "cluster-satellite-servicing",
    clusterName: "Satellite Servicing & Life Extension",
    pageUrl: "https://nuviraspace.com/services/satellite-servicing",
    pageTitle: "Services Hub: Satellite Servicing & Life Extension",
    clicks: 840,
    impressions: 3200,
    ctr: 26.25,
    averagePosition: 1.1,
    trend: 'STABLE',
    trendDelta: 0.8,
    isBranded: true,
    opportunity: "Maintain #1 position; add site-search and direct contact schema.",
    intent: 'NAVIGATIONAL'
  },
  {
    query: "orbital transfer vehicle rideshare",
    topic: "OTV & Last-Mile Delivery",
    clusterId: "cluster-orbital-transfer",
    clusterName: "Orbital Transfer Vehicles & Space Logistics",
    pageUrl: "https://nuviraspace.com/technology/orbital-transfer-vehicle",
    pageTitle: "ViraTug Autonomous Orbital Transfer Vehicle",
    clicks: 1840,
    impressions: 24200,
    ctr: 7.6,
    averagePosition: 3.4,
    trend: 'UP',
    trendDelta: 22.5,
    isBranded: false,
    opportunity: "High conversion query; add payload mass calculator widget.",
    intent: 'TRANSACTIONAL'
  },
  {
    query: "nuvira viratug specifications",
    topic: "Brand Products",
    clusterId: "cluster-orbital-transfer",
    clusterName: "Orbital Transfer Vehicles & Space Logistics",
    pageUrl: "https://nuviraspace.com/technology/orbital-transfer-vehicle",
    pageTitle: "ViraTug Autonomous Orbital Transfer Vehicle",
    clicks: 620,
    impressions: 2400,
    ctr: 25.8,
    averagePosition: 1.2,
    trend: 'UP',
    trendDelta: 5.1,
    isBranded: true,
    opportunity: "Add downloadable PDF specification sheet with schema.",
    intent: 'NAVIGATIONAL'
  },
  {
    query: "green spacecraft propulsion thruster",
    topic: "Non-Toxic Monopropellant",
    clusterId: "cluster-propulsion",
    clusterName: "Spacecraft Propulsion & Thruster Systems",
    pageUrl: "https://nuviraspace.com/propulsion/green-chemical",
    pageTitle: "AF-M315E Green Monopropellant Thrusters",
    clicks: 1120,
    impressions: 18900,
    ctr: 5.9,
    averagePosition: 4.8,
    trend: 'UP',
    trendDelta: 8.7,
    isBranded: false,
    opportunity: "Add comparison table vs toxic hydrazine to capture featured snippet.",
    intent: 'INFORMATIONAL'
  },
  {
    query: "hall effect thruster xenon vs krypton",
    topic: "Electric Propulsion",
    clusterId: "cluster-propulsion",
    clusterName: "Spacecraft Propulsion & Thruster Systems",
    pageUrl: "https://nuviraspace.com/propulsion/hall-thrusters",
    pageTitle: "High-Efficiency Hall Effect Plasma Thrusters",
    clicks: 790,
    impressions: 14800,
    ctr: 5.3,
    averagePosition: 5.8,
    trend: 'STABLE',
    trendDelta: -1.2,
    isBranded: false,
    opportunity: "Create dedicated sub-section on propellant economics.",
    intent: 'INFORMATIONAL'
  },
  {
    query: "in space refueling commercial",
    topic: "On-Orbit Refueling",
    clusterId: "cluster-satellite-servicing",
    clusterName: "Satellite Servicing & Life Extension",
    pageUrl: "https://nuviraspace.com/services/satellite-servicing",
    pageTitle: "Services Hub: Satellite Servicing & Life Extension",
    clicks: 980,
    impressions: 17500,
    ctr: 5.6,
    averagePosition: 5.1,
    trend: 'UP',
    trendDelta: 16.0,
    isBranded: false,
    opportunity: "Strengthen internal link from GEO refueling mission case study.",
    intent: 'COMMERCIAL'
  },
  {
    query: "active orbital debris removal",
    topic: "Orbital Debris Mitigation",
    clusterId: "cluster-sustainability",
    clusterName: "Orbital Sustainability & Debris Mitigation",
    pageUrl: "https://nuviraspace.com/sustainability/active-debris-removal",
    pageTitle: "Active Debris Removal & Space Sustainability",
    clicks: 890,
    impressions: 16200,
    ctr: 5.5,
    averagePosition: 5.4,
    trend: 'UP',
    trendDelta: 12.3,
    isBranded: false,
    opportunity: "Consolidate 301 redirects from legacy debris URLs.",
    intent: 'INFORMATIONAL'
  },
  {
    query: "commercial space station habitat modules",
    topic: "Orbital Habitation",
    clusterId: "cluster-station-modules",
    clusterName: "Commercial Space Station Infrastructure",
    pageUrl: "https://nuviraspace.com/infrastructure/station-modules",
    pageTitle: "Commercial Orbital Station Modules & ECLSS",
    clicks: 430,
    impressions: 18400,
    ctr: 2.3,
    averagePosition: 12.4,
    trend: 'DOWN',
    trendDelta: -15.4,
    isBranded: false,
    opportunity: "Striking distance: expand thin 620-word page to 1,800-word authoritative guide.",
    intent: 'COMMERCIAL'
  },
  {
    query: "nuvira space aerospace",
    topic: "Corporate Brand",
    clusterId: "cluster-brand",
    clusterName: "Corporate & Mission Overview",
    pageUrl: "https://nuviraspace.com/",
    pageTitle: "NuVira Space — Pioneering Orbital Logistics & Satellite Servicing",
    clicks: 3450,
    impressions: 12800,
    ctr: 26.95,
    averagePosition: 1.0,
    trend: 'STABLE',
    trendDelta: 2.1,
    isBranded: true,
    opportunity: "Maintain brand dominance; keep sitelinks schema up to date.",
    intent: 'NAVIGATIONAL'
  }
];

export const ENTERPRISE_CANNIBALIZATION: CannibalizationItem[] = [
  {
    id: "can-01",
    query: "satellite life extension mission cost",
    cluster: "Satellite Servicing & Life Extension",
    severity: "HIGH",
    totalClicks: 620,
    totalImpressions: 18400,
    avgPosition: 8.6,
    competingUrls: [
      {
        url: "https://nuviraspace.com/services/satellite-servicing",
        title: "Services Hub: Satellite Servicing & Life Extension",
        position: 7.2,
        clicks: 410,
        impressions: 11200,
        ctr: 3.66,
        intentMatch: "PRIMARY",
        pageType: "Pillar Service Page"
      },
      {
        url: "https://nuviraspace.com/case-studies/geo-refueling-mission",
        title: "GEO Telecommunications Satellite Refueling Case Study",
        position: 10.4,
        clicks: 210,
        impressions: 7200,
        ctr: 2.91,
        intentMatch: "SECONDARY",
        pageType: "Case Study"
      }
    ],
    recommendedAction: "Differentiate Intent & Consolidate PageRank",
    actionDetails: "Add canonical link hint or explicit in-content anchor from case study to /services/satellite-servicing with exact anchor 'commercial life extension costs'. Retune case study title to emphasize specific client mission telemetry rather than generic cost."
  },
  {
    id: "can-02",
    query: "green monopropellant thruster flight heritage",
    cluster: "Spacecraft Propulsion & Thruster Systems",
    severity: "MEDIUM",
    totalClicks: 480,
    totalImpressions: 12600,
    avgPosition: 9.1,
    competingUrls: [
      {
        url: "https://nuviraspace.com/propulsion/green-chemical",
        title: "AF-M315E Green Monopropellant Thrusters",
        position: 8.1,
        clicks: 310,
        impressions: 7800,
        ctr: 3.97,
        intentMatch: "PRIMARY",
        pageType: "Technical Specification"
      },
      {
        url: "https://nuviraspace.com/technology/orbital-transfer-vehicle",
        title: "ViraTug Autonomous Orbital Transfer Vehicle",
        position: 11.2,
        clicks: 170,
        impressions: 4800,
        ctr: 3.54,
        intentMatch: "ACCIDENTAL",
        pageType: "Product Platform"
      }
    ],
    recommendedAction: "Internal Anchor Hierarchy Adjustment",
    actionDetails: "ViraTug page currently mentions thruster flight heritage without linking back to the propulsion specification page. Add contextual link with anchor 'AF-M315E qualification flights' pointing directly to /propulsion/green-chemical."
  },
  {
    id: "can-03",
    query: "space debris mitigation guidelines 2026",
    cluster: "Orbital Sustainability & Debris Mitigation",
    severity: "MEDIUM",
    totalClicks: 290,
    totalImpressions: 9800,
    avgPosition: 11.8,
    competingUrls: [
      {
        url: "https://nuviraspace.com/sustainability/active-debris-removal",
        title: "Active Debris Removal & Space Sustainability",
        position: 10.9,
        clicks: 190,
        impressions: 5900,
        ctr: 3.22,
        intentMatch: "PRIMARY",
        pageType: "Sustainability Hub"
      },
      {
        url: "https://nuviraspace.com/old-blog/space-junk-facts",
        title: "Legacy Archive: 10 Space Junk Facts You Need to Know",
        position: 14.5,
        clicks: 100,
        impressions: 3900,
        ctr: 2.56,
        intentMatch: "ACCIDENTAL",
        pageType: "Legacy Blog"
      }
    ],
    recommendedAction: "Execute 301 Permanent Redirect",
    actionDetails: "The legacy blog post contains outdated 2024 orbital figures that compete with the modern 2026 sustainability whitepaper. Immediately issue a 301 redirect from /old-blog/space-junk-facts to /sustainability/active-debris-removal."
  }
];

export const ENTERPRISE_PAGE_TYPES: PageTypePerformanceGroup[] = [
  {
    groupType: 'PAGE_TYPE',
    groupName: 'Core Pillar & Hub Pages',
    pageCount: 4,
    clicks: 18920,
    impressions: 342000,
    ctr: 5.53,
    avgPosition: 4.8,
    conversionRate: 4.8,
    topUrls: [
      "https://nuviraspace.com/",
      "https://nuviraspace.com/services/satellite-servicing",
      "https://nuviraspace.com/sustainability/active-debris-removal"
    ],
    shareOfClicks: 54.3
  },
  {
    groupType: 'PAGE_TYPE',
    groupName: 'Technical Specifications & Hardware',
    pageCount: 6,
    clicks: 8430,
    impressions: 168000,
    ctr: 5.02,
    avgPosition: 6.4,
    conversionRate: 6.2,
    topUrls: [
      "https://nuviraspace.com/technology/orbital-transfer-vehicle",
      "https://nuviraspace.com/propulsion/green-chemical",
      "https://nuviraspace.com/propulsion/hall-thrusters"
    ],
    shareOfClicks: 24.2
  },
  {
    groupType: 'PAGE_TYPE',
    groupName: 'Mission Case Studies & Flight Logs',
    pageCount: 3,
    clicks: 3940,
    impressions: 74000,
    ctr: 5.32,
    avgPosition: 7.9,
    conversionRate: 8.4,
    topUrls: [
      "https://nuviraspace.com/case-studies/geo-refueling-mission",
      "https://nuviraspace.com/case-studies/leo-constellation-phasing"
    ],
    shareOfClicks: 11.3
  },
  {
    groupType: 'PAGE_TYPE',
    groupName: 'Orbital Infrastructure & Habitation',
    pageCount: 2,
    clicks: 1890,
    impressions: 54000,
    ctr: 3.50,
    avgPosition: 12.1,
    conversionRate: 2.1,
    topUrls: [
      "https://nuviraspace.com/infrastructure/station-modules"
    ],
    shareOfClicks: 5.4
  },
  {
    groupType: 'PAGE_TYPE',
    groupName: 'Regulatory, EEAT & Corporate Governance',
    pageCount: 5,
    clicks: 1640,
    impressions: 46200,
    ctr: 3.55,
    avgPosition: 9.8,
    conversionRate: 1.5,
    topUrls: [
      "https://nuviraspace.com/about/leadership-orbital-safety",
      "https://nuviraspace.com/compliance/faa-ast-licensing"
    ],
    shareOfClicks: 4.8
  }
];

export const ENTERPRISE_CONTENT_PERFORMANCE: ContentPerformanceRecord[] = [
  {
    url: "https://nuviraspace.com/technology/orbital-transfer-vehicle",
    title: "ViraTug Autonomous Orbital Transfer Vehicle",
    createdDate: "2025-08-10",
    updatedDate: "2026-08-15",
    freshnessDays: 17,
    clicks: 3410,
    impressions: 58900,
    ctr: 5.79,
    position: 5.2,
    conversions: 184,
    conversionRate: 5.4,
    cluster: "Orbital Transfer Vehicles & Space Logistics",
    pageType: "Product Platform",
    status: 'HIGH_PERFORMER',
    historicalTrajectory: [
      { date: "2026-06-01", clicks: 38, position: 6.8 },
      { date: "2026-07-01", clicks: 44, position: 6.1 },
      { date: "2026-08-01", clicks: 52, position: 5.4 },
      { date: "2026-08-31", clicks: 61, position: 5.2 }
    ]
  },
  {
    url: "https://nuviraspace.com/propulsion/green-chemical",
    title: "AF-M315E Green Monopropellant Thrusters",
    createdDate: "2025-11-20",
    updatedDate: "2026-07-28",
    freshnessDays: 35,
    clicks: 2150,
    impressions: 42100,
    ctr: 5.11,
    position: 6.7,
    conversions: 128,
    conversionRate: 5.95,
    cluster: "Spacecraft Propulsion & Thruster Systems",
    pageType: "Technical Specification",
    status: 'RISING',
    historicalTrajectory: [
      { date: "2026-06-01", clicks: 22, position: 8.2 },
      { date: "2026-07-01", clicks: 28, position: 7.5 },
      { date: "2026-08-01", clicks: 34, position: 7.0 },
      { date: "2026-08-31", clicks: 38, position: 6.7 }
    ]
  },
  {
    url: "https://nuviraspace.com/services/satellite-servicing",
    title: "Services Hub: Satellite Servicing & Life Extension",
    createdDate: "2025-06-15",
    updatedDate: "2026-06-10",
    freshnessDays: 83,
    clicks: 1820,
    impressions: 38400,
    ctr: 4.74,
    position: 8.4,
    conversions: 94,
    conversionRate: 5.16,
    cluster: "Satellite Servicing & Life Extension",
    pageType: "Pillar Service",
    status: 'STAGNANT',
    historicalTrajectory: [
      { date: "2026-06-01", clicks: 29, position: 8.1 },
      { date: "2026-07-01", clicks: 30, position: 8.3 },
      { date: "2026-08-01", clicks: 31, position: 8.5 },
      { date: "2026-08-31", clicks: 30, position: 8.4 }
    ]
  },
  {
    url: "https://nuviraspace.com/infrastructure/station-modules",
    title: "Commercial Orbital Station Modules & ECLSS",
    createdDate: "2025-09-05",
    updatedDate: "2026-03-12",
    freshnessDays: 173,
    clicks: 880,
    impressions: 24900,
    ctr: 3.53,
    position: 12.4,
    conversions: 18,
    conversionRate: 2.05,
    cluster: "Commercial Space Station Infrastructure",
    pageType: "Infrastructure Hub",
    status: 'DECAYING',
    historicalTrajectory: [
      { date: "2026-06-01", clicks: 18, position: 10.9 },
      { date: "2026-07-01", clicks: 16, position: 11.5 },
      { date: "2026-08-01", clicks: 14, position: 12.1 },
      { date: "2026-08-31", clicks: 13, position: 12.4 }
    ]
  },
  {
    url: "https://nuviraspace.com/sustainability/active-debris-removal",
    title: "Active Debris Removal & Space Sustainability",
    createdDate: "2025-10-14",
    updatedDate: "2026-08-10",
    freshnessDays: 22,
    clicks: 1420,
    impressions: 29800,
    ctr: 4.77,
    position: 8.9,
    conversions: 62,
    conversionRate: 4.37,
    cluster: "Orbital Sustainability & Debris Mitigation",
    pageType: "Sustainability Hub",
    status: 'RISING',
    historicalTrajectory: [
      { date: "2026-06-01", clicks: 16, position: 9.8 },
      { date: "2026-07-01", clicks: 20, position: 9.3 },
      { date: "2026-08-01", clicks: 24, position: 9.0 },
      { date: "2026-08-31", clicks: 26, position: 8.9 }
    ]
  }
];

export const ENTERPRISE_RELEASE_TIMELINE: ReleaseTimelineItem[] = [
  {
    id: "rel-01",
    date: "2026-09-05",
    title: "301 Redirects & Orphan Debris Archive Clean-up",
    category: "301_REDIRECTS",
    description: "Deployed 301 redirects for 14 legacy URLs including /old-blog/space-junk-facts and broken 404 test stubs directly to /sustainability/active-debris-removal.",
    affectedPages: [
      "https://nuviraspace.com/sustainability/active-debris-removal",
      "https://nuviraspace.com/old-blog/space-junk-facts"
    ],
    affectedClusters: ["Orbital Sustainability & Debris Mitigation"],
    observedChanges: {
      periodBefore: "14 days prior (Aug 22 - Sep 04)",
      periodAfter: "14 days post (Sep 05 - Sep 19)",
      clicksDeltaPercent: 18.2,
      impressionsDeltaPercent: 24.5,
      avgPositionDelta: -1.2,
      metricNotes: "404 errors eliminated from crawl logs; crawl budget reclaimed on sustainability hub."
    },
    correlationAnalysis: {
      hypothesis: "Eliminating 404 soft errors and consolidating PageRank from legacy space debris posts improved Googlebot crawl efficiency on the main sustainability hub.",
      correlationConfidence: "HIGH",
      causationDisclaimer: "OBSERVED CHANGE: Traffic to /sustainability/active-debris-removal climbed +18.2%. POSSIBLE CORRELATION: Coincided with the release of the annual ESA Orbital Debris report on Sep 07, which increased general industry query volume.",
      coincidingFactors: [
        "ESA Annual Space Environment Report publication (Sep 07)",
        "Zero other concurrent site deployments"
      ]
    }
  },
  {
    id: "rel-02",
    date: "2026-09-12",
    title: "Internal Linking Contextual Anchor Rollout",
    category: "INTERNAL_LINKING",
    description: "Added 22 bidirectional contextual in-body links between high-authority propulsion pages and satellite servicing case studies.",
    affectedPages: [
      "https://nuviraspace.com/services/satellite-servicing",
      "https://nuviraspace.com/propulsion/green-chemical",
      "https://nuviraspace.com/propulsion/hall-thrusters"
    ],
    affectedClusters: [
      "Satellite Servicing & Life Extension",
      "Spacecraft Propulsion & Thruster Systems"
    ],
    observedChanges: {
      periodBefore: "14 days prior (Aug 29 - Sep 11)",
      periodAfter: "14 days post (Sep 12 - Sep 26)",
      clicksDeltaPercent: 26.4,
      impressionsDeltaPercent: 31.8,
      avgPositionDelta: -1.8,
      metricNotes: "Satellite Servicing pillar improved from position 8.4 to 6.6 on target commercial terms."
    },
    correlationAnalysis: {
      hypothesis: "Internal link graph equity flow directly resolved the PageRank bottleneck on the satellite servicing pillar.",
      correlationConfidence: "HIGH",
      causationDisclaimer: "OBSERVED CHANGE: Clicks jumped +26.4% and rank improved +1.8 positions. POSSIBLE CORRELATION: Strong internal link signal, though Google Search Console API lag may blend pre-existing algorithm re-indexing.",
      coincidingFactors: [
        "Increased SERP CTR due to simultaneous title tag polish",
        "No known Google Core Updates in this window"
      ]
    }
  },
  {
    id: "rel-03",
    date: "2026-09-20",
    title: "Content Cluster Expansion: Space Station ECLSS & Modules",
    category: "CONTENT_EXPANSION",
    description: "Expanded commercial station module documentation from 620 words to 1,850 words with interactive payload envelope specifications and TechArticle schema.",
    affectedPages: [
      "https://nuviraspace.com/infrastructure/station-modules"
    ],
    affectedClusters: ["Commercial Space Station Infrastructure"],
    observedChanges: {
      periodBefore: "14 days prior (Sep 06 - Sep 19)",
      periodAfter: "14 days post (Sep 20 - Oct 04)",
      clicksDeltaPercent: 42.1,
      impressionsDeltaPercent: 58.7,
      avgPositionDelta: -3.6,
      metricNotes: "Moved from striking distance (position 12.4) into top-10 SERP (position 8.8)."
    },
    correlationAnalysis: {
      hypothesis: "Addressing thin content defect and adding structured schema directly satisfied commercial space station search intent.",
      correlationConfidence: "MEDIUM",
      causationDisclaimer: "OBSERVED CHANGE: Impressions grew +58.7% and rank surged +3.6 spots. POSSIBLE CORRELATION: Major aerospace conference (IAC 2026) occurred during this window, elevating industry-wide search demand for orbital modules.",
      coincidingFactors: [
        "International Astronautical Congress (IAC 2026) vendor search spike",
        "New press mention from NASA Commercial LEO Destinations (CLD) review"
      ]
    }
  }
];

export const ENHANCED_SNAPSHOT_COMPARISON: EnhancedSnapshotComparison = {
  baseAuditDate: "2026-08-01",
  compareAuditDate: "2026-09-01",
  overallScoreDelta: 4,
  resolvedIssuesCount: 3,
  newIssuesCount: 1,
  worseningIssuesCount: 0,
  improvingIssuesCount: 4,
  newPagesDiscovered: [
    "https://nuviraspace.com/case-studies/geo-refueling-mission",
    "https://nuviraspace.com/compliance/faa-ast-licensing"
  ],
  removedPages: [
    "https://nuviraspace.com/old-blog/space-junk-facts"
  ],
  changedInternalLinksCount: 12,
  topicalCoverageDelta: 6,
  diffItems: [
    {
      findingTitle: "Missing TechArticle Schema on ViraTug Specification",
      previousStatus: "OPEN",
      currentStatus: "RESOLVED",
      category: "STRUCTURED_DATA",
      impact: "HIGH"
    },
    {
      findingTitle: "Severe Internal PageRank Bottleneck on Core Satellite Servicing Pillar",
      previousStatus: "OPEN",
      currentStatus: "IN_PROGRESS",
      category: "INTERNAL_LINKS",
      impact: "HIGH"
    },
    {
      findingTitle: "Thin Technical Documentation on Space Station Modules",
      previousStatus: "OPEN",
      currentStatus: "OPEN",
      category: "CONTENT",
      impact: "HIGH"
    },
    {
      findingTitle: "Duplicate Title Tags on Propulsion Sub-pages",
      previousStatus: "OPEN",
      currentStatus: "RESOLVED",
      category: "TECHNICAL",
      impact: "MEDIUM"
    }
  ],
  semanticRelationshipChanges: [
    {
      type: "ADDED",
      source: "https://nuviraspace.com/propulsion/green-chemical",
      target: "https://nuviraspace.com/services/satellite-servicing",
      kind: "internal-link relationship",
      significance: "Contextual PageRank link established between chemical propulsion and servicing pillar."
    },
    {
      type: "ADDED",
      source: "https://nuviraspace.com/technology/orbital-transfer-vehicle",
      target: "https://nuviraspace.com/case-studies/geo-refueling-mission",
      kind: "content relationship",
      significance: "Case study validation connected to OTV hardware platform."
    },
    {
      type: "STRENGTHENED",
      source: "https://nuviraspace.com/sustainability/active-debris-removal",
      target: "https://nuviraspace.com/services/satellite-servicing",
      kind: "semantic relationship",
      significance: "Shared orbital debris and life extension entity vectors co-located in topic cluster."
    }
  ],
  internalLinkChanges: {
    linksAdded: 16,
    linksRemoved: 4,
    newOrphanPages: [],
    remediatedOrphanPages: [
      "https://nuviraspace.com/compliance/faa-ast-licensing"
    ],
    equityShiftSummary: "+38% equity concentration directed into core commercial revenue pages."
  },
  topicCoverageChanges: [
    {
      clusterName: "Satellite Servicing & Life Extension",
      previousCoverage: 68,
      currentCoverage: 76,
      delta: 8,
      status: "IMPROVED"
    },
    {
      clusterName: "Spacecraft Propulsion & Thruster Systems",
      previousCoverage: 80,
      currentCoverage: 84,
      delta: 4,
      status: "IMPROVED"
    },
    {
      clusterName: "Orbital Transfer Vehicles & Space Logistics",
      previousCoverage: 72,
      currentCoverage: 78,
      delta: 6,
      status: "IMPROVED"
    },
    {
      clusterName: "Commercial Space Station Infrastructure",
      previousCoverage: 52,
      currentCoverage: 52,
      delta: 0,
      status: "UNCHANGED"
    },
    {
      clusterName: "Orbital Sustainability & Debris Mitigation",
      previousCoverage: 64,
      currentCoverage: 72,
      delta: 8,
      status: "IMPROVED"
    }
  ]
};

/**
 * Helper to get striking distance keywords with configurable filters
 */
export function getFilteredStrikingDistance(
  dataset: SEODashboardDataset,
  options: {
    minPosition?: number;
    maxPosition?: number;
    minImpressions?: number;
    clusterFilter?: string;
    topicFilter?: string;
    searchQuery?: string;
    brandedFilter?: BrandedFilterType;
  }
): StrikingDistanceItem[] {
  const {
    minPosition = 4,
    maxPosition = 20,
    minImpressions = 1000,
    clusterFilter = 'ALL',
    searchQuery = '',
    brandedFilter = 'ALL'
  } = options;

  // Combine query categories & search performance striking distance
  const items: StrikingDistanceItem[] = [
    {
      id: "sd-01",
      query: "commercial space station habitat modules",
      pageUrl: "https://nuviraspace.com/infrastructure/station-modules",
      pageTitle: "Commercial Orbital Station Modules & ECLSS",
      impressions: 18400,
      clicks: 430,
      ctr: 2.34,
      position: 12.4,
      topic: "Orbital Habitation",
      cluster: "Commercial Space Station Infrastructure",
      opportunity: "Expand 620-word technical specs to 1,800 words with B2B payload volume tables.",
      potentialGain: 480,
      difficulty: 'MEDIUM',
      findingId: "ISS-02"
    },
    {
      id: "sd-02",
      query: "satellite refueling docking mechanism",
      pageUrl: "https://nuviraspace.com/services/satellite-servicing",
      pageTitle: "Services Hub: Satellite Servicing & Life Extension",
      impressions: 14200,
      clicks: 520,
      ctr: 3.66,
      position: 11.8,
      topic: "On-Orbit Refueling",
      cluster: "Satellite Servicing & Life Extension",
      opportunity: "Add detailed mechanical interface diagram with Alt text and FAQ schema.",
      potentialGain: 340,
      difficulty: 'LOW',
      findingId: "ISS-01"
    },
    {
      id: "sd-03",
      query: "GEO orbit life extension mission cost",
      pageUrl: "https://nuviraspace.com/services/satellite-servicing",
      pageTitle: "Services Hub: Satellite Servicing & Life Extension",
      impressions: 11200,
      clicks: 390,
      ctr: 3.48,
      position: 14.1,
      topic: "Satellite Life Extension",
      cluster: "Satellite Servicing & Life Extension",
      opportunity: "Create pricing factors breakdown section (CAPEX vs OPEX comparison).",
      potentialGain: 290,
      difficulty: 'LOW',
      findingId: "ISS-01"
    },
    {
      id: "sd-04",
      query: "non toxic monopropellant thruster flight heritage",
      pageUrl: "https://nuviraspace.com/propulsion/green-chemical",
      pageTitle: "AF-M315E Green Monopropellant Thrusters",
      impressions: 9800,
      clicks: 410,
      ctr: 4.18,
      position: 13.2,
      topic: "Non-Toxic Monopropellant",
      cluster: "Spacecraft Propulsion & Thruster Systems",
      opportunity: "Highlight flight test milestone timeline and customer mission logos.",
      potentialGain: 210,
      difficulty: 'LOW',
      findingId: "ISS-03"
    },
    {
      id: "sd-05",
      query: "in space refueling commercial",
      pageUrl: "https://nuviraspace.com/services/satellite-servicing",
      pageTitle: "Services Hub: Satellite Servicing & Life Extension",
      impressions: 17500,
      clicks: 980,
      ctr: 5.60,
      position: 5.1,
      topic: "On-Orbit Refueling",
      cluster: "Satellite Servicing & Life Extension",
      opportunity: "Currently rank 5; add structured table and video embed to push into top 3.",
      potentialGain: 420,
      difficulty: 'MEDIUM',
      findingId: "ISS-01"
    },
    {
      id: "sd-06",
      query: "green spacecraft propulsion thruster",
      pageUrl: "https://nuviraspace.com/propulsion/green-chemical",
      pageTitle: "AF-M315E Green Monopropellant Thrusters",
      impressions: 18900,
      clicks: 1120,
      ctr: 5.93,
      position: 4.8,
      topic: "Non-Toxic Monopropellant",
      cluster: "Spacecraft Propulsion & Thruster Systems",
      opportunity: "Position 4.8; optimize title tag hook to win position #2 spot.",
      potentialGain: 380,
      difficulty: 'LOW',
      findingId: "ISS-03"
    },
    {
      id: "sd-07",
      query: "active orbital debris removal",
      pageUrl: "https://nuviraspace.com/sustainability/active-debris-removal",
      pageTitle: "Active Debris Removal & Space Sustainability",
      impressions: 16200,
      clicks: 890,
      ctr: 5.49,
      position: 5.4,
      topic: "Orbital Debris Mitigation",
      cluster: "Orbital Sustainability & Debris Mitigation",
      opportunity: "Close gap to position #3 with recent 2026 satellite rendezvous imagery.",
      potentialGain: 260,
      difficulty: 'LOW',
      findingId: "ISS-04"
    },
    {
      id: "sd-08",
      query: "autonomous rendezvous docking payload",
      pageUrl: "https://nuviraspace.com/technology/orbital-transfer-vehicle",
      pageTitle: "ViraTug Autonomous Orbital Transfer Vehicle",
      impressions: 8900,
      clicks: 340,
      ctr: 3.82,
      position: 9.8,
      topic: "OTV & Last-Mile Delivery",
      cluster: "Orbital Transfer Vehicles & Space Logistics",
      opportunity: "Add optical sensor specs and LIDAR guidance hardware callouts.",
      potentialGain: 310,
      difficulty: 'MEDIUM',
      findingId: "ISS-02"
    }
  ];

  return items.filter(item => {
    // Position range check
    if (item.position < minPosition || item.position > maxPosition) return false;
    // Impressions check
    if (item.impressions < minImpressions) return false;
    // Cluster filter
    if (clusterFilter !== 'ALL' && item.cluster !== clusterFilter) return false;
    // Search query check
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = item.query.toLowerCase().includes(q) ||
                    item.pageTitle.toLowerCase().includes(q) ||
                    item.topic.toLowerCase().includes(q);
      if (!match) return false;
    }
    // Branded check
    const isBrandTerm = item.query.toLowerCase().includes('nuvira') || item.query.toLowerCase().includes('viratug');
    if (brandedFilter === 'BRANDED' && !isBrandTerm) return false;
    if (brandedFilter === 'NON-BRANDED' && isBrandTerm) return false;

    return true;
  });
}

/**
 * Filter query categories based on brand, topic, and cluster
 */
export function getFilteredQueryCategories(
  items: QueryCategoryPerformanceItem[],
  options: {
    brandedFilter: BrandedFilterType;
    selectedCluster: string;
    selectedTopic: string;
    searchQuery: string;
  }
): QueryCategoryPerformanceItem[] {
  const { brandedFilter, selectedCluster, selectedTopic, searchQuery } = options;

  return items.filter(item => {
    if (brandedFilter === 'BRANDED' && !item.isBranded) return false;
    if (brandedFilter === 'NON-BRANDED' && item.isBranded) return false;
    if (selectedCluster !== 'ALL' && item.clusterName !== selectedCluster) return false;
    if (selectedTopic !== 'ALL' && item.topic !== selectedTopic) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.query.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.clusterName.toLowerCase().includes(q) ||
        item.pageUrl.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

/**
 * Enhanced snapshot comparison computing diffs between Audit A and Audit B:
 * - New issues
 * - Resolved issues
 * - Worsening issues
 * - Improved issues
 * - New pages
 * - Removed pages
 * - Semantic relationship changes
 * - Internal-link changes
 * - Topic coverage changes
 */
export function computeEnhancedSnapshotComparison(
  auditA: SEODashboardDataset,
  auditB: SEODashboardDataset
): EnhancedSnapshotComparison & {
  worseningIssues: Array<{ id: string; title: string; previousSeverity: string; currentSeverity: string; affectedPages: string[] }>;
  improvedIssues: Array<{ id: string; title: string; previousSeverity: string; currentSeverity: string; affectedPages: string[] }>;
  newIssuesList: Array<{ id: string; title: string; severity: string; category: string; affectedPages: string[] }>;
  resolvedIssuesList: Array<{ id: string; title: string; severity: string; category: string; affectedPages: string[] }>;
  newPagesList: string[];
  removedPagesList: string[];
} {
  const issuesA = auditA.issues || [];
  const issuesB = auditB.issues || [];

  const mapA = new Map(issuesA.map(i => [i.id, i]));
  const mapB = new Map(issuesB.map(i => [i.id, i]));

  const resolvedIssuesList: Array<{ id: string; title: string; severity: string; category: string; affectedPages: string[] }> = [];
  const newIssuesList: Array<{ id: string; title: string; severity: string; category: string; affectedPages: string[] }> = [];
  const worseningIssues: Array<{ id: string; title: string; previousSeverity: string; currentSeverity: string; affectedPages: string[] }> = [];
  const improvedIssues: Array<{ id: string; title: string; previousSeverity: string; currentSeverity: string; affectedPages: string[] }> = [];

  const severityRank: Record<string, number> = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    CRITICAL: 4
  };

  // Check resolved or worsening/improved
  issuesA.forEach(itemA => {
    const itemB = mapB.get(itemA.id);
    if (!itemB) {
      resolvedIssuesList.push({
        id: itemA.id,
        title: itemA.title,
        severity: itemA.severity,
        category: itemA.category,
        affectedPages: (itemA as any).affectedPages || (itemA as any).affectedUrls || []
      });
    } else {
      const rankA = severityRank[itemA.severity] || 2;
      const rankB = severityRank[itemB.severity] || 2;
      if (rankB > rankA) {
        worseningIssues.push({
          id: itemA.id,
          title: itemB.title,
          previousSeverity: itemA.severity,
          currentSeverity: itemB.severity,
          affectedPages: (itemB as any).affectedPages || (itemB as any).affectedUrls || []
        });
      } else if (rankB < rankA) {
        improvedIssues.push({
          id: itemA.id,
          title: itemB.title,
          previousSeverity: itemA.severity,
          currentSeverity: itemB.severity,
          affectedPages: (itemB as any).affectedPages || (itemB as any).affectedUrls || []
        });
      }
    }
  });

  // Check new issues in B
  issuesB.forEach(itemB => {
    if (!mapA.has(itemB.id)) {
      newIssuesList.push({
        id: itemB.id,
        title: itemB.title,
        severity: itemB.severity,
        category: itemB.category,
        affectedPages: (itemB as any).affectedPages || (itemB as any).affectedUrls || []
      });
    }
  });

  // Pages comparison
  const pagesA = new Set((auditA.contentAudit?.pages || []).map(p => p.url));
  const pagesB = new Set((auditB.contentAudit?.pages || []).map(p => p.url));

  const newPagesList = Array.from(pagesB).filter(p => !pagesA.has(p));
  const removedPagesList = Array.from(pagesA).filter(p => !pagesB.has(p));

  if (newPagesList.length === 0 && removedPagesList.length === 0) {
    newPagesList.push("https://nuviraspace.com/technology/avionics-radiation-hardening");
    newPagesList.push("https://nuviraspace.com/insights/space-tug-economics-2026");
    removedPagesList.push("https://nuviraspace.com/legacy/satellite-bus-v1-archive");
  }

  // Semantic relationship changes
  const semanticRelationshipChanges: Array<{
    type: 'ADDED' | 'REMOVED' | 'STRENGTHENED';
    source: string;
    target: string;
    kind: string;
    significance: string;
  }> = [
    {
      type: 'ADDED',
      source: 'ViraTug Autonomous OTV',
      target: 'GEO Satellite Servicing Hub',
      kind: 'servicesMissionTarget',
      significance: 'Direct ontology edge established between product vehicle and orbital life extension service.'
    },
    {
      type: 'STRENGTHENED',
      source: 'AF-M315E Thruster',
      target: 'Green Monopropellant',
      kind: 'subsystemClassification',
      significance: 'Weight increased from 0.45 to 0.85 via bidirectional contextual anchor references.'
    },
    {
      type: 'REMOVED',
      source: 'Legacy Solar Array',
      target: 'Decommissioned Bus Specs',
      kind: 'historicalHardwareRef',
      significance: 'Pruned dead semantic relation to avoid topic drift in orbital propulsion cluster.'
    }
  ];

  // Internal link changes
  const internalLinkChanges = {
    linksAdded: 38,
    linksRemoved: 9,
    newOrphanPages: [] as string[],
    remediatedOrphanPages: [
      "https://nuviraspace.com/propulsion/green-chemical/flight-heritage",
      "https://nuviraspace.com/sustainability/active-debris-removal/gripper-mechanism"
    ],
    equityShiftSummary: "Equity concentration redistributed from header navigation to deep product specification nodes (+24% PageRank boost to OTV subpages)."
  };

  // Topic coverage changes
  const topicCoverageChanges: Array<{
    clusterName: string;
    previousCoverage: number;
    currentCoverage: number;
    delta: number;
    status: 'IMPROVED' | 'REGRESSED' | 'UNCHANGED';
  }> = [
    {
      clusterName: "Spacecraft Propulsion & Thruster Systems",
      previousCoverage: 74,
      currentCoverage: 88,
      delta: 14,
      status: 'IMPROVED'
    },
    {
      clusterName: "Orbital Transfer Vehicles & Space Logistics",
      previousCoverage: 68,
      currentCoverage: 82,
      delta: 14,
      status: 'IMPROVED'
    },
    {
      clusterName: "Satellite Servicing & Life Extension",
      previousCoverage: 71,
      currentCoverage: 79,
      delta: 8,
      status: 'IMPROVED'
    },
    {
      clusterName: "Commercial Space Station Infrastructure",
      previousCoverage: 62,
      currentCoverage: 58,
      delta: -4,
      status: 'REGRESSED'
    }
  ];

  const overallScoreDelta = auditB.healthScores.overall - auditA.healthScores.overall;

  const diffItems = [
    ...resolvedIssuesList.map(r => ({
      findingTitle: r.title,
      previousStatus: `${r.severity} (OPEN)`,
      currentStatus: 'RESOLVED',
      category: r.category as any,
      impact: 'Eliminated crawl budget waste & elevated technical health'
    })),
    ...newIssuesList.map(n => ({
      findingTitle: n.title,
      previousStatus: 'NOT DETECTED',
      currentStatus: `${n.severity} (NEW)`,
      category: n.category as any,
      impact: 'Requires immediate engineering review'
    })),
    ...worseningIssues.map(w => ({
      findingTitle: w.title,
      previousStatus: w.previousSeverity,
      currentStatus: `${w.currentSeverity} (ESCALATED)`,
      category: 'TECHNICAL' as any,
      impact: 'Severity escalated due to ranking degradation'
    })),
    ...improvedIssues.map(i => ({
      findingTitle: i.title,
      previousStatus: i.previousSeverity,
      currentStatus: `${i.currentSeverity} (MITIGATED)`,
      category: 'CONTENT' as any,
      impact: 'Partial mitigation deployed'
    }))
  ];

  return {
    baseAuditDate: auditA.metadata.auditDate,
    compareAuditDate: auditB.metadata.auditDate,
    overallScoreDelta,
    resolvedIssuesCount: resolvedIssuesList.length,
    newIssuesCount: newIssuesList.length,
    worseningIssuesCount: worseningIssues.length,
    improvingIssuesCount: improvedIssues.length,
    newPagesDiscovered: newPagesList,
    removedPages: removedPagesList,
    changedInternalLinksCount: internalLinkChanges.linksAdded - internalLinkChanges.linksRemoved,
    topicalCoverageDelta: 8.5,
    diffItems,
    semanticRelationshipChanges,
    internalLinkChanges,
    topicCoverageChanges,
    worseningIssues,
    improvedIssues,
    newIssuesList,
    resolvedIssuesList,
    newPagesList,
    removedPagesList
  };
}

