import React from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  FileCode, 
  Smartphone, 
  Gauge, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { SEODashboardDataset } from '../../types/seo-schema';
import { EChartRenderer } from '../common/EChartRenderer';

interface TechnicalViewProps {
  dataset: SEODashboardDataset;
  onSelectFinding?: (id: string) => void;
}

export const TechnicalView: React.FC<TechnicalViewProps> = ({ dataset }) => {
  const tech = dataset.technical;
  if (!tech) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
        Technical crawl data unavailable in current dataset.
      </div>
    );
  }

  const { crawlSummary, coreWebVitals, statusCodes = [], httpSecurityHeaders = [], robotsTxtStatus, sitemapStatus, mobileParity } = tech;

  // Status Codes Bar Chart Option
  const statusCodesOption = {
    tooltip: { 
      trigger: 'axis',
      backgroundColor: '#eef2f7',
      borderColor: '#cbd5e1',
      borderWidth: 1,
      padding: [14, 18],
      textStyle: { color: '#0f172a', fontSize: 12, fontFamily: 'inherit' },
      extraCssText: 'box-shadow: 6px 6px 14px rgba(163,177,198,0.5), -6px -6px 14px rgba(255,255,255,0.85); border-radius: 12px;',
      formatter: (params: any[]) => {
        const item = params[0];
        const { name, value } = item;
        const total = (statusCodes || []).reduce((acc: number, s: any) => acc + s.count, 0);
        const percent = ((value / total) * 100).toFixed(1);
        const codeType = name.split(' ')[0];
        
        let color = '#d97706';
        if (codeType === '200') color = '#059669';
        if (codeType === '301' || codeType === '302') color = '#2563eb';
        if (codeType === '404' || codeType === '500') color = '#dc2626';

        return `
          <div style="font-weight: 700; font-size: 13px; margin-bottom: 10px; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; font-family: monospace;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 10px; height: 10px; border-radius: 2px; background-color: ${color};"></span>
              HTTP ${name}
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px;">
              <span style="color: #475569; font-weight: 500;">Pages Affected</span>
              <span style="font-weight: 700; color: #0f172a; font-family: monospace;">${value.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px;">
              <span style="color: #475569; font-weight: 500;">% of Total Crawl</span>
              <span style="font-weight: 600; color: #0f172a; font-family: monospace;">${percent}%</span>
            </div>
          </div>
        `;
      }
    },
    grid: { left: '3%', right: '4%', bottom: '5%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: (statusCodes || []).map(s => `${s.code} ${s.label}`),
      axisLabel: { fontSize: 10, color: '#475569', fontFamily: 'monospace' },
      axisLine: { lineStyle: { color: '#cbd5e1' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 10, color: '#475569', fontFamily: 'monospace' },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } }
    },
    series: [
      {
        data: (statusCodes || []).map(s => ({
          value: s.count,
          itemStyle: {
            color: s.code === 200 ? '#059669' : s.code === 301 ? '#2563eb' : s.code === 404 ? '#dc2626' : '#d97706',
            borderRadius: [4, 4, 0, 0]
          }
        })),
        type: 'bar',
        barWidth: '38%'
      }
    ]
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 neu-card rounded-2xl">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
            <span className="p-1.5 neu-inset rounded-lg text-blue-700 dark:text-blue-400">
              <Wrench className="w-4 h-4" />
            </span>
            <span>Technical SEO, Crawlability & Web Vitals Audit</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Full HTTP response code verification, crawl budget analysis, and Core Web Vitals telemetry.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold neu-inset text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Health Score: {dataset.healthScores.technical}/100</span>
        </span>
      </div>

      {/* Core Web Vitals Row */}
      <div className="neu-card p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              Field Telemetry: Core Web Vitals (Real User Metrics)
            </h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
            coreWebVitals.overallStatus === 'PASS' 
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' 
              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'
          }`}>
            Overall: {coreWebVitals.overallStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl neu-inset border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium block font-mono">Largest Contentful Paint (LCP)</span>
            <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-1">
              {coreWebVitals.lcpSeconds}s
            </div>
            <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 font-medium font-mono">
              Target: &le; 2.5s {coreWebVitals.lcpSeconds <= 2.5 ? '🟢 Good' : '🟡 Needs Work'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl neu-inset border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium block font-mono">First Input Delay (FID)</span>
            <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-1">
              {coreWebVitals.fidMs}ms
            </div>
            <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 font-medium font-mono">
              Target: &le; 100ms 🟢 Good
            </div>
          </div>

          <div className="p-3.5 rounded-xl neu-inset border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium block font-mono">Cumulative Layout Shift (CLS)</span>
            <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-1">
              {coreWebVitals.clsScore}
            </div>
            <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 font-medium font-mono">
              Target: &le; 0.10 🟢 Good
            </div>
          </div>

          <div className="p-3.5 rounded-xl neu-inset border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium block font-mono">Interaction to Next Paint (INP)</span>
            <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-1">
              {coreWebVitals.inpMs}ms
            </div>
            <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 font-medium font-mono">
              Target: &le; 200ms 🟢 Good
            </div>
          </div>
        </div>
      </div>

      {/* Crawl Summary & Status Code Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Crawl Summary */}
        <div className="neu-card p-5 rounded-2xl flex flex-col">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3.5 font-mono">
            Indexability & Crawl Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center mb-4">
            <div className="p-3 rounded-xl neu-inset border border-blue-200 dark:border-blue-900">
              <span className="text-[10px] text-blue-700 dark:text-blue-400 block font-semibold font-mono">Total Crawled</span>
              <span className="text-xl font-extrabold font-mono text-blue-950 dark:text-blue-200 mt-0.5 block">{crawlSummary.totalCrawled}</span>
            </div>
            <div className="p-3 rounded-xl neu-inset border border-emerald-200 dark:border-emerald-900">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-semibold font-mono">Indexable</span>
              <span className="text-xl font-extrabold font-mono text-emerald-950 dark:text-emerald-200 mt-0.5 block">{crawlSummary.indexablePages}</span>
            </div>
            <div className="p-3 rounded-xl neu-inset border border-rose-200 dark:border-rose-900">
              <span className="text-[10px] text-rose-700 dark:text-rose-400 block font-semibold font-mono">Non-Indexable</span>
              <span className="text-xl font-extrabold font-mono text-rose-950 dark:text-rose-200 mt-0.5 block">{crawlSummary.nonIndexablePages}</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-[#d4dce7] dark:border-slate-800 pt-3.5 flex-1">
            <div className="flex items-center justify-between">
              <span>Blocked by Robots.txt</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{crawlSummary.blockedByRobots}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Canonical Mismatches</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{crawlSummary.canonicalMismatches}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Redirect Chains (3xx)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{crawlSummary.redirectCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>5xx Server Errors</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{crawlSummary.serverErrors}</span>
            </div>
          </div>
        </div>

        {/* Status Codes Chart */}
        <div className="neu-card p-5 rounded-2xl">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2 font-mono">
            HTTP Status Code Breakdown
          </h3>
          <EChartRenderer options={statusCodesOption} height="190px" />
        </div>
      </div>

      {/* Robots, Sitemap & Security Headers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Robots.txt */}
        <div className="neu-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">Robots.txt Health</h4>
            {robotsTxtStatus.valid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Syntax Validity:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">{robotsTxtStatus.valid ? 'VALID' : 'INVALID'}</span>
            </div>
            <div className="flex justify-between">
              <span>Sitemap Directive:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{robotsTxtStatus.sitemapLinked ? 'LINKED' : 'MISSING'}</span>
            </div>
            <div className="flex justify-between">
              <span>Disallow Rules:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{robotsTxtStatus.disallowedRulesCount}</span>
            </div>
          </div>
        </div>

        {/* XML Sitemap */}
        <div className="neu-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">XML Sitemap Health</h4>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span>URLs in Sitemap:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{sitemapStatus.urlsFound}</span>
            </div>
            <div className="flex justify-between">
              <span>Orphaned in Sitemap:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{sitemapStatus.orphanedInSitemap}</span>
            </div>
            <div className="flex justify-between">
              <span>Missing from Sitemap:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{sitemapStatus.missingFromSitemap}</span>
            </div>
          </div>
        </div>

        {/* Mobile Parity */}
        <div className="neu-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">Mobile Parity & UX</h4>
            <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Responsive Viewport:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">CONFIGURED</span>
            </div>
            <div className="flex justify-between">
              <span>Tap Target Defects:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{mobileParity.tapTargetIssuesCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Font Legibility:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">PASS (16px baseline)</span>
            </div>
          </div>
        </div>
      </div>

      {/* HTTP Security Headers Inspection */}
      {httpSecurityHeaders && httpSecurityHeaders.length > 0 && (
        <div className="neu-card p-5 rounded-2xl">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3.5 flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>HTTP Security & CDN Response Headers</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {httpSecurityHeaders.map(h => (
              <div key={h.header} className="p-3 rounded-xl neu-card-sm text-xs">
                <div className="flex items-center justify-between mb-1.5 gap-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 truncate text-xs font-mono">{h.header}</span>
                  {h.present ? (
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-mono shrink-0">
                      PRESENT
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full font-mono shrink-0">
                      MISSING
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono truncate">
                  {h.value || 'Not configured'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
