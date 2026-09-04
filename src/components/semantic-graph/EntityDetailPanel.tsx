import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Boxes, 
  FileText, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  GitPullRequest,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { SemanticNodeData, IssueItem, SEODashboardDataset } from '../../types/seo-schema';

interface EntityDetailPanelProps {
  node: SemanticNodeData | null;
  onClose: () => void;
  dataset: SEODashboardDataset;
  onSelectNodeById?: (id: string) => void;
}

export const EntityDetailPanel: React.FC<EntityDetailPanelProps> = ({
  node,
  onClose,
  dataset,
  onSelectNodeById,
}) => {
  const [isExpandedModal, setIsExpandedModal] = useState(false);

  if (!node) return null;

  const graph = dataset.semanticGraph || { nodes: [], edges: [] };
  
  // Find related edges
  const outgoingEdges = (graph.edges || []).filter(e => e.source === node.id);
  const incomingEdges = (graph.edges || []).filter(e => e.target === node.id);

  // Find related connected nodes
  const relatedNodeIds = Array.from(new Set([
    ...outgoingEdges.map(e => e.target),
    ...incomingEdges.map(e => e.source)
  ]));

  const relatedNodes = (graph.nodes || []).filter(n => relatedNodeIds.includes(n.id));

  // Find supporting pages
  const supportingPages = relatedNodes.filter(n => n.type === 'PAGE');
  const supportingTopics = relatedNodes.filter(n => n.type === 'TOPIC' || n.type === 'SUBTOPIC');
  const relatedClusters = relatedNodes.filter(n => n.type === 'CLUSTER');

  // Gaps associated with this cluster/topic
  const nodeLabelLower = (node.label || '').toLowerCase();
  const matchedGaps = (dataset.contentGaps || []).filter(g => 
    g.clusterId === node.id || 
    (g.clusterName || '').toLowerCase().includes(nodeLabelLower) ||
    (g.coreTopic || '').toLowerCase().includes(nodeLabelLower)
  );

  const containerClasses = isExpandedModal
    ? "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200"
    : "absolute top-0 right-0 bottom-0 w-[420px] max-w-full neu-card rounded-none rounded-l-2xl border-l border-[#d4dce7] shadow-xl z-30 flex flex-col animate-in slide-in-from-right duration-200";

  const cardClasses = isExpandedModal
    ? "max-w-3xl w-full max-h-[85vh] neu-card rounded-2xl border border-[#cbd5e1] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
    : "w-full h-full flex flex-col";

  const content = (
    <div className={cardClasses}>
      {/* Header */}
      <div className="p-4 border-b border-[#d4dce7] flex items-start justify-between neu-inset">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-indigo-100 text-indigo-950 flex items-center gap-1 border border-indigo-200 font-mono">
              <Layers className="w-3 h-3 text-indigo-700" />
              <span>{node.type} INTELLIGENCE</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
              node.status === 'STRONG' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' :
              node.status === 'COVERED' ? 'bg-blue-100 text-blue-950 border-blue-300' :
              node.status === 'MISSING' ? 'bg-rose-100 text-rose-950 border-rose-300' : 'bg-amber-100 text-amber-950 border-amber-300'
            }`}>
              {node.status}
            </span>
          </div>
          <h3 className="font-extrabold text-base text-slate-900 leading-snug">{node.label}</h3>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsExpandedModal(!isExpandedModal)}
            className="neu-btn p-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title={isExpandedModal ? "Collapse to side panel" : "Expand to floating detail modal"}
          >
            {isExpandedModal ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button 
            onClick={onClose}
            className="neu-btn p-1.5 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
            title="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-800">
        {/* Definition */}
        <div>
          <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 font-mono">
            Entity Definition & Semantic Role
          </h4>
          <div className="p-3 rounded-xl neu-inset border border-slate-200/80 text-slate-700 leading-relaxed">
            {node.description || 'Structured knowledge entity analyzed by Hermes Lead SEO multi-agent pipeline.'}
          </div>
        </div>

        {/* Authority & Coverage Health */}
        <div>
          <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 font-mono">
            Evidence-Based Topic Health
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl neu-inset border border-slate-200/80">
              <span className="text-slate-500 text-[10px] block font-mono">Topical Coverage</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-bold text-lg text-slate-950 font-mono">{node.coverageScore ?? 0}%</span>
                <span className="text-[10px] text-slate-500">of target corpus</span>
              </div>
              <div className="w-full bg-slate-300 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    (node.coverageScore ?? 0) >= 80 ? 'bg-emerald-500' :
                    (node.coverageScore ?? 0) >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${node.coverageScore ?? 0}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl neu-inset border border-slate-200/80">
              <span className="text-slate-500 text-[10px] block font-mono">Search Visibility</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-bold text-lg text-slate-950 font-mono">{node.visibilityScore ?? 0}%</span>
                <span className="text-[10px] text-slate-500">SERP weight</span>
              </div>
              <div className="w-full bg-slate-300 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${node.visibilityScore ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Pages */}
        <div>
          <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supporting Pages ({supportingPages.length})</span>
            </span>
          </h4>
          {supportingPages.length === 0 ? (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-[11px] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>No direct supporting URL attached. Entity coverage gap detected.</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              {supportingPages.map(page => (
                <div 
                  key={page.id}
                  onClick={() => onSelectNodeById && onSelectNodeById(page.id)}
                  className="p-2.5 rounded-xl neu-card-sm hover:border-blue-400 cursor-pointer transition-all flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <div className="font-medium text-slate-900 truncate">{page.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      {page.url?.replace('https://nuviraspace.com', '')}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-700 font-semibold shrink-0">
                    Pos {page.position ? page.position.toFixed(1) : '-'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Topics & Clusters */}
        {(supportingTopics.length > 0 || relatedClusters.length > 0) && (
          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1 font-mono">
              <Boxes className="w-3.5 h-3.5 text-cyan-600" />
              <span>Related Topics & Clusters</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {relatedClusters.map(c => (
                <button
                  key={c.id}
                  onClick={() => onSelectNodeById && onSelectNodeById(c.id)}
                  className="neu-btn px-2.5 py-1 rounded-lg text-cyan-950 text-[11px] transition-colors"
                >
                  {c.label}
                </button>
              ))}
              {supportingTopics.map(t => (
                <button
                  key={t.id}
                  onClick={() => onSelectNodeById && onSelectNodeById(t.id)}
                  className="neu-btn px-2.5 py-1 rounded-lg text-slate-800 text-[11px] transition-colors"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Missing Supporting Pages / Content Gaps */}
        {matchedGaps.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1 font-mono">
              <GitPullRequest className="w-3.5 h-3.5 text-rose-600" />
              <span>Missing Subtopics / Gaps ({matchedGaps.length})</span>
            </h4>
            <div className="space-y-2">
              {matchedGaps.map(gap => (
                <div key={gap.id} className="p-3 rounded-xl bg-rose-50/70 border border-rose-300 neu-card-sm">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-[10px] text-rose-900 font-mono">{gap.priority} GAP</span>
                    <span className="text-[10px] text-slate-500 font-mono">Opp: {gap.opportunityScore}/100</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-xs">{gap.expectedSubtopic}</div>
                  <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">{gap.reasonItMatters}</p>
                  <div className="mt-2 text-[10px] text-slate-500 font-mono">
                    Suggested: <strong className="text-slate-900">{gap.suggestedPageType}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={containerClasses}>
      {content}
    </div>
  );
};
