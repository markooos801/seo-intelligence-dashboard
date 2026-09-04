import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Filter,
  Sparkles,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { SEODashboardDataset, ContentAuditPage } from '../../types/seo-schema';
import { ENTERPRISE_CONTENT_PERFORMANCE } from '../../services/enterpriseSeoService';

interface ContentViewProps {
  dataset: SEODashboardDataset;
  onNavigateToGraph: (nodeIdOrUrl?: string) => void;
}

export const ContentView: React.FC<ContentViewProps> = ({
  dataset,
  onNavigateToGraph,
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'performance'>('audit');
  const [searchFilter, setSearchFilter] = useState('');
  const [intentFilter, setIntentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const contentAudit = dataset.contentAudit;
  const contentPerfList = dataset.contentPerformanceList || ENTERPRISE_CONTENT_PERFORMANCE;

  if (!contentAudit) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
        Content audit data unavailable in current dataset.
      </div>
    );
  }

  const summary = contentAudit.summary || {
    avgWordCount: 0,
    thinContentPagesCount: 0,
    duplicateRiskCount: 0,
    freshnessWarningCount: 0,
  };
  const pages = contentAudit.pages || [];

  const filteredPages = pages.filter(p => {
    const matchesSearch = !searchFilter ||
      p.url.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (p.primaryKeyword || '').toLowerCase().includes(searchFilter.toLowerCase());

    const pageIntent = (p as any).searchIntent || (p as any).intentAlignment || 'INFORMATIONAL';
    const matchesIntent = intentFilter === 'ALL' || pageIntent === intentFilter;

    return matchesSearch && matchesIntent;
  });

  const filteredPerfList = contentPerfList.filter(p => {
    const matchesSearch = !searchFilter ||
      p.url.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.cluster.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Content Quality, Depth & Performance Intelligence</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Page-by-page word count analysis, readability index, and enterprise content performance tracking over time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Content Health: {dataset.healthScores.content}/100
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 pt-1 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Content Quality & Depth Audit ({pages.length})
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`pb-3 pt-1 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'performance'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Content Performance Over Time ({contentPerfList.length})
        </button>
      </div>

      {activeTab === 'audit' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Average Word Count</span>
              <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-0.5 block">{summary.avgWordCount}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Benchmark: &ge; 1,200 words</span>
            </div>

            <div className="p-3 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Thin Content Pages</span>
              <span className="text-xl font-extrabold font-mono text-amber-700 dark:text-amber-400 mt-0.5 block">{summary.thinContentPagesCount}</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400">&le; 600 words</span>
            </div>

            <div className="p-3 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Duplicate Risk Warnings</span>
              <span className="text-xl font-extrabold font-mono text-rose-700 dark:text-rose-400 mt-0.5 block">{summary.duplicateRiskCount}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Cross-page boilerplate</span>
            </div>

            <div className="p-3 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Freshness Warnings</span>
              <span className="text-xl font-extrabold font-mono text-slate-700 dark:text-slate-300 mt-0.5 block">{summary.freshnessWarningCount}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">&gt; 120 days un-updated</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white dark:bg-[#0f172a] p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Intent:
              </span>
              <select
                value={intentFilter}
                onChange={(e) => setIntentFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 font-medium text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">All Intents</option>
                <option value="INFORMATIONAL">Informational</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="TRANSACTIONAL">Transactional</option>
                <option value="NAVIGATIONAL">Navigational</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search URL or keyword..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-4 min-w-[200px]">Page URL</th>
                    <th className="py-2.5 px-4 min-w-[150px]">Primary Keyword</th>
                    <th className="py-2.5 px-4 min-w-[110px]">Word Count</th>
                    <th className="py-2.5 px-4 min-w-[110px]">Quality Score</th>
                    <th className="py-2.5 px-4 min-w-[180px]">Deficiencies</th>
                    <th className="py-2.5 px-4 text-right min-w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPages.map((page, idx) => {
                    const wordCount = page.wordCount || 0;
                    const quality = (page as any).contentQualityScore ?? (page as any).qualityScore ?? 75;
                    const missingElements = (page as any).missingElements || [];

                    return (
                      <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="py-2.5 px-4">
                          <div className="font-mono text-slate-900 dark:text-slate-100 font-medium max-w-xs truncate" title={page.url}>
                            {page.url}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            Intent: <strong className="text-slate-700 dark:text-slate-300">{(page as any).searchIntent || 'INFORMATIONAL'}</strong>
                          </div>
                        </td>

                        <td className="py-2.5 px-4">
                          <span className="font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                            {page.primaryKeyword || 'N/A'}
                          </span>
                        </td>

                        <td className="py-2.5 px-4">
                          <span className={`font-mono font-bold ${
                            wordCount < 600 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'
                          }`}>
                            {wordCount.toLocaleString()}
                          </span>
                          {wordCount < 600 && (
                            <span className="block text-[10px] text-amber-600 dark:text-amber-400">Thin content</span>
                          )}
                        </td>

                        <td className="py-2.5 px-4 font-mono font-bold">
                          <span className={
                            quality >= 80 ? 'text-emerald-700 dark:text-emerald-400' :
                            quality >= 65 ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'
                          }>
                            {quality}%
                          </span>
                        </td>

                        <td className="py-2.5 px-4 max-w-xs">
                          {missingElements.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {missingElements.map((elem: string, i: number) => (
                                <span key={i} className="inline-block text-[10px] bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-1.5 py-0.2 rounded">
                                  {elem}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-emerald-700 dark:text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onNavigateToGraph(page.url)}
                              className="px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-blue-400 font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Layers className="w-3 h-3" />
                              <span>Graph</span>
                            </button>
                            <a
                              href={page.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CONTENT PERFORMANCE OVER TIME                                      */}
      {/* created date, updated date, clicks, impressions, CTR, position, conversions*/}
      {/* ========================================================================= */}
      {activeTab === 'performance' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-[#0f172a] p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Trajectory Status:</span>
              {(['ALL', 'HIGH_PERFORMER', 'RISING', 'STAGNANT', 'DECAYING'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-900 dark:bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter title, URL, cluster..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Performance Table */}
          <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 min-w-[200px]">Content Title & URL</th>
                    <th className="py-3 px-3 min-w-[140px]">Created / Updated</th>
                    <th className="py-3 px-3 text-right min-w-[80px]">Clicks</th>
                    <th className="py-3 px-3 text-right min-w-[90px]">Impressions</th>
                    <th className="py-3 px-3 text-right min-w-[70px]">CTR</th>
                    <th className="py-3 px-3 text-right min-w-[80px]">Avg Pos</th>
                    <th className="py-3 px-3 text-right min-w-[100px]">Conversions</th>
                    <th className="py-3 px-3 text-center min-w-[110px]">Status</th>
                    <th className="py-3 px-4 text-right min-w-[90px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPerfList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors">
                      {/* Title & URL */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 dark:text-slate-100 leading-snug truncate">
                          {item.title}
                        </div>
                        <div className="font-mono text-[11px] text-blue-700 dark:text-blue-400 truncate mt-0.5">
                          {item.url.replace('https://nuviraspace.com', '')}
                        </div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-0.5 truncate">
                          Cluster: {item.cluster}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                          <span>Pub: {item.createdDate}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                          <span>Mod: {item.updatedDate} ({item.freshnessDays}d ago)</span>
                        </div>
                      </td>

                      {/* Clicks */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                        {item.clicks.toLocaleString()}
                      </td>

                      {/* Impressions */}
                      <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                        {item.impressions.toLocaleString()}
                      </td>

                      {/* CTR */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                        {item.ctr.toFixed(1)}%
                      </td>

                      {/* Position */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                        #{item.position.toFixed(1)}
                      </td>

                      {/* Conversions */}
                      <td className="py-3 px-3 text-right font-mono">
                        <div className="font-bold text-emerald-700 dark:text-emerald-400">{item.conversions}</div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">({item.conversionRate.toFixed(1)}%)</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'HIGH_PERFORMER' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                          item.status === 'RISING' ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800' :
                          item.status === 'STAGNANT' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                          'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onNavigateToGraph(item.url)}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Graph</span>
                          <ArrowUpRight className="w-3 h-3" />
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
    </div>
  );
};
