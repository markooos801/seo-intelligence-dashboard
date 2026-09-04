import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Terminal, 
  Clock, 
  Bot, 
  Globe, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { SEODashboardDataset, EvidenceItem, IssueItem } from '../../types/seo-schema';

interface EvidenceViewProps {
  dataset: SEODashboardDataset;
  onSelectFinding: (findingId: string) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  dataset,
  onSelectFinding,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>('ALL');

  const evidenceList = dataset.evidence || [];

  const filtered = evidenceList.filter(e => {
    const matchesSearch = !searchFilter ||
      e.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.findingId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.source.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.snippet.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (e.url && e.url.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchesType = sourceTypeFilter === 'ALL' || e.sourceType === sourceTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>Traceable Audit Evidence & Telemetry Logs</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable chain of custody linking every algorithmic diagnostic to raw HTTP headers, DOM trees, and API payloads.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          {evidenceList.length} Verified Evidence Records
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search evidence ID, URL, snippet..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-800"
          />
        </div>

        {/* Source Type Filter */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 flex-wrap">
          <span className="font-semibold text-slate-700 mr-1 text-[11px] uppercase">Source:</span>
          {['ALL', 'CRAWL_LOG', 'API_GSC', 'SCHEMA_VALIDATOR', 'SPECIALIST_AGENT', 'NLP_EMBEDDING'].map(type => (
            <button
              key={type}
              onClick={() => setSourceTypeFilter(type)}
              className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                sourceTypeFilter === type
                  ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {type === 'ALL' ? 'All Sources' : type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Logs Stream */}
      <div className="space-y-3">
        {filtered.map(evi => (
          <div 
            key={evi.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-2.5 transition-all hover:border-slate-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {evi.id}
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {evi.sourceType}
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {evi.source}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  {evi.timestamp}
                </span>
                <button
                  onClick={() => onSelectFinding(evi.findingId)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-medium text-[11px] text-slate-700 flex items-center gap-1 transition-colors"
                >
                  <span>Finding {evi.findingId}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Target URL */}
            {evi.url && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{evi.url}</span>
              </div>
            )}

            {/* Raw Metric Value */}
            <div className="p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
              <span className="text-emerald-400 font-bold">$ </span>
              {evi.rawMetricValue}
            </div>

            {/* Snippet */}
            <div className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded border border-slate-100">
              "{evi.snippet}"
            </div>

            {/* Verification Step */}
            <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
              <strong>Verification Step:</strong>
              <span>{evi.verificationStep}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
