import React from 'react';
import { 
  Milestone, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  User, 
  Layers
} from 'lucide-react';
import { SEODashboardDataset, IssueItem } from '../../types/seo-schema';

interface RoadmapViewProps {
  dataset: SEODashboardDataset;
  onSelectIssue: (issue: IssueItem) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  dataset,
  onSelectIssue,
}) => {
  const issues = dataset.issues || [];

  const columns: Array<{
    id: string;
    title: string;
    subtitle: string;
    badgeColor: string;
    filter: (i: IssueItem) => boolean;
  }> = [
    {
      id: 'now',
      title: 'NOW',
      subtitle: 'Immediate Blocker Remediation',
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      filter: (i) => i.timeframe === 'NOW' || i.priority === 'P0'
    },
    {
      id: 'this-week',
      title: 'THIS WEEK',
      subtitle: 'Sprint Action Items',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      filter: (i) => i.timeframe === 'THIS WEEK' || (i.priority === 'P1' && i.timeframe !== 'NOW')
    },
    {
      id: 'this-month',
      title: 'THIS MONTH',
      subtitle: 'Topical Expansion & Pillar Building',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      filter: (i) => i.timeframe === 'THIS MONTH' || (i.priority === 'P2' && i.timeframe !== 'THIS WEEK' && i.timeframe !== 'NOW')
    },
    {
      id: 'later',
      title: 'LATER',
      subtitle: 'Long-term Semantic Authority',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      filter: (i) => i.timeframe === 'LATER'
    }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Milestone className="w-4 h-4 text-blue-600" />
            <span>Execution Roadmap & Remediation Timeline</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological engineering milestones prioritizing critical crawl fixes before topical content expansions.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          Hermes Sprint Backlog
        </span>
      </div>

      {/* 4 Column Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => {
          const colIssues = issues.filter(col.filter);

          return (
            <div 
              key={col.id}
              className="bg-slate-50/70 rounded-xl border border-slate-200 p-3.5 flex flex-col min-h-[480px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-3">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${col.badgeColor}`}>
                    {col.title}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1">{col.subtitle}</div>
                </div>
                <span className="font-mono text-xs font-bold text-slate-600">
                  {colIssues.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-2.5 flex-1">
                {colIssues.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs italic">
                    No items in this horizon.
                  </div>
                ) : (
                  colIssues.map(issue => (
                    <div
                      key={issue.id}
                      onClick={() => onSelectIssue(issue)}
                      className="p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                          {issue.id}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          issue.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                          issue.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {issue.severity}
                        </span>
                      </div>

                      <div className="font-bold text-xs text-slate-900 leading-snug">
                        {issue.title}
                      </div>

                      <div className="text-[11px] text-slate-600 line-clamp-2">
                        {issue.recommendedAction}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{issue.owner || 'Lead SEO'}</span>
                        </div>
                        <span className="text-blue-600 font-medium">
                          Inspect →
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
