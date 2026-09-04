import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { SEODashboardDataset } from '../../types/seo-schema';

interface EEATViewProps {
  dataset: SEODashboardDataset;
}

export const EEATView: React.FC<EEATViewProps> = ({ dataset }) => {
  const eeatItems = dataset.eeat || [];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-world aerospace credibility signals, verifiable author profiles, institutional credentials, and trust proof.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          E-E-A-T Index: {dataset.healthScores.eeat}/100
        </span>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-2">
            <Award className="w-4 h-4" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider">Experience</h3>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">82<span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/100</span></div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
            Real hardware testing data, flight heritage, and orbital mission parameters.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 mb-2">
            <UserCheck className="w-4 h-4" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider">Expertise</h3>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">76<span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/100</span></div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
            Aerospace engineering leadership bylines, AIAA papers, and named specialists.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 mb-2">
            <BookOpen className="w-4 h-4" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider">Authoritativeness</h3>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">74<span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/100</span></div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
            Academic citations, conference proceedings, and NASA/ESA industry partnership mentions.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-2">
            <Building2 className="w-4 h-4" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider">Trustworthiness</h3>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">78<span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/100</span></div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
            Clear registered headquarters, SAM.gov / CAGE code references, and HTTPS security.
          </p>
        </div>
      </div>

      {/* Verified Evidence Logs */}
      <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Verified E-E-A-T Signal Audit Trail</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {eeatItems.map((item, i) => (
            <div key={i} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {item.dimension}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  Signal Score: {item.score}/100
                </span>
              </div>

              <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                {item.entityName}
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                <strong className="text-slate-800 dark:text-slate-200">Audit Evidence:</strong> {item.evidenceDescription}
              </div>

              {item.associatedUrl && (
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  Verified URL: {item.associatedUrl}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
