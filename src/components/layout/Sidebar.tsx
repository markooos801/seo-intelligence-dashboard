import React from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  Network, 
  Boxes, 
  Award, 
  GitFork, 
  Link2, 
  FileText, 
  GitPullRequest, 
  Code2, 
  ShieldCheck, 
  Bot, 
  TrendingUp, 
  Target, 
  Milestone, 
  FileCheck2, 
  History,
  AlertTriangle,
  GitCommit
} from 'lucide-react';
import { SEODashboardDataset } from '../../types/seo-schema';

export type NavViewKey = 
  | 'overview'
  | 'technical'
  | 'semantic'
  | 'clusters'
  | 'topical-authority'
  | 'architecture'
  | 'internal-linking'
  | 'content'
  | 'content-gaps'
  | 'structured-data'
  | 'eeat'
  | 'aeo'
  | 'search-performance'
  | 'cannibalization'
  | 'release-timeline'
  | 'opportunities'
  | 'roadmap'
  | 'evidence'
  | 'audit-history';

interface SidebarProps {
  currentView: NavViewKey;
  onSelectView: (view: NavViewKey) => void;
  dataset: SEODashboardDataset;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  dataset,
  isOpen,
  onClose,
}) => {
  const issuesCount = dataset.issues?.length || 0;
  const criticalIssuesCount = dataset.issues?.filter(i => i.severity === 'CRITICAL').length || 0;
  const gapsCount = dataset.contentGaps?.length || 0;

  const navItems: Array<{
    key: NavViewKey;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      key: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: criticalIssuesCount > 0 ? `${criticalIssuesCount} crit` : undefined,
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      key: 'technical',
      label: 'Technical SEO',
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      key: 'semantic',
      label: 'Semantic Intelligence',
      icon: <Network className="w-4 h-4" />,
      badge: 'Core Map',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      key: 'clusters',
      label: 'Topic Clusters',
      icon: <Boxes className="w-4 h-4" />,
      badge: dataset.topicClusters?.length ? `${dataset.topicClusters.length}` : undefined,
    },
    {
      key: 'topical-authority',
      label: 'Evidence-Based Topic Health',
      icon: <Award className="w-4 h-4" />,
    },
    {
      key: 'architecture',
      label: 'Site Architecture',
      icon: <GitFork className="w-4 h-4" />,
    },
    {
      key: 'internal-linking',
      label: 'Internal Linking',
      icon: <Link2 className="w-4 h-4" />,
    },
    {
      key: 'content',
      label: 'Content',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      key: 'content-gaps',
      label: 'Content Gaps',
      icon: <GitPullRequest className="w-4 h-4" />,
      badge: gapsCount > 0 ? `${gapsCount}` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      key: 'structured-data',
      label: 'Structured Data',
      icon: <Code2 className="w-4 h-4" />,
    },
    {
      key: 'eeat',
      label: 'E-E-A-T',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      key: 'aeo',
      label: 'AEO / AI Search',
      icon: <Bot className="w-4 h-4" />,
      badge: 'AI Search',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      key: 'search-performance',
      label: 'Search Performance',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      key: 'cannibalization',
      label: 'Cannibalization',
      icon: <GitFork className="w-4 h-4 text-amber-600" />,
      badge: dataset.cannibalization?.length ? `${dataset.cannibalization.length}` : '3 alerts',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      key: 'release-timeline',
      label: 'Release Timeline',
      icon: <GitCommit className="w-4 h-4 text-emerald-600" />,
    },
    {
      key: 'opportunities',
      label: 'Opportunities',
      icon: <Target className="w-4 h-4" />,
      badge: `${issuesCount}`,
      badgeColor: 'bg-slate-200 text-slate-800'
    },
    {
      key: 'roadmap',
      label: 'Roadmap',
      icon: <Milestone className="w-4 h-4" />,
    },
    {
      key: 'evidence',
      label: 'Evidence',
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: dataset.evidence?.length ? `${dataset.evidence.length}` : undefined,
    },
    {
      key: 'audit-history',
      label: 'Audit History',
      icon: <History className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-[#f1f5f9] dark:bg-[#0c121e] border-r border-[#d4dce7] dark:border-[#1e293b] flex flex-col shrink-0 select-none shadow-[2px_0_10px_rgba(166,178,195,0.3)] dark:shadow-[2px_0_10px_rgba(0,0,0,0.5)]
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Heading */}
      <div className="h-14 px-4 border-b border-[#d4dce7] dark:border-[#1e293b] flex items-center gap-2.5 bg-[#eef2f6] dark:bg-[#0c121e]">
        <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-[2px_2px_5px_rgba(166,178,195,0.5),-1px_-1px_3px_rgba(255,255,255,0.8)] ring-1 ring-slate-800">
          H
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 leading-none">
            Hermes Lead SEO
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight mt-0.5 truncate">
            Command Center
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-1 text-xs">
        {navItems.map((item) => {
          const isActive = currentView === item.key;

          return (
            <button
              key={item.key}
              onClick={() => {
                onSelectView(item.key);
                onClose?.();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all group ${
                isActive
                  ? 'bg-[#e2e8f1] dark:bg-[#141c2c] text-blue-700 dark:text-blue-400 font-bold shadow-[inset_2px_2px_4px_rgba(166,178,195,0.55),inset_-2px_-2px_4px_rgba(255,255,255,0.85)] dark:shadow-none border border-blue-300/40 dark:border-[#1e293b]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-medium hover:bg-[#eef2f6] dark:hover:bg-[#141c2c] hover:shadow-[2px_2px_5px_rgba(166,178,195,0.35),-2px_-2px_5px_rgba(255,255,255,0.8)] dark:hover:shadow-none border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={`shrink-0 transition-colors ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 shadow-2xs ${
                  item.badgeColor || 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-3.5 border-t border-[#d4dce7] dark:border-[#1e293b] bg-[#e8edf3] dark:bg-[#141c2c] text-[11px] text-slate-600 dark:text-slate-400">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="text-slate-700 dark:text-slate-400 font-medium">Hermes Engine</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-[#34d399] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#34d399] animate-pulse" />
            ONLINE
          </span>
        </div>
        <div className="truncate text-slate-600 dark:text-slate-500 font-mono text-[10px] mt-1 font-medium">
          Snapshot: {dataset.metadata.auditId}
        </div>
      </div>
    </aside>
    </>
  );
};
