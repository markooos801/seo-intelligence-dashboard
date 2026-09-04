import React from 'react';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Table, 
  ListOrdered, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { SEODashboardDataset } from '../../types/seo-schema';

interface AEOViewProps {
  dataset: SEODashboardDataset;
}

export const AEOView: React.FC<AEOViewProps> = ({ dataset }) => {
  const aeo = dataset.aeo;
  if (!aeo) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
        AEO / AI Search readiness data unavailable in current dataset.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#cbd5e1] dark:border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">
            <Bot className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>Answer Engine Optimization (AEO) & LLM Retrieval Index</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Synthetic search readiness for Perplexity AI, ChatGPT Search, Google AI Overviews, and Gemini Grounding.
          </p>
        </div>
        <span className="px-3 py-1 rounded-xl text-xs font-bold neu-inset text-blue-900 dark:text-blue-300 font-mono">
          AEO Readiness: {dataset.healthScores.aeo}/100
        </span>
      </div>

      {/* Synthetic Retrieval Indexes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Perplexity */}
        <div className="neu-card p-5 rounded-2xl relative">
          <div className="absolute top-3 right-3 flex gap-1">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold neu-inset text-slate-600 dark:text-slate-300 uppercase tracking-wider font-mono" title="Proprietary estimate. Not an official metric.">Estimated / Evidence</span>
          </div>
          <div className="flex items-center justify-between mb-2 pr-28">
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              Perplexity Citation Index
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-2">
            {aeo.perplexityCitationIndex}<span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/100</span>
          </div>
          <div className="w-full neu-inset h-2 rounded-full mt-3 overflow-hidden p-0.5">
            <div 
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
              style={{ width: `${aeo.perplexityCitationIndex}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2.5 leading-tight">
            Likelihood of direct factual citation in Perplexity research summaries.
          </p>
        </div>

        {/* ChatGPT Search */}
        <div className="neu-card p-5 rounded-2xl relative">
          <div className="absolute top-3 right-3 flex gap-1">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold neu-inset text-slate-600 dark:text-slate-300 uppercase tracking-wider font-mono" title="Proprietary estimate. Not an official metric.">Estimated / Evidence</span>
          </div>
          <div className="flex items-center justify-between mb-2 pr-28">
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              ChatGPT Search Retrieval
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-2">
            {aeo.chatGptRetrievalIndex}<span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/100</span>
          </div>
          <div className="w-full neu-inset h-2 rounded-full mt-3 overflow-hidden p-0.5">
            <div 
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full"
              style={{ width: `${aeo.chatGptRetrievalIndex}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2.5 leading-tight">
            Extraction probability for real-time web browsing queries.
          </p>
        </div>

        {/* Gemini Grounding */}
        <div className="neu-card p-5 rounded-2xl relative">
          <div className="absolute top-3 right-3 flex gap-1">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold neu-inset text-slate-600 dark:text-slate-300 uppercase tracking-wider font-mono" title="Proprietary estimate. Not an official metric.">Estimated / Evidence</span>
          </div>
          <div className="flex items-center justify-between mb-2 pr-28">
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              Gemini Search Grounding
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-2">
            {aeo.geminiSearchGroundingScore}<span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/100</span>
          </div>
          <div className="w-full neu-inset h-2 rounded-full mt-3 overflow-hidden p-0.5">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
              style={{ width: `${aeo.geminiSearchGroundingScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2.5 leading-tight">
            Index for inclusion inside Google AI Overviews and Search Grounding blocks.
          </p>
        </div>
      </div>

      {/* Structural Readiness Checklist */}
      <div className="neu-card p-5 rounded-2xl space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
          Syntactic & Direct Answer Extraction Signals
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl neu-inset">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-mono">LLM Citation Readiness</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm block mt-1">
              {aeo.llmCitationReadiness}
            </span>
          </div>

          <div className="p-3.5 rounded-xl neu-inset">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-mono">Direct Answer Probability</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm block mt-1">
              {aeo.directAnswerProbability}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl neu-inset">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-mono">Clear Entity Definitions</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm block mt-1">
              {aeo.clearEntityDefinitionsCount} Detected
            </span>
          </div>

          <div className="p-3.5 rounded-xl neu-inset">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-mono">Tables & Structured Lists</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-sm block mt-1">
              {((aeo.bulletPointsAndTablesRatio || 0) * 100).toFixed(0)}% of content
            </span>
          </div>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="neu-card p-5 rounded-2xl space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 font-mono">
          <Sparkles className="w-4 h-4 text-blue-700 dark:text-blue-400" />
          <span>Actionable Engineering Recommendations for AI Answer Engines</span>
        </h3>

        <div className="space-y-2.5">
          {(aeo.actionableInsights || []).map((insight, idx) => (
            <div key={idx} className="p-3.5 rounded-xl neu-card-sm text-xs text-slate-800 dark:text-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg neu-inset text-blue-900 dark:text-blue-300 flex items-center justify-center font-bold text-[11px] font-mono shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
