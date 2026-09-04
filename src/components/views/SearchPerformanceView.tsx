import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Search, 
  ExternalLink, 
  Target, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Filter,
  Sliders,
  Boxes,
  GitFork,
  ArrowRight,
  TrendingDown,
  Info,
  ChevronDown
} from 'lucide-react';
import { 
  SEODashboardDataset, 
  BrandedFilterType,
  QueryCategoryPerformanceItem,
  StrikingDistanceItem,
  PageTypePerformanceGroup
} from '../../types/seo-schema';
import { EChartRenderer } from '../common/EChartRenderer';
import { 
  ENTERPRISE_QUERY_CATEGORIES, 
  ENTERPRISE_PAGE_TYPES,
  getFilteredStrikingDistance,
  getFilteredQueryCategories
} from '../../services/enterpriseSeoService';

interface SearchPerformanceViewProps {
  dataset: SEODashboardDataset;
  onNavigateToGraph: (nodeIdOrUrl?: string) => void;
  onNavigateToIssue?: (issueId: string) => void;
}

export const SearchPerformanceView: React.FC<SearchPerformanceViewProps> = ({
  dataset,
  onNavigateToGraph,
  onNavigateToIssue
}) => {
  const [activeTab, setActiveTab] = useState<
    'topic-categories' | 'striking-distance' | 'branded-breakdown' | 'page-types' | 'gsc-overview'
  >('topic-categories');

  // Global & Local Branded vs Non-Branded Filter
  const [brandedFilter, setBrandedFilter] = useState<BrandedFilterType>('ALL');

  // Topic & Category Performance Filters
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Striking Distance Configurable Criteria
  const [strikingMinPosition, setStrikingMinPosition] = useState<number>(4);
  const [strikingMaxPosition, setStrikingMaxPosition] = useState<number>(20);
  const [strikingMinImpressions, setStrikingMinImpressions] = useState<number>(1000);
  const [strikingCluster, setStrikingCluster] = useState<string>('ALL');

  // Page-Type Grouping Selector
  const [pageGroupType, setPageGroupType] = useState<'PAGE_TYPE' | 'TEMPLATE' | 'CATEGORY' | 'TOPIC_CLUSTER'>('PAGE_TYPE');

  // Selected item modal / drawer for striking distance
  const [selectedStrikingItem, setSelectedStrikingItem] = useState<StrikingDistanceItem | null>(null);

  const perf = dataset.searchPerformance;
  const rawCategories = dataset.queryCategories || ENTERPRISE_QUERY_CATEGORIES;
  const pageTypeGroups = dataset.pageTypeGroups || ENTERPRISE_PAGE_TYPES;

  // Extract unique clusters and topics for dropdowns
  const availableClusters = useMemo(() => {
    const set = new Set<string>();
    rawCategories.forEach(item => {
      if (item.clusterName) set.add(item.clusterName);
    });
    return Array.from(set);
  }, [rawCategories]);

  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    rawCategories.forEach(item => {
      if (item.topic) set.add(item.topic);
    });
    return Array.from(set);
  }, [rawCategories]);

  // Filtered Query Categories
  const filteredCategories = useMemo(() => {
    return getFilteredQueryCategories(rawCategories, {
      brandedFilter,
      selectedCluster,
      selectedTopic,
      searchQuery
    });
  }, [rawCategories, brandedFilter, selectedCluster, selectedTopic, searchQuery]);

  // Striking Distance Items based on configurable criteria
  const strikingItems = useMemo(() => {
    return getFilteredStrikingDistance(dataset, {
      minPosition: strikingMinPosition,
      maxPosition: strikingMaxPosition,
      minImpressions: strikingMinImpressions,
      clusterFilter: strikingCluster,
      searchQuery,
      brandedFilter
    });
  }, [dataset, strikingMinPosition, strikingMaxPosition, strikingMinImpressions, strikingCluster, searchQuery, brandedFilter]);

  // Branded vs Non-Branded Aggregates
  const brandMetrics = useMemo(() => {
    let brandedClicks = 0;
    let brandedImpr = 0;
    let nonBrandedClicks = 0;
    let nonBrandedImpr = 0;

    rawCategories.forEach(c => {
      if (c.isBranded) {
        brandedClicks += c.clicks;
        brandedImpr += c.impressions;
      } else {
        nonBrandedClicks += c.clicks;
        nonBrandedImpr += c.impressions;
      }
    });

    const totalClicks = brandedClicks + nonBrandedClicks || 1;
    const totalImpr = brandedImpr + nonBrandedImpr || 1;

    return {
      brandedClicks,
      brandedImpr,
      brandedCTR: (brandedClicks / (brandedImpr || 1)) * 100,
      brandedShareClicks: (brandedClicks / totalClicks) * 100,
      nonBrandedClicks,
      nonBrandedImpr,
      nonBrandedCTR: (nonBrandedClicks / (nonBrandedImpr || 1)) * 100,
      nonBrandedShareClicks: (nonBrandedClicks / totalClicks) * 100
    };
  }, [rawCategories]);

  // Timeline EChart Option for GSC Overview
  const historyTimeline = perf?.historyTimeline || [];
  const timelineOption = {
    tooltip: { 
      trigger: 'axis',
      backgroundColor: '#eef2f7',
      borderColor: '#cbd5e1',
      borderWidth: 1,
      padding: [14, 18],
      textStyle: { color: '#0f172a', fontSize: 12, fontFamily: 'inherit' },
      extraCssText: 'box-shadow: 6px 6px 14px rgba(163,177,198,0.5), -6px -6px 14px rgba(255,255,255,0.85); border-radius: 12px;',
      formatter: (params: any[]) => {
        const dateIdx = params[0].dataIndex;
        const dataPoint = historyTimeline[dateIdx];
        const dateRaw = dataPoint?.date || '';
        
        const clicks = params.find(p => p.seriesName === 'Clicks')?.value || 0;
        const impressions = params.find(p => p.seriesName === 'Impressions')?.value || 0;
        const ctr = dataPoint?.ctr?.toFixed(2) || '0.00';
        const pos = dataPoint?.position?.toFixed(1) || '0.0';

        return `
          <div style="font-weight: 700; font-size: 13px; margin-bottom: 10px; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; font-family: monospace;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748b"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              Date: ${dateRaw}
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #2563eb;"></span>
                <span style="color: #475569; font-weight: 500;">Clicks</span>
              </div>
              <span style="font-weight: 700; color: #0f172a; font-family: monospace;">${clicks.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #4f46e5;"></span>
                <span style="color: #475569; font-weight: 500;">Impressions</span>
              </div>
              <span style="font-weight: 700; color: #0f172a; font-family: monospace;">${impressions.toLocaleString()}</span>
            </div>
            <div style="height: 1px; background-color: #cbd5e1; margin: 4px 0;"></div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px;">
              <span style="color: #475569; font-weight: 500;">Avg. CTR</span>
              <span style="font-weight: 600; color: #059669; font-family: monospace;">${ctr}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px;">
              <span style="color: #475569; font-weight: 500;">Avg. Position</span>
              <span style="font-weight: 600; color: #d97706; font-family: monospace;">${pos}</span>
            </div>
          </div>
        `;
      }
    },
    legend: { data: ['Clicks', 'Impressions'], bottom: 0, textStyle: { fontSize: 11, color: '#475569', fontFamily: 'monospace' } },
    grid: { left: '3%', right: '4%', bottom: '12%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: historyTimeline.map(h => (h.date || '').replace('2026-', '')),
      axisLabel: { fontSize: 10, color: '#475569', fontFamily: 'monospace' },
      axisLine: { lineStyle: { color: '#cbd5e1' } }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Clicks',
        nameTextStyle: { fontSize: 10, color: '#2563eb', fontFamily: 'monospace' },
        axisLabel: { fontSize: 10, color: '#475569', fontFamily: 'monospace' },
        splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } }
      },
      {
        type: 'value',
        name: 'Impressions',
        nameTextStyle: { fontSize: 10, color: '#4f46e5', fontFamily: 'monospace' },
        axisLabel: { fontSize: 10, color: '#475569', fontFamily: 'monospace' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'Clicks',
        type: 'line',
        smooth: true,
        data: historyTimeline.map(h => h.clicks ?? 0),
        itemStyle: { color: '#2563eb' },
        areaStyle: {
          color: 'rgba(37, 99, 235, 0.08)'
        }
      },
      {
        name: 'Impressions',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: historyTimeline.map(h => h.impressions ?? 0),
        itemStyle: { color: '#4f46e5' }
      }
    ]
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="neu-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-slate-800 dark:text-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 font-mono">
              Enterprise SEO Reporting Hub
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium font-mono">Search Engine Journal Framework</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <span className="p-1.5 neu-inset rounded-lg text-blue-700 dark:text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </span>
            <span>Search Performance & Semantic Category Telemetry</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Multi-tier query-to-cluster hierarchy analysis, striking distance opportunities, branded vs non-branded segmentation, and page-type performance modeling for <strong className="text-slate-900 dark:text-slate-100">{dataset.metadata.siteName}</strong>.
          </p>
        </div>

        {/* Global Branded vs Non-Branded Filter Control */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 p-2 neu-inset rounded-xl">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 pl-1 font-mono">Classification:</span>
          <div className="inline-flex rounded-lg neu-inset p-0.5">
            {(['ALL', 'NON-BRANDED', 'BRANDED'] as const).map(b => (
              <button
                key={b}
                onClick={() => setBrandedFilter(b)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer font-mono ${
                  brandedFilter === b
                    ? 'neu-btn text-blue-900 dark:text-blue-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`}
              >
                {b === 'ALL' ? 'All Queries' : b === 'NON-BRANDED' ? 'Non-Branded' : 'Branded'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Branded vs Non-Branded Mini KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 neu-card-sm rounded-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Non-Branded Clicks</div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono mt-0.5">
            {brandMetrics.nonBrandedClicks.toLocaleString()}
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal font-sans ml-1">
              ({brandMetrics.nonBrandedShareClicks.toFixed(1)}%)
            </span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">CTR: {brandMetrics.nonBrandedCTR.toFixed(1)}%</div>
        </div>

        <div className="p-4 neu-card-sm rounded-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Branded Clicks</div>
          <div className="text-lg font-black text-blue-700 dark:text-blue-400 font-mono mt-0.5">
            {brandMetrics.brandedClicks.toLocaleString()}
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal font-sans ml-1">
              ({brandMetrics.brandedShareClicks.toFixed(1)}%)
            </span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">CTR: {brandMetrics.brandedCTR.toFixed(1)}%</div>
        </div>

        <div className="p-4 neu-card-sm rounded-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Striking Distance Potential</div>
          <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
            +{strikingItems.reduce((acc, s) => acc + s.potentialGain, 0).toLocaleString()}
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal font-sans ml-1">mo. clicks</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{strikingItems.length} terms in striking rank</div>
        </div>

        <div className="p-4 neu-card-sm rounded-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Topic Clusters Mapped</div>
          <div className="text-lg font-black text-indigo-700 dark:text-indigo-400 font-mono mt-0.5">
            {availableClusters.length} Clusters
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{rawCategories.length} tracked categories</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="neu-inset p-1.5 rounded-2xl flex gap-1.5 overflow-x-auto">
        {[
          { key: 'topic-categories', label: 'Topic / Query Category Performance' },
          { key: 'striking-distance', label: `Striking Distance (${strikingItems.length})` },
          { key: 'branded-breakdown', label: 'Branded vs Non-Branded' },
          { key: 'page-types', label: 'Page-Type & Template Performance' },
          { key: 'gsc-overview', label: 'GSC Telemetry & Trajectory' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-2 px-3.5 text-xs rounded-xl transition-all whitespace-nowrap cursor-pointer font-mono ${
              activeTab === tab.key
                ? 'neu-btn text-blue-900 dark:text-blue-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TOPIC / QUERY CATEGORY PERFORMANCE                                */}
      {/* Query → Topic → Cluster → Page → Performance                             */}
      {/* ========================================================================= */}
      {activeTab === 'topic-categories' && (
        <div className="space-y-4">
          {/* Breadcrumb Hierarchy Concept Reminder */}
          <div className="p-3 neu-card-sm rounded-2xl flex items-center justify-between gap-2 text-xs text-blue-950 dark:text-blue-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold uppercase tracking-wider text-[10px] text-blue-900 dark:text-blue-300 font-mono">Semantic SEO Linkage:</span>
              <span className="px-2 py-0.5 neu-inset rounded-md font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">Query</span>
              <span className="text-slate-400 dark:text-slate-600">→</span>
              <span className="px-2 py-0.5 neu-inset rounded-md font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">Topic</span>
              <span className="text-slate-400 dark:text-slate-600">→</span>
              <span className="px-2 py-0.5 neu-inset rounded-md font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">Cluster</span>
              <span className="text-slate-400 dark:text-slate-600">→</span>
              <span className="px-2 py-0.5 neu-inset rounded-md font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">Page</span>
              <span className="text-slate-400 dark:text-slate-600">→</span>
              <span className="px-2 py-0.5 neu-btn text-blue-900 dark:text-blue-300 rounded-md font-mono text-[11px] font-extrabold">Performance</span>
            </div>
            <span className="text-[11px] text-blue-800 dark:text-blue-300 font-mono font-bold shrink-0">
              {filteredCategories.length} queries active
            </span>
          </div>

          {/* Filtering Bar */}
          <div className="neu-card p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Cluster Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Cluster:</span>
                <select
                  value={selectedCluster}
                  onChange={(e) => setSelectedCluster(e.target.value)}
                  className="text-xs neu-inset rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden dark:bg-[#0c121e]"
                >
                  <option value="ALL">All Clusters</option>
                  {availableClusters.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Topic Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Topic:</span>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="text-xs neu-inset rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden dark:bg-[#0c121e]"
                >
                  <option value="ALL">All Topics</option>
                  {availableTopics.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search query or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs neu-inset rounded-lg text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Connected Table */}
          <div className="neu-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#e4ebf5] border-b border-[#cbd5e1] text-slate-700 font-bold uppercase tracking-wider text-[10px] font-mono">
                    <th className="py-3.5 px-4">Query & Intent</th>
                    <th className="py-3.5 px-3">Topic & Cluster Linkage</th>
                    <th className="py-3.5 px-3">Ranking Page</th>
                    <th className="py-3.5 px-3 text-right">Clicks</th>
                    <th className="py-3.5 px-3 text-right">Impressions</th>
                    <th className="py-3.5 px-3 text-right">CTR</th>
                    <th className="py-3.5 px-3 text-right">Avg Pos</th>
                    <th className="py-3.5 px-3 text-center">Trend</th>
                    <th className="py-3.5 px-4">Opportunity Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70">
                  {filteredCategories.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      {/* Query */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 font-mono">
                          {item.query}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            item.isBranded ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.isBranded ? 'BRAND' : 'NON-BRAND'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.intent}
                          </span>
                        </div>
                      </td>

                      {/* Topic & Cluster Linkage */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">
                          {item.topic}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="truncate max-w-[140px]">{item.clusterName}</span>
                        </div>
                      </td>

                      {/* Ranking Page */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onNavigateToGraph(item.pageUrl)}
                          className="font-mono text-[11px] text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 max-w-[160px] truncate cursor-pointer"
                          title={item.pageUrl}
                        >
                          <span className="truncate">{item.pageUrl.replace('https://nuviraspace.com', '')}</span>
                          <ArrowUpRight className="w-3 h-3 shrink-0" />
                        </button>
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px] mt-0.5">
                          {item.pageTitle}
                        </div>
                      </td>

                      {/* Clicks */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {item.clicks.toLocaleString()}
                      </td>

                      {/* Impressions */}
                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        {item.impressions.toLocaleString()}
                      </td>

                      {/* CTR */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {item.ctr.toFixed(1)}%
                      </td>

                      {/* Avg Position */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        #{item.averagePosition.toFixed(1)}
                      </td>

                      {/* Trend */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          item.trend === 'UP' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : item.trend === 'DOWN' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.trend === 'UP' ? <TrendingUp className="w-3 h-3" /> : item.trend === 'DOWN' ? <TrendingDown className="w-3 h-3" /> : '•'}
                          <span>{item.trendDelta > 0 ? `+${item.trendDelta}%` : `${item.trendDelta}%`}</span>
                        </span>
                      </td>

                      {/* Opportunity Action */}
                      <td className="py-3 px-4 text-[11px] text-slate-700 max-w-xs">
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-200/60 leading-snug">
                          {item.opportunity}
                        </div>
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
      {/* TAB 2: STRIKING DISTANCE (CONFIGURABLE CRITERIA)                           */}
      {/* ========================================================================= */}
      {activeTab === 'striking-distance' && (
        <div className="space-y-4">
          {/* Configurable Criteria Bar */}
          <div className="neu-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 font-mono">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <span>Configurable Striking Distance Parameters</span>
              </h3>
              <span className="text-[11px] text-slate-600 font-mono font-bold">
                Matching {strikingItems.length} high-value opportunities
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              {/* Position Presets */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 font-mono">Position Target:</label>
                <div className="flex items-center gap-1">
                  {[
                    { label: '4 - 10', min: 4, max: 10 },
                    { label: '11 - 20', min: 11, max: 20 },
                    { label: '4 - 20', min: 4, max: 20 },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setStrikingMinPosition(preset.min);
                        setStrikingMaxPosition(preset.max);
                      }}
                      className={`px-3 py-1 text-xs rounded-lg font-mono font-semibold cursor-pointer transition-all ${
                        strikingMinPosition === preset.min && strikingMaxPosition === preset.max
                          ? 'neu-btn text-emerald-950 font-bold'
                          : 'neu-inset text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Impressions Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 font-mono">
                  <span>Min Impressions:</span>
                  <span className="font-mono font-bold text-slate-900">{strikingMinImpressions.toLocaleString()}+</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="500"
                  value={strikingMinImpressions}
                  onChange={(e) => setStrikingMinImpressions(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Cluster Dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 font-mono">Topic Cluster:</label>
                <select
                  value={strikingCluster}
                  onChange={(e) => setStrikingCluster(e.target.value)}
                  className="w-full text-xs neu-inset rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-hidden"
                >
                  <option value="ALL">All Clusters</option>
                  {availableClusters.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Keyword Search */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 font-mono">Search Filter:</label>
                <input
                  type="text"
                  placeholder="Filter query/page..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs neu-inset rounded-lg text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Striking Distance Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strikingItems.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedStrikingItem(item)}
                className="p-4 neu-card rounded-2xl hover:shadow-lg transition-all cursor-pointer text-left space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm text-slate-900 font-mono">
                      "{item.query}"
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {item.topic} • <strong className="text-slate-800 font-semibold">{item.cluster}</strong>
                    </div>
                  </div>

                  {/* Rank Badge */}
                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black font-mono neu-inset text-emerald-950 border border-emerald-300">
                      Rank #{item.position.toFixed(1)}
                    </span>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-1 font-mono">
                      +{item.potentialGain} potential clicks
                    </div>
                  </div>
                </div>

                {/* Metrics pill */}
                <div className="grid grid-cols-3 gap-2 neu-inset p-2.5 rounded-xl text-center font-mono">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase">Impressions</div>
                    <div className="text-xs font-bold text-slate-900">{item.impressions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase">Clicks</div>
                    <div className="text-xs font-bold text-slate-900">{item.clicks}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase">CTR</div>
                    <div className="text-xs font-bold text-slate-900">{item.ctr.toFixed(1)}%</div>
                  </div>
                </div>

                {/* Ranking URL */}
                <div className="text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Ranking Page</div>
                  <div className="font-mono text-[11px] text-blue-700 truncate mt-0.5">
                    {item.pageUrl}
                  </div>
                </div>

                {/* Opportunity Box */}
                <div className="p-2.5 neu-inset rounded-xl text-xs text-slate-800 leading-relaxed border border-emerald-200">
                  <strong className="text-emerald-900 font-semibold font-mono">Opportunity:</strong> {item.opportunity}
                </div>

                <div className="pt-2 border-t border-[#d4dce7] flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Difficulty: <strong className="text-slate-900">{item.difficulty}</strong></span>
                  <span className="text-blue-700 font-semibold flex items-center gap-1 hover:text-blue-900">
                    Inspect Evidence & Page <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {strikingItems.length === 0 && (
            <div className="p-12 text-center neu-card rounded-2xl text-slate-600 text-xs">
              No queries match the selected striking distance criteria. Try adjusting the position range or impression threshold.
            </div>
          )}

          {/* Modal / Drawer for Selected Striking Distance Item */}
          {selectedStrikingItem && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="neu-card rounded-3xl max-w-xl w-full p-6 text-left space-y-4 border border-slate-300">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 neu-inset px-2.5 py-0.5 rounded-full inline-block mb-1 font-mono">
                      Striking Distance Opportunity
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-mono">
                      "{selectedStrikingItem.query}"
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedStrikingItem(null)}
                    className="text-slate-400 hover:text-slate-700 font-mono text-base p-1.5 neu-btn rounded-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div><strong>Cluster:</strong> {selectedStrikingItem.cluster}</div>
                  <div><strong>Current SERP Position:</strong> #{selectedStrikingItem.position.toFixed(1)}</div>
                  <div><strong>Monthly Impressions:</strong> {selectedStrikingItem.impressions.toLocaleString()}</div>
                  <div><strong>Current Clicks:</strong> {selectedStrikingItem.clicks} (CTR: {selectedStrikingItem.ctr.toFixed(1)}%)</div>
                  <div><strong>Estimated Traffic Gain into Top 3:</strong> +{selectedStrikingItem.potentialGain} clicks/month</div>
                </div>

                <div className="p-3 neu-inset rounded-xl">
                  <div className="text-[11px] font-bold text-slate-700 font-mono">Target Page:</div>
                  <div className="font-mono text-xs text-blue-700 break-all mt-0.5">
                    {selectedStrikingItem.pageUrl}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {selectedStrikingItem.pageTitle}
                  </div>
                </div>

                <div className="p-3 neu-inset rounded-xl text-xs text-emerald-950 border border-emerald-300">
                  <div className="font-bold mb-1 font-mono">Actionable Recommendation:</div>
                  <p>{selectedStrikingItem.opportunity}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#cbd5e1]">
                  {onNavigateToGraph && (
                    <button
                      onClick={() => {
                        onNavigateToGraph(selectedStrikingItem.pageUrl);
                        setSelectedStrikingItem(null);
                      }}
                      className="px-3.5 py-1.5 rounded-xl neu-btn text-blue-900 text-xs font-bold cursor-pointer font-mono"
                    >
                      View in Semantic Graph
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedStrikingItem(null)}
                    className="px-4 py-1.5 rounded-xl neu-btn text-slate-800 text-xs font-bold cursor-pointer font-mono"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BRANDED VS NON-BRANDED BREAKDOWN                                   */}
      {/* ========================================================================= */}
      {activeTab === 'branded-breakdown' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Non-Branded Card */}
            <div className="neu-card p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 font-mono">Non-Branded Query Segment</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold neu-inset text-slate-700 font-mono">
                  High Commercial Intent
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Queries where searchers do not mention "NuVira" or "ViraTug". Represents raw organic market capture and category leadership.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 neu-inset rounded-xl">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Share of Total Clicks</div>
                  <div className="text-lg font-bold font-mono text-slate-900">{brandMetrics.nonBrandedShareClicks.toFixed(1)}%</div>
                </div>
                <div className="p-3 neu-inset rounded-xl">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Average CTR</div>
                  <div className="text-lg font-bold font-mono text-slate-900">{brandMetrics.nonBrandedCTR.toFixed(1)}%</div>
                </div>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 neu-inset p-3.5 rounded-xl leading-relaxed border border-slate-300 dark:border-slate-700">
                <strong className="font-mono">Strategic Imperative:</strong> Optimize striking distance terms (positions 4-15) such as "satellite life extension servicing" and "orbital transfer vehicle rideshare" to capture unbranded category intent.
              </div>
            </div>

            {/* Branded Card */}
            <div className="neu-card p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-blue-950 dark:text-blue-200 font-mono">Branded Query Segment</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold neu-inset text-blue-900 dark:text-blue-300 font-mono">
                  Brand Navigation
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Queries mentioning "NuVira" or "ViraTug". Reflects brand awareness, PR impact, investor interest, and existing customer navigation.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 neu-inset rounded-xl">
                  <div className="text-[10px] text-blue-700 dark:text-blue-400 uppercase font-mono">Share of Total Clicks</div>
                  <div className="text-lg font-bold font-mono text-blue-950 dark:text-blue-200">{brandMetrics.brandedShareClicks.toFixed(1)}%</div>
                </div>
                <div className="p-3 neu-inset rounded-xl">
                  <div className="text-[10px] text-blue-700 dark:text-blue-400 uppercase font-mono">Average CTR</div>
                  <div className="text-lg font-bold font-mono text-blue-950 dark:text-blue-200">{brandMetrics.brandedCTR.toFixed(1)}%</div>
                </div>
              </div>

              <div className="text-xs text-blue-950 dark:text-blue-200 neu-inset p-3.5 rounded-xl leading-relaxed border border-blue-300 dark:border-blue-800/50">
                <strong className="font-mono">Strategic Imperative:</strong> Maintain #1 rankings, enhance rich sitelinks, and deploy FAQ/Organization schema so search engine answer engines surface official specifications cleanly.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PAGE-TYPE & TEMPLATE PERFORMANCE                                   */}
      {/* ========================================================================= */}
      {activeTab === 'page-types' && (
        <div className="space-y-4">
          <div className="neu-card p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
                Grouping & Performance Aggregates
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Compare search efficiency across structural page types, templates, and categories.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">Group By:</span>
              <select
                value={pageGroupType}
                onChange={(e) => setPageGroupType(e.target.value as any)}
                className="text-xs neu-inset rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden dark:bg-[#0c121e]"
              >
                <option value="PAGE_TYPE">Page Type</option>
                <option value="TEMPLATE">Template Layout</option>
                <option value="CATEGORY">Business Category</option>
                <option value="TOPIC_CLUSTER">Topic Cluster</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageTypeGroups.map((group, gIdx) => (
              <div key={gIdx} className="neu-card-sm p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                    {group.groupName}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 neu-inset px-2 py-0.5 rounded-full">
                    {group.pageCount} pages
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 neu-inset p-2.5 rounded-xl font-mono text-center">
                  <div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase">Clicks</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{group.clicks.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase">Avg CTR</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{group.ctr.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase">Avg Rank</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">#{group.avgPosition.toFixed(1)}</div>
                  </div>
                </div>

                {/* Share bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-mono">
                    <span>Share of Organic Clicks</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{group.shareOfClicks}%</span>
                  </div>
                  <div className="w-full neu-inset h-2 rounded-full overflow-hidden p-0.5">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${group.shareOfClicks}%` }} />
                  </div>
                </div>

                {/* Top URLs in this group */}
                <div className="pt-2 border-t border-[#d4dce7] dark:border-slate-700/60 text-xs">
                  <div className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1 font-mono">Representative URLs:</div>
                  {group.topUrls.map((url, uIdx) => (
                    <div key={uIdx} className="font-mono text-[11px] text-blue-700 dark:text-blue-400 truncate">
                      • {url.replace('https://nuviraspace.com', '')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: GSC TELEMETRY & TRAJECTORY                                         */}
      {/* ========================================================================= */}
      {activeTab === 'gsc-overview' && (
        <div className="space-y-4">
          <div className="neu-card p-5 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 font-mono">
              Historical Organic Clicks & Impressions (90-Day Trajectory)
            </h3>
            <div className="h-72">
              <EChartRenderer option={timelineOption} height="100%" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
