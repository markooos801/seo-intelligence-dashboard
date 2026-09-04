import React, { useState } from 'react';
import { 
  GitFork, 
  Globe, 
  FolderTree, 
  FileText, 
  ExternalLink, 
  Layers, 
  ChevronRight, 
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SEODashboardDataset, SiteArchitectureNode } from '../../types/seo-schema';

interface SiteArchitectureViewProps {
  dataset: SEODashboardDataset;
  onNavigateToGraph: (nodeIdOrUrl?: string) => void;
}

export const SiteArchitectureView: React.FC<SiteArchitectureViewProps> = ({
  dataset,
  onNavigateToGraph,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const arch = dataset.siteArchitecture || [];

  const filtered = arch.filter(a => 
    !searchFilter ||
    a.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    a.url.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GitFork className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Site Architecture & Crawl Depth Hierarchy</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Physical path and directory topology discovered during crawler execution.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          {arch.length} Discovered URLs
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#0f172a] p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hierarchy by path or title..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100"
          />
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Showing {filtered.length} of {arch.length} paths
        </span>
      </div>

      {/* Tree Table */}
      <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <th className="py-2.5 px-4 font-semibold">Crawl Depth / Architecture Node</th>
                <th className="py-2.5 px-4 font-semibold">Type</th>
                <th className="py-2.5 px-4 font-semibold">HTTP Status</th>
                <th className="py-2.5 px-4 font-semibold">Indexable</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => {
                const indent = item.crawlDepth * 24;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2" style={{ paddingLeft: `${indent}px` }}>
                        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                          {item.crawlDepth === 0 ? (
                            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          ) : item.type === 'HUB' ? (
                            <FolderTree className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span className="font-mono text-[10px] text-slate-400 font-semibold">
                            D{item.crawlDepth}
                          </span>
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-slate-900 dark:text-slate-100 block truncate">{item.title}</span>
                          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                            {item.url.replace('https://nuviraspace.com', '') || '/'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.type === 'HOMEPAGE' ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300' :
                        item.type === 'HUB' ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300' :
                        item.type === 'CLUSTER_LANDING' ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {item.type}
                      </span>
                    </td>

                    <td className="py-2.5 px-4">
                      <span className={`font-mono font-bold text-xs ${
                        item.status === 200 ? 'text-emerald-700 dark:text-emerald-400' :
                        item.status === 301 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-4">
                      {item.isIndexable ? (
                        <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Indexable</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-700 dark:text-rose-400 text-[11px] font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Noindex / Blocked</span>
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onNavigateToGraph(item.url)}
                          className="px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-blue-400 font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Layers className="w-3 h-3" />
                          <span>In Graph</span>
                        </button>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-slate-400 hover:text-slate-700"
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
    </div>
  );
};
