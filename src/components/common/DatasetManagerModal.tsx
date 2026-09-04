import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  FileJson, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Copy, 
  FileText
} from 'lucide-react';
import { 
  SEODashboardDataset 
} from '../../types/seo-schema';
import { 
  BUILT_IN_SNAPSHOTS, 
  validateLeadSeoDataset 
} from '../../services/dataLoader';

interface DatasetManagerModalProps {
  currentDataset: SEODashboardDataset;
  onSelectSnapshot: (dataset: SEODashboardDataset) => void;
  onClose: () => void;
}

export const DatasetManagerModal: React.FC<DatasetManagerModalProps> = ({
  currentDataset,
  onSelectSnapshot,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'snapshots' | 'upload' | 'contract'>('snapshots');
  const [pastedJson, setPastedJson] = useState('');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: string[] } | null>(null);

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(pastedJson);
      const validation = validateLeadSeoDataset(parsed);
      setValidationResult(validation);

      if (validation.valid) {
        onSelectSnapshot(parsed as SEODashboardDataset);
        onClose();
      }
    } catch {
      setValidationResult({
        valid: false,
        errors: ['Syntax error: Invalid JSON structure.'],
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const validation = validateLeadSeoDataset(parsed);
        setValidationResult(validation);

        if (validation.valid) {
          onSelectSnapshot(parsed as SEODashboardDataset);
          onClose();
        }
      } catch {
        setValidationResult({
          valid: false,
          errors: ['Failed to parse uploaded file. Must be valid JSON.'],
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadCurrent = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentDataset, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nuviraspace-audit-${currentDataset.metadata.auditDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left ring-1 ring-slate-900/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 leading-none tracking-tight">SEO Dataset Intelligence Contract</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Hermes Lead SEO data provider pipeline and audit snapshot control.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-5 border-b border-slate-200/80 flex gap-6 text-xs font-semibold bg-white">
          <button
            onClick={() => setActiveTab('snapshots')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'snapshots'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            Available Snapshots
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            Import / Replace Audit JSON
          </button>
          <button
            onClick={() => setActiveTab('contract')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'contract'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            Lead SEO Data Contract
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700">
          {activeTab === 'snapshots' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-xs">Select an audit snapshot:</span>
                <button
                  onClick={handleDownloadCurrent}
                  className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export Current JSON</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {BUILT_IN_SNAPSHOTS.map((snap) => {
                  const isCurrent = currentDataset.metadata.auditId === snap.data.metadata.auditId;

                  return (
                    <div
                      key={snap.id}
                      onClick={() => {
                        onSelectSnapshot(snap.data);
                        onClose();
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all shadow-2xs ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                          : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{snap.name}</span>
                          {snap.isDemo && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[9px]">
                              DEMO DATA
                            </span>
                          )}
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold text-[9px]">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 font-mono text-[11px] font-medium">{snap.date}</span>
                      </div>

                      <div className="mt-2.5 grid grid-cols-3 gap-2 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2.5">
                        <div>
                          Overall Score: <strong className="text-slate-900 font-mono font-semibold">{snap.data.healthScores.overall}</strong>
                        </div>
                        <div>
                          Issues Logged: <strong className="text-slate-900 font-mono font-semibold">{snap.data.issues?.length || 0}</strong>
                        </div>
                        <div>
                          Engine: <strong className="text-slate-900 font-mono font-semibold">{snap.version}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="p-5 border-2 border-dashed border-slate-200 rounded-xl text-center hover:border-blue-500 transition-colors bg-slate-50/60">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <label className="block text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                  <span>Upload execution-object.json or audit.json</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-600 mt-1 font-medium">
                  JSON must follow data/schema.json contract
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-1.5 text-xs">
                  Or Paste Raw JSON Payload:
                </label>
                <textarea
                  rows={6}
                  value={pastedJson}
                  onChange={(e) => setPastedJson(e.target.value)}
                  placeholder="Paste validated execution-object.json here..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all shadow-2xs"
                />
              </div>

              {validationResult && (
                <div className={`p-3.5 rounded-xl border text-xs shadow-2xs ${
                  validationResult.valid 
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                    : 'bg-rose-50/80 border-rose-200 text-rose-900'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {validationResult.valid ? (
                      <><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dataset Validated Successfully</>
                    ) : (
                      <><AlertCircle className="w-4 h-4 text-rose-600" /> Schema Validation Failed</>
                    )}
                  </div>
                  {!validationResult.valid && (
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] font-medium">
                      {validationResult.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <button
                onClick={handleApplyJson}
                disabled={!pastedJson.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
              >
                Validate & Load Dataset
              </button>
            </div>
          )}

          {activeTab === 'contract' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-600 leading-relaxed text-[11px] shadow-2xs">
                <strong className="text-slate-800">Hermes Multi-Agent Integration Rules:</strong><br />
                The SEO Intelligence Command Center operates as the visual intelligence consumer for Hermes Lead SEO. Findings, scores, and topology are never hardcoded in client templates.
              </div>

              <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-100/90 px-3.5 py-2 font-mono text-[10px] text-slate-700 font-bold border-b border-slate-200">
                  data/schema.json Structure
                </div>
                <div className="p-3.5 bg-slate-900 text-slate-100 font-mono text-[10px] overflow-x-auto max-h-48 leading-relaxed">
                  <pre>{`{
  "metadata": { "siteUrl": "string", "auditDate": "YYYY-MM-DD", "datasetVersion": "string" },
  "healthScores": { "overall": 0-100, "technical": 0-100, "semantic": 0-100, ... },
  "executiveTakeaway": { "whatIsWrong": [], "whyItMatters": [], "whatToDoNext": [] },
  "issues": [{ "id": "ISS-X", "title": "...", "severity": "CRITICAL|HIGH|MEDIUM|LOW", ... }],
  "evidence": [{ "id": "EVI-X", "findingId": "ISS-X", "source": "...", ... }],
  "semanticGraph": { "nodes": [...], "edges": [...], "topicalCenter": { ... } }
}`}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
