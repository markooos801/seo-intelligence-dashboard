import React from 'react';
import { 
  X, 
  AlertTriangle, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Clock, 
  User, 
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { IssueItem, EvidenceItem } from '../../types/seo-schema';

interface IssueDetailModalProps {
  issue: IssueItem | null;
  evidenceList?: EvidenceItem[];
  onClose: () => void;
  onNavigateToGraph?: (urlOrId?: string) => void;
  onNavigateToEvidence?: (evidenceId: string) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  evidenceList = [],
  onClose,
  onNavigateToGraph,
  onNavigateToEvidence,
}) => {
  if (!issue) return null;

  const matchedEvidence = evidenceList.filter(e => 
    (issue.evidenceIds || []).includes(e.id) || e.findingId === issue.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left ring-1 ring-slate-900/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 bg-slate-50/70 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className="font-mono font-bold text-xs text-blue-700 bg-blue-100/90 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
                {issue.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                issue.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                issue.severity === 'HIGH' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                issue.severity === 'MEDIUM' ? 'bg-amber-50/60 text-amber-700 border-amber-200/70' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {issue.severity}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {issue.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Priority: {issue.priority}
              </span>
            </div>
            <h2 className="font-bold text-base text-slate-900 leading-snug tracking-tight">{issue.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* Root Cause */}
          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/90 shadow-2xs">
            <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Root Cause Diagnosis</span>
            </h4>
            <p className="text-slate-800 leading-relaxed text-xs font-medium">
              {issue.rootCause}
            </p>
          </div>

          {/* Recommended Action */}
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/90 shadow-2xs">
            <h4 className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Recommended Engineering Action</span>
            </h4>
            <p className="text-slate-800 leading-relaxed text-xs">
              {issue.recommendedAction}
            </p>
          </div>

          {/* Impact & Effort Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
              <span className="text-slate-600 text-[10px] block font-semibold">Business Impact</span>
              <span className="font-bold text-slate-900 text-sm">{issue.impact}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
              <span className="text-slate-600 text-[10px] block font-semibold">Implementation Effort</span>
              <span className="font-bold text-slate-900 text-sm">{issue.effort}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
              <span className="text-slate-600 text-[10px] block font-semibold">Roadmap Horizon</span>
              <span className="font-bold text-slate-900 text-sm">{issue.timeframe || 'THIS MONTH'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
              <span className="text-slate-600 text-[10px] block font-semibold">Assigned Owner</span>
              <span className="font-bold text-slate-900 text-xs truncate block">{issue.owner || 'Lead SEO Agent'}</span>
            </div>
          </div>

          {issue.estimatedTrafficGain && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 shadow-2xs">
              <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-xs">Estimated Traffic / Business Gain: <strong className="font-semibold">{issue.estimatedTrafficGain}</strong></span>
            </div>
          )}

          {/* Affected URLs */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between">
              <span>Affected URLs ({(issue.affectedUrls || []).length})</span>
            </h4>
            <div className="space-y-1.5">
              {(issue.affectedUrls || []).map(url => (
                <div 
                  key={url} 
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/80 text-[11px] hover:bg-slate-100/50 transition-colors"
                >
                  <span className="font-mono text-slate-800 truncate text-[11px]">{url}</span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToGraph && onNavigateToGraph(url);
                      }}
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-blue-700 text-[10px] font-semibold flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                      title="Inspect in Semantic Graph"
                    >
                      <Layers className="w-3 h-3" />
                      <span>In Graph</span>
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
                      title="Open page URL"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traceable Evidence */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>Traceable Evidence Logs ({matchedEvidence.length})</span>
            </h4>
            {matchedEvidence.length === 0 ? (
              <p className="text-slate-600 italic font-medium">No direct logs attached. Reference ID: {(issue.evidenceIds || []).join(', ')}</p>
            ) : (
              <div className="space-y-2">
                {matchedEvidence.map(evi => (
                  <div key={evi.id} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1">
                      <span className="font-bold font-mono text-blue-700">{evi.id}</span>
                      <span className="font-semibold text-slate-700">Source: {evi.source}</span>
                    </div>
                    <div className="font-mono text-slate-900 text-[11px] font-semibold">
                      {evi.rawMetricValue}
                    </div>
                    <p className="text-slate-700 mt-1 italic text-[11px] leading-relaxed">
                      "{evi.snippet}"
                    </p>
                    <div className="mt-2 text-[10px] text-slate-600">
                      <strong className="text-slate-800">Verification:</strong> {evi.verificationStep}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              if (issue.affectedUrls[0]) onNavigateToGraph && onNavigateToGraph(issue.affectedUrls[0]);
            }}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Inspect in Semantic Graph</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-2xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
