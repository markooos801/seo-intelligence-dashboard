import React from 'react';
import { 
  Code2, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Layers, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { SEODashboardDataset } from '../../types/seo-schema';

interface StructuredDataViewProps {
  dataset: SEODashboardDataset;
  onNavigateToGraph: (nodeIdOrUrl?: string) => void;
}

export const StructuredDataView: React.FC<StructuredDataViewProps> = ({
  dataset,
  onNavigateToGraph,
}) => {
  const schemas = dataset.structuredData || [];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-600" />
            <span>Structured Data, JSON-LD Schema & Wikidata Knowledge Graph Mapping</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Validation of Schema.org types, syntax compliance, Rich Snippet qualification, and entity reconciliation.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          Schema Health: {dataset.healthScores.structuredData}/100
        </span>
      </div>

      {/* Schema Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schemas.map((schema, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {schema.schemaType}
                </span>
                <div className="font-mono text-xs text-slate-700 mt-1.5 truncate max-w-sm">
                  {schema.url.replace('https://nuviraspace.com', '') || '/'}
                </div>
              </div>

              {schema.isValid ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>VALID</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>ERRORS DETECTED</span>
                </span>
              )}
            </div>

            {/* Rich Snippet Eligibility */}
            <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Rich Snippet Eligible:</span>
              <span className={`font-semibold ${schema.richSnippetEligible ? 'text-emerald-700' : 'text-slate-500'}`}>
                {schema.richSnippetEligible ? 'Qualified' : 'Not Qualified'}
              </span>
            </div>

            {/* Wikidata Entity Mapping */}
            {schema.wikidataEntity && (
              <div className="flex items-center justify-between text-xs p-2 rounded bg-indigo-50/50 border border-indigo-100">
                <span className="text-indigo-900 font-medium flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-indigo-600" />
                  <span>Wikidata Entity:</span>
                </span>
                <a 
                  href={`https://www.wikidata.org/wiki/${schema.wikidataEntity}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono font-bold text-indigo-700 hover:underline flex items-center gap-1"
                >
                  <span>{schema.wikidataEntity}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Errors / Warnings */}
            {(schema.errors || []).length > 0 && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-800">
                <div className="font-bold mb-1 flex items-center gap-1 text-[11px]">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <span>Validation Errors:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {(schema.errors || []).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {(schema.warnings || []).length > 0 && (
              <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800">
                <div className="font-bold mb-1 flex items-center gap-1 text-[11px]">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Recommended Warnings:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {(schema.warnings || []).map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onNavigateToGraph(schema.url)}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-blue-700 font-medium text-xs flex items-center gap-1 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Inspect in Semantic Graph</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
