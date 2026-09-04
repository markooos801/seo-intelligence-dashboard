import React, { useState } from 'react';
import { 
  Link2, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  ArrowRight, 
  Search, 
  ShieldAlert,
  GitCommit
} from 'lucide-react';
import { SEODashboardDataset } from '../../types/seo-schema';

interface InternalLinkingViewProps {
  dataset: SEODashboardDataset;
  onNavigateToGraph: (nodeIdOrUrl?: string) => void;
}

export const InternalLinkingView: React.FC<InternalLinkingViewProps> = ({
  dataset,
  onNavigateToGraph,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const linking = dataset.internalLinking;

  if (!linking) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
        Internal linking data unavailable in current dataset.
      </div>
    );
  }

  const totalLinks = linking.totalLinks ?? 0;
  const internalLinksRatio = linking.internalLinksRatio ?? 0;
  const orphanPages = linking.orphanPages || [];
  const hubPages = linking.hubPages || [];
  const underlinkedPages = linking.underlinkedPages || [];
  const brokenLinks = linking.brokenLinks || [];
  const relationships = linking.relationships || [];

  const filteredRelationships = (relationships || []).filter(r => 
    !searchFilter ||
    r.sourceUrl.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.targetUrl.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.anchorText.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Internal Link Topology & PageRank Flow</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Internal connectivity audit, anchor text relevance, link equity distribution, and orphan mitigation.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          Link Score: {dataset.healthScores.internalLinks}/100
        </span>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Total Internal Links Discovered</span>
          <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-0.5 block">{totalLinks}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Ratio: {((internalLinksRatio || 0) * 100).toFixed(0)}% internal</span>
        </div>

        <div className="p-3 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Critical Orphan Pages</span>
          <span className="text-xl font-extrabold font-mono text-red-700 dark:text-red-400 mt-0.5 block">{orphanPages.length}</span>
          <span className="text-[10px] text-red-600 dark:text-red-400">0 inbound internal links</span>
        </div>

        <div className="p-3 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Top Hub Nodes</span>
          <span className="text-xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5 block">{hubPages.length}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Distributing link equity</span>
        </div>

        <div className="p-3 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Underlinked Opportunities</span>
          <span className="text-xl font-extrabold font-mono text-amber-700 dark:text-amber-400 mt-0.5 block">{underlinkedPages.length}</span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400">&le; 2 inbound links</span>
        </div>
      </div>

      {/* Orphan Alert Banner */}
      {orphanPages.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-xs">
          <div className="flex items-center gap-2 font-bold text-red-900 dark:text-red-300 mb-1">
            <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>Critical Link Starvation: {orphanPages.length} Orphan URL{orphanPages.length > 1 ? 's' : ''} Detected</span>
          </div>
          <p className="text-red-950 dark:text-red-200 mb-2 leading-relaxed">
            These published URLs have zero inbound contextual links from other crawlable site pages, causing search crawlers to deprioritize indexing:
          </p>
          <div className="space-y-1.5">
            {orphanPages.map(url => (
              <div key={url} className="p-2 rounded bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 flex items-center justify-between text-xs font-mono flex-wrap gap-2">
                <span className="text-red-900 dark:text-red-300 font-semibold truncate max-w-md">{url}</span>
                <button
                  onClick={() => onNavigateToGraph(url)}
                  className="px-2 py-0.5 text-[11px] rounded bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 hover:bg-red-100 border border-red-200 dark:border-red-800 flex items-center gap-1 font-sans cursor-pointer"
                >
                  <Layers className="w-3 h-3" />
                  <span>Inspect in Graph</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hub Pages & Underlinked Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hub Pages */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Key Hub Pages (Equity Sources)</span>
          </h3>
          <div className="space-y-2">
            {hubPages.map(hub => (
              <div key={hub.url} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-2">
                <div className="truncate">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate">{hub.title}</div>
                  <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate">{hub.url}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-bold">Outbound</span>
                  <span className="text-sm font-extrabold font-mono text-emerald-700 dark:text-emerald-400">{hub.outboundCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Underlinked Pages */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Underlinked Commercial Pages</span>
          </h3>
          <div className="space-y-2">
            {underlinkedPages.map(page => (
              <div key={page.url} className="p-2.5 rounded-lg border border-amber-200/80 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/20 flex items-center justify-between gap-2">
                <div className="truncate">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate">{page.title}</div>
                  <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate">{page.url}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-bold">Inbound</span>
                  <span className="text-sm font-extrabold font-mono text-amber-700 dark:text-amber-400">{page.inboundCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crawled Anchor Relationships */}
      <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/40">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Discovered In-Content Anchor Links ({filteredRelationships.length})
          </h3>
          <div className="relative min-w-[200px] w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search anchors or URLs..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-7 pr-3 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <th className="py-2.5 px-4 font-semibold">Source Page</th>
                <th className="py-2.5 px-4 font-semibold">Anchor Text</th>
                <th className="py-2.5 px-4 font-semibold">Target Destination</th>
                <th className="py-2.5 px-4 font-semibold">Context / Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRelationships.map((rel, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-xs">
                    {rel.sourceUrl.replace('https://nuviraspace.com', '') || '/'}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-blue-700 dark:text-blue-400">
                    "{rel.anchorText}"
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate max-w-xs">
                    {rel.targetUrl.replace('https://nuviraspace.com', '') || '/'}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {rel.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
