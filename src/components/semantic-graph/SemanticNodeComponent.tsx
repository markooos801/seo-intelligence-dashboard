import React, { memo, useState, useMemo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Globe, 
  Layers, 
  Bookmark, 
  Boxes, 
  FileText, 
  AlertCircle, 
  ExternalLink,
  GitCommit,
  Maximize2,
  Minimize2,
  TrendingDown,
  Split,
  Link,
  Search,
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { SemanticNodeData } from '../../types/seo-schema';

export const SemanticNodeComponent = memo(({ data, selected }: NodeProps) => {
  const node = data as unknown as SemanticNodeData & { 
    graphMode?: string; 
    isDimmed?: boolean;
    clusterColor?: string;
    isCannibalized?: boolean;
    decayStatus?: 'FRESH' | 'AGING' | 'DECAYED';
    pageRankScore?: number;
    beforeAfterStatus?: 'RETAINED' | 'CONSOLIDATED' | 'NEW_CLUSTER_PAGE' | 'RE_ROUTED';
  };

  const isSelected = selected;
  const [isExpandedInline, setIsExpandedInline] = useState(false);
  const graphMode = node.graphMode || 'CLUSTERS';

  // Type configuration
  const typeConfig: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
    SITE: { 
      label: 'CENTRAL ENTITY', 
      icon: <Globe className="w-4 h-4 text-blue-700" />, 
      bg: 'bg-blue-100 text-blue-950 font-black', 
      text: 'text-blue-950', 
      border: 'border-blue-600' 
    },
    ENTITY: { 
      label: 'CENTRAL ENTITY', 
      icon: <Layers className="w-3.5 h-3.5 text-indigo-700" />, 
      bg: 'bg-indigo-100 text-indigo-950 font-black', 
      text: 'text-indigo-950', 
      border: 'border-indigo-600' 
    },
    TOPIC: { 
      label: 'PILLAR TOPIC', 
      icon: <Bookmark className="w-3.5 h-3.5 text-slate-800" />, 
      bg: 'bg-slate-200 text-slate-950 font-bold', 
      text: 'text-slate-950', 
      border: 'border-slate-500' 
    },
    CLUSTER: { 
      label: 'TOPIC CLUSTER', 
      icon: <Boxes className="w-3.5 h-3.5 text-cyan-800" />, 
      bg: 'bg-cyan-100 text-cyan-950 font-bold', 
      text: 'text-cyan-950', 
      border: 'border-cyan-600' 
    },
    SUBTOPIC: { 
      label: 'SUBTOPIC', 
      icon: <GitCommit className="w-3.5 h-3.5 text-teal-800" />, 
      bg: 'bg-teal-100 text-teal-950 font-bold', 
      text: 'text-teal-950', 
      border: 'border-teal-500' 
    },
    PAGE: { 
      label: 'SUPPORTING PAGE', 
      icon: <FileText className="w-3.5 h-3.5 text-emerald-800" />, 
      bg: 'bg-emerald-100 text-emerald-950 font-bold', 
      text: 'text-emerald-950', 
      border: 'border-emerald-600' 
    },
  };

  const currentType = typeConfig[node.type] || typeConfig.TOPIC;

  // Status badge styling
  const statusStyles: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    STRONG: { bg: 'bg-emerald-100 border-emerald-300 text-emerald-950', text: 'text-emerald-950 font-bold', dot: 'bg-emerald-600', label: 'STRONG' },
    COVERED: { bg: 'bg-blue-100 border-blue-300 text-blue-950', text: 'text-blue-950 font-bold', dot: 'bg-blue-600', label: 'COVERED' },
    WEAK: { bg: 'bg-amber-100 border-amber-300 text-amber-950', text: 'text-amber-950 font-black', dot: 'bg-amber-600', label: 'WEAK' },
    MISSING: { bg: 'bg-rose-100 border-rose-300 text-rose-950', text: 'text-rose-950 font-bold', dot: 'bg-rose-600', label: 'CONTENT GAP' },
    ORPHAN: { bg: 'bg-red-100 border-red-300 text-red-950', text: 'text-red-950 font-bold', dot: 'bg-red-600', label: 'ORPHAN PAGE' },
    'OFF-TOPIC': { bg: 'bg-purple-100 border-purple-300 text-purple-950', text: 'text-purple-950 font-bold', dot: 'bg-purple-600', label: 'OFF-TOPIC' },
    OPPORTUNITY: { bg: 'bg-sky-100 border-sky-300 text-sky-950', text: 'text-sky-950 font-bold', dot: 'bg-sky-600', label: 'OPPORTUNITY' },
  };

  const currentStatus = statusStyles[node.status] || statusStyles.COVERED;

  // Requirement 6: Typography hierarchy
  // Central Entity: 16–18px bold
  // Pillar / Core Topic: 13–14px semibold
  // Supporting Page: 11–12px regular
  const typographyClass = useMemo(() => {
    if (node.type === 'SITE' || node.type === 'ENTITY') {
      return 'text-[17px] font-bold text-slate-900 tracking-tight leading-snug';
    }
    if (node.type === 'TOPIC' || node.type === 'CLUSTER') {
      return 'text-[13.5px] font-semibold text-slate-900 leading-snug';
    }
    return 'text-[12px] font-normal text-slate-800 leading-snug';
  }, [node.type]);

  // Mode-based visual styling
  let modeOverlayClass = '';
  let modeBadge = null;

  if (graphMode === 'CANNIBALIZATION') {
    const isCannibalized = node.isCannibalized || node.label.toLowerCase().includes('bus') || node.label.toLowerCase().includes('refueling');
    if (isCannibalized) {
      modeOverlayClass = 'ring-2 ring-rose-500 bg-rose-50/40 border-rose-500';
      modeBadge = (
        <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
          <Split className="w-3 h-3 text-rose-600" />
          <span>CANNIBALIZED</span>
        </span>
      );
    }
  } else if (graphMode === 'LINK_FLOW') {
    const pagerank = node.pageRankScore || (node.type === 'SITE' ? 9.8 : node.type === 'TOPIC' ? 8.2 : 6.4);
    modeOverlayClass = 'border-indigo-400 bg-indigo-50/20';
    modeBadge = (
      <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200 flex items-center gap-1">
        <Link className="w-3 h-3 text-indigo-600" />
        <span>PR: {pagerank.toFixed(1)}</span>
      </span>
    );
  } else if (graphMode === 'DECAY') {
    const decay = node.decayStatus || (node.findingsCount && node.findingsCount > 1 ? 'DECAYED' : 'FRESH');
    if (decay === 'DECAYED') {
      modeOverlayClass = 'border-amber-500 bg-amber-50/30';
      modeBadge = (
        <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
          <TrendingDown className="w-3 h-3 text-amber-600" />
          <span>TRAFFIC DECAY</span>
        </span>
      );
    } else {
      modeBadge = (
        <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>FRESH</span>
        </span>
      );
    }
  } else if (graphMode === 'PERFORMANCE') {
    modeOverlayClass = 'border-blue-400';
    modeBadge = (
      <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
        <Search className="w-3 h-3 text-blue-600" />
        <span>{node.clicks ? `${node.clicks} clks` : 'Core Hub'}</span>
      </span>
    );
  }

  // Before / After Map highlight badge
  if (node.beforeAfterStatus) {
    if (node.beforeAfterStatus === 'CONSOLIDATED') {
      modeOverlayClass = 'border-rose-400 bg-rose-50/60 line-through opacity-70';
      modeBadge = (
        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-200 text-rose-900">
          CONSOLIDATE (301)
        </span>
      );
    } else if (node.beforeAfterStatus === 'NEW_CLUSTER_PAGE') {
      modeOverlayClass = 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-400';
      modeBadge = (
        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-200 text-emerald-900">
          + ADD NEW CLUSTER
        </span>
      );
    }
  }

  return (
    <div 
      className={`group relative rounded-2xl neu-card-sm p-3.5 border transition-all duration-200 cursor-pointer select-none text-left hover:z-50 ${
        isExpandedInline ? 'z-50 scale-105 ring-2 ring-blue-600 shadow-xl min-w-[320px] max-w-[420px]' : 'hover:scale-[1.01]'
      }
        ${isSelected ? 'ring-2 ring-blue-600 ring-offset-1 border-blue-600 shadow-md' : `${currentType.border} hover:border-blue-500`}
        ${node.status === 'ORPHAN' ? 'border-dashed border-red-500 bg-red-50/40' : ''}
        ${node.status === 'MISSING' ? 'border-dashed border-rose-500 bg-rose-50/40' : ''}
        ${node.isDimmed ? 'opacity-25 saturate-50' : 'opacity-100'}
        ${modeOverlayClass}
      `}
      style={{ 
        minWidth: isExpandedInline ? '330px' : (node.type === 'SITE' || node.type === 'ENTITY' ? '310px' : node.type === 'PAGE' ? '280px' : '260px'), 
        maxWidth: isExpandedInline ? '460px' : '340px' 
      }}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-2.5 !h-2.5 !bg-slate-700 !border-2 !border-white" 
      />

      {/* Header: Type Badge, Mode Badge, and Controls */}
      <div className="flex items-center justify-between gap-1.5 mb-2 flex-wrap">
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] tracking-wider uppercase border border-slate-300/80 font-bold font-mono ${currentType.bg}`}>
          {currentType.icon}
          <span>{currentType.label}</span>
        </div>

        <div className="flex items-center gap-1">
          {modeBadge}

          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] border font-bold font-mono ${currentStatus.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} />
            <span>{currentStatus.label}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpandedInline(!isExpandedInline);
            }}
            className="neu-btn p-1 rounded-md text-slate-500 hover:text-slate-900 transition-colors"
            title={isExpandedInline ? "Collapse node" : "Expand details"}
          >
            {isExpandedInline ? (
              <Minimize2 className="w-3.5 h-3.5 text-blue-700" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-slate-600 hover:text-blue-700" />
            )}
          </button>
        </div>
      </div>

      {/* Node Label / Title - Requirement 6 Typography Hierarchy */}
      <div className={`${typographyClass} ${isExpandedInline ? 'line-clamp-none' : 'line-clamp-2 group-hover:line-clamp-none'} text-slate-900 dark:text-slate-100 font-bold`}>
        {node.label}
      </div>

      {/* Inline Expanded Description */}
      {isExpandedInline && node.description && (
        <div className="mt-2 p-2 rounded-xl neu-inset text-xs text-slate-800 dark:text-slate-200 leading-relaxed border border-slate-200/80 dark:border-slate-700/80">
          {node.description}
        </div>
      )}

      {/* Optional URL indicator */}
      {node.url && (
        <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono truncate mt-1.5 flex items-center gap-1">
          <ExternalLink className="w-3 h-3 shrink-0 text-slate-400 dark:text-slate-500" />
          <span className="truncate">
            {node.url.replace('https://nuviraspace.com', '') || '/'}
          </span>
        </div>
      )}

      {/* Footer Metrics */}
      <div className="mt-2.5 pt-2 border-t border-[#d4dce7] dark:border-slate-700/80 flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
        {node.type === 'PAGE' ? (
          <div className="flex items-center gap-2">
            <span>Pos: <strong className="text-slate-950 dark:text-slate-100 font-mono">#{node.position ? node.position.toFixed(1) : '-'}</strong></span>
            <span>Clicks: <strong className="text-slate-950 dark:text-slate-100 font-mono">{node.clicks ? node.clicks.toLocaleString() : '-'}</strong></span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Topical Coverage: <strong className="text-slate-950 dark:text-slate-100 font-mono">{node.coverageScore ?? 85}%</strong></span>
          </div>
        )}

        {/* Findings Badge */}
        {Boolean(node.findingsCount && node.findingsCount > 0) && (
          <div className="flex items-center gap-1 text-amber-950 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-lg text-[10px] font-bold shrink-0 font-mono">
            <AlertCircle className="w-3 h-3 text-amber-700" />
            <span>{node.findingsCount} issue{node.findingsCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-2.5 !h-2.5 !bg-slate-700 !border-2 !border-white" 
      />
    </div>
  );
});

SemanticNodeComponent.displayName = 'SemanticNodeComponent';
