import React, { useState } from 'react';
import { 
  Award, 
  Target, 
  Compass, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ExternalLink, 
  ShieldCheck, 
  Zap,
  Info,
  ChevronRight,
  TrendingUp,
  Boxes,
  ArrowUpRight
} from 'lucide-react';
import { SEODashboardDataset } from '../../types/seo-schema';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

interface TopicalAuthorityViewProps {
  dataset: SEODashboardDataset;
  onNavigateToGraph: (nodeIdOrUrl?: string) => void;
}

export const TopicalAuthorityView: React.FC<TopicalAuthorityViewProps> = ({
  dataset,
  onNavigateToGraph,
}) => {
  const semanticGraph = dataset.semanticGraph;
  const topicalCenter = semanticGraph?.topicalCenter;
  const nodes = semanticGraph?.nodes || [];
  const clusters = dataset.topicClusters || [];

  const isCenterAvailable = topicalCenter && topicalCenter.available;

  // Split nodes by zone
  const coreNodes = nodes.filter(n => (topicalCenter?.zones?.core || []).includes(n.id));
  const peripheryNodes = nodes.filter(n => (topicalCenter?.zones?.relevantPeriphery || []).includes(n.id));
  const offTopicNodes = nodes.filter(n => (topicalCenter?.zones?.distantOffTopic || []).includes(n.id) || n.status === 'OFF-TOPIC');

  const [selectedClusterId, setSelectedClusterId] = useState<string>(clusters[0]?.id || '');

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-900 border border-indigo-200">
              Evidence-Based Topical Health
            </span>
            <span className="text-slate-300 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Analytical Model Based on Audited Evidence
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Topical Health & Cluster Completeness</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Multi-dimensional evaluation of domain semantic depth, entity density, and internal link reinforcement. 
            <strong className="text-slate-900 ml-1">Analytical model based on audited evidence. Not a Google metric.</strong>
          </p>
        </div>

        {/* Data Provenance Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <DataProvenanceBadge type="DERIVED" label="EVALUATION MODEL" />
          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Topical Health Index</div>
            <div className="text-xl font-black text-slate-900 font-mono">
              {dataset.healthScores.semantic}<span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Methodology Notice */}
      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 text-xs text-slate-700 space-y-2.5">
        <div className="flex items-center gap-2 text-blue-950 font-bold">
          <Info className="w-4 h-4 text-blue-700 shrink-0" />
          <span>Topical Health Measurement Framework</span>
        </div>
        <p className="text-slate-700 leading-relaxed text-[11.5px]">
          <strong>Notice:</strong> Never call this a <em>"Google Topical Authority Score"</em>. Google does not publish a single public topical authority number. This metric is an analytical model synthesized from 5 verifiable crawl and SERP dimensions:
        </p>
        
        {/* 5 Dimensions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          <div className="p-2.5 bg-white rounded-lg border border-blue-200/80">
            <span className="text-[10px] text-blue-800 block font-bold">1. COVERAGE (25%)</span>
            <span className="text-xs font-bold text-slate-900">Entity Presence</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Core nouns & verbs</span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-blue-200/80">
            <span className="text-[10px] text-blue-800 block font-bold">2. DEPTH (20%)</span>
            <span className="text-xs font-bold text-slate-900">Subtopic Depth</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Comprehensive guides</span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-blue-200/80">
            <span className="text-[10px] text-blue-800 block font-bold">3. CONNECTIVITY (25%)</span>
            <span className="text-xs font-bold text-slate-900">Link Hierarchy</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Pillar & subpage anchors</span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-blue-200/80">
            <span className="text-[10px] text-blue-800 block font-bold">4. VISIBILITY (20%)</span>
            <span className="text-xs font-bold text-slate-900">SERP Top 10</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">GSC impression breadth</span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-blue-200/80">
            <span className="text-[10px] text-blue-800 block font-bold">5. EVIDENCE (10%)</span>
            <span className="text-xs font-bold text-slate-900">Crawl Audit Proof</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Verified DOM schema</span>
          </div>
        </div>
      </div>

      {/* Cluster Health Scorecards */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Cluster Topical Health Ratings ({clusters.length} Core Clusters)
            </h3>
          </div>
          <DataProvenanceBadge type="DERIVED" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {clusters.map((c, idx) => {
            const coverage = c.coverageScore || 80;
            const healthGrade = coverage >= 85 ? 'A+' : coverage >= 75 ? 'A' : coverage >= 60 ? 'B' : 'C';
            const gradeBg = coverage >= 85 ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
              coverage >= 75 ? 'bg-blue-100 text-blue-900 border-blue-300' :
              coverage >= 60 ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-rose-100 text-rose-900 border-rose-300';

            return (
              <div 
                key={c.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-bold text-slate-900 leading-snug line-clamp-1">{c.name}</span>
                  <span className={`px-2 py-0.5 rounded font-bold font-mono text-[11px] border ${gradeBg}`}>
                    {healthGrade}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Completeness Score</span>
                    <strong className="text-slate-900 font-mono">{coverage}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${coverage >= 80 ? 'bg-emerald-600' : coverage >= 65 ? 'bg-blue-600' : 'bg-amber-500'}`} 
                      style={{ width: `${coverage}%` }} 
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{c.pageCount} Pages • {c.keywordsTargeted} Queries</span>
                  <button
                    onClick={() => onNavigateToGraph(c.id)}
                    className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topical Center & Site Radius Topology */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Topical Center & Semantic Distance Topology
            </h3>
          </div>
          {isCenterAvailable ? (
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Embedding Radius Active
            </span>
          ) : (
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Semantic distance data unavailable
            </span>
          )}
        </div>

        {isCenterAvailable ? (
          <div className="space-y-4">
            {/* Nucleus Banner */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Calculated Site Topical Nucleus
                </span>
                <div className="text-sm font-black text-slate-900 mt-0.5">
                  {topicalCenter?.centerEntity}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(topicalCenter?.dimensions || []).map((dim, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[10px] font-semibold">
                    {dim}
                  </span>
                ))}
              </div>
            </div>

            {/* Concentric Zones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Core Zone */}
              <div className="p-3.5 rounded-lg bg-blue-50/40 border border-blue-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-blue-900 uppercase">Core Topical Zone</span>
                  <span className="font-mono text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded">
                    {coreNodes.length} Elements
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2.5">
                  Primary commercial entities and hub pages directly representing core offerings.
                </p>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {coreNodes.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => onNavigateToGraph(n.id)}
                      className="p-2 rounded bg-white border border-blue-200 hover:border-blue-400 cursor-pointer flex items-center justify-between text-xs transition-colors shadow-2xs"
                    >
                      <span className="font-semibold text-slate-800 truncate">{n.label}</span>
                      <span className="text-[10px] font-mono text-blue-700 font-bold ml-2 shrink-0">{n.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relevant Periphery */}
              <div className="p-3.5 rounded-lg bg-emerald-50/40 border border-emerald-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-emerald-900 uppercase">Relevant Periphery</span>
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                    {peripheryNodes.length} Elements
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2.5">
                  Supporting technical documentation, case studies, and specialized deep-dive articles.
                </p>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {peripheryNodes.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => onNavigateToGraph(n.id)}
                      className="p-2 rounded bg-white border border-emerald-200 hover:border-emerald-400 cursor-pointer flex items-center justify-between text-xs transition-colors shadow-2xs"
                    >
                      <span className="font-semibold text-slate-800 truncate">{n.label}</span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold ml-2 shrink-0">{n.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distant / Off-Topic */}
              <div className="p-3.5 rounded-lg bg-purple-50/40 border border-purple-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-purple-900 uppercase">Distant / Diluting</span>
                  <span className="font-mono text-[10px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.2 rounded">
                    {offTopicNodes.length} Elements
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2.5">
                  Tangential articles or orphaned press releases diluting topical authority focus.
                </p>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {offTopicNodes.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => onNavigateToGraph(n.id)}
                      className="p-2 rounded bg-white border border-purple-200 hover:border-purple-400 cursor-pointer flex items-center justify-between text-xs transition-colors shadow-2xs"
                    >
                      <span className="font-semibold text-slate-800 truncate">{n.label}</span>
                      <span className="text-[10px] font-mono text-purple-700 font-bold ml-2 shrink-0">DILUTING</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200 text-slate-500 text-xs">
            Semantic distance data unavailable in this audit run.
          </div>
        )}
      </div>
    </div>
  );
};
