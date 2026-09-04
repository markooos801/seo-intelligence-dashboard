import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  NodeProps,
  Node,
  Edge,
  MarkerType,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import { 
  Boxes, 
  Layers, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink,
  RotateCcw,
  Maximize2,
  Info
} from 'lucide-react';
import { SEODashboardDataset, TopicClusterItem, ContentGapItem } from '../../types/seo-schema';

// ---------------------------------------------------------------------------
// Custom Mini Node Types
// ---------------------------------------------------------------------------

interface MiniNodeData {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeType?: 'top1' | 'top2' | 'top3' | 'gap' | 'core' | 'weak';
  score?: number | string;
  metricLabel?: string;
  onClickDetails?: () => void;
  nodeCategory: 'core' | 'top-cluster' | 'content-gap';
  clusterData?: TopicClusterItem;
  gapData?: ContentGapItem;
}

const MiniNodeComponent: React.FC<NodeProps> = ({ data, selected }) => {
  const node = data as unknown as MiniNodeData;

  const getStyle = () => {
    switch (node.badgeType) {
      case 'core':
        return {
          wrapper: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white border-2 border-indigo-500 shadow-md ring-2 ring-indigo-500/40',
          badgeBg: 'bg-indigo-950/90 text-indigo-100 border-indigo-400 font-black',
          titleColor: 'text-white font-extrabold',
          subtitleColor: 'text-indigo-200 font-semibold',
          scoreColor: 'text-indigo-300 font-black',
        };
      case 'top1':
        return {
          wrapper: 'bg-emerald-50/95 border-2 border-emerald-600 shadow-xs ring-1 ring-emerald-600/30 hover:border-emerald-700',
          badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black',
          titleColor: 'text-slate-950 font-extrabold tracking-tight',
          subtitleColor: 'text-slate-700 font-bold',
          scoreColor: 'text-emerald-950 font-black',
        };
      case 'top2':
        return {
          wrapper: 'bg-teal-50/95 border-2 border-teal-600 shadow-xs ring-1 ring-teal-600/30 hover:border-teal-700',
          badgeBg: 'bg-teal-100 text-teal-950 border-teal-400 font-black',
          titleColor: 'text-slate-950 font-extrabold tracking-tight',
          subtitleColor: 'text-slate-700 font-bold',
          scoreColor: 'text-teal-950 font-black',
        };
      case 'top3':
        return {
          wrapper: 'bg-blue-50/95 border-2 border-blue-600 shadow-xs ring-1 ring-blue-600/30 hover:border-blue-700',
          badgeBg: 'bg-blue-100 text-blue-950 border-blue-400 font-black',
          titleColor: 'text-slate-950 font-extrabold tracking-tight',
          subtitleColor: 'text-slate-700 font-bold',
          scoreColor: 'text-blue-950 font-black',
        };
      case 'gap':
        return {
          wrapper: 'bg-amber-50/95 border-2 border-dashed border-amber-600 shadow-sm ring-1 ring-amber-600/40 hover:border-amber-700',
          badgeBg: 'bg-amber-100 text-amber-950 border-amber-400 font-black',
          titleColor: 'text-slate-950 font-extrabold tracking-tight',
          subtitleColor: 'text-slate-700 font-bold',
          scoreColor: 'text-amber-950 font-black',
        };
      default:
        return {
          wrapper: 'bg-white border-2 border-slate-300 shadow-xs',
          badgeBg: 'bg-slate-100 text-slate-900 border-slate-300 font-black',
          titleColor: 'text-slate-950 font-bold',
          subtitleColor: 'text-slate-700 font-semibold',
          scoreColor: 'text-slate-950 font-bold',
        };
    }
  };

  const style = getStyle();

  return (
    <div 
      className={`group rounded-xl p-3.5 border transition-all duration-200 select-none text-left min-w-[220px] max-w-[270px] cursor-pointer hover:z-50 hover:shadow-xl hover:scale-[1.03] ${style.wrapper} ${
        selected ? 'ring-2 ring-blue-600 ring-offset-2 scale-[1.02] shadow-md' : ''
      }`}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-2.5 !h-2.5 !bg-slate-500 !border-2 !border-white" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-2.5 !h-2.5 !bg-indigo-600 !border-2 !border-white" 
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-2.5 !h-2.5 !bg-slate-500 !border-2 !border-white" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-2.5 !h-2.5 !bg-indigo-600 !border-2 !border-white" 
      />

      {/* Header Tag */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border font-mono font-bold ${style.badgeBg}`}>
          {node.badge}
        </span>
        {node.score !== undefined && (
          <span className={`text-xs font-mono font-bold ${style.scoreColor}`}>
            {node.score}
          </span>
        )}
      </div>

      {/* Title */}
      <div className={`text-[13px] sm:text-sm font-bold leading-snug line-clamp-2 group-hover:line-clamp-none transition-all mb-1 ${style.titleColor}`}>
        {node.title}
      </div>

      {/* Subtitle / Metric */}
      {node.subtitle && (
        <div className={`text-xs line-clamp-1 group-hover:line-clamp-none font-mono ${style.subtitleColor}`}>
          {node.subtitle}
        </div>
      )}
    </div>
  );
};

const customNodeTypes = {
  miniNode: MiniNodeComponent,
};

// ---------------------------------------------------------------------------
// Inner Graph with ReactFlow Instance
// ---------------------------------------------------------------------------

interface MiniSemanticFlowProps {
  dataset?: SEODashboardDataset;
  onNavigateToView: (viewKey: string) => void;
  onSelectCluster?: (cluster: TopicClusterItem) => void;
  onSelectContentGap?: (gap: ContentGapItem) => void;
  graph?: unknown;
  onNodeClick?: (id: string) => void;
}

const FlowCanvas: React.FC<MiniSemanticFlowProps> = ({
  dataset,
  onNavigateToView,
}) => {
  const { fitView } = useReactFlow();
  if (!dataset || !dataset.metadata) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
        Loading semantic topology...
      </div>
    );
  }

  const { metadata, topicClusters = [], contentGaps = [] } = dataset;

  if (topicClusters.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-50 dark:bg-[#0c121e] rounded-xl border border-slate-200 dark:border-slate-800">
        <Network className="w-8 h-8 mb-3 text-slate-400 dark:text-slate-600" />
        <span className="font-semibold text-sm">No semantic data available</span>
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px] text-center">
          The topic cluster dataset is empty or unverified.
        </span>
      </div>
    );
  }

  // Identify top 3 clusters by topicHealth
  const sortedClusters = useMemo(() => {
    return [...topicClusters].sort((a, b) => b.topicHealth - a.topicHealth);
  }, [topicClusters]);

  const top1 = sortedClusters[0];
  const top2 = sortedClusters[1];
  const top3 = sortedClusters[2];

  const getPageCount = (c: TopicClusterItem) => {
    return (c?.supportingPageUrls?.length || 0) + 1;
  };

  // Identify largest content gap by opportunityScore or estimated value
  const largestGap = contentGaps[0];

  const [selectedNodeData, setSelectedNodeData] = useState<{
    type: 'core' | 'cluster' | 'gap';
    cluster?: TopicClusterItem;
    gap?: ContentGapItem;
    title: string;
    description: string;
    metrics: Array<{ label: string; value: string }>;
  }>({
    type: 'cluster',
    cluster: top1 as TopicClusterItem,
    title: top1.name,
    description: `Leading topical authority cluster with ${top1.topicHealth}% health and ${top1.coverage}% coverage across ${getPageCount(top1 as TopicClusterItem)} pillar and supporting URLs.`,
    metrics: [
      { label: 'Topic Health', value: `${top1.topicHealth}%` },
      { label: 'Coverage', value: `${top1.coverage}%` },
      { label: 'Page Count', value: `${getPageCount(top1 as TopicClusterItem)} URLs` },
      { label: 'Authority', value: 'Highest' }
    ]
  });

  // Construct React Flow Nodes
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [
      // 1. Central Core Node
      {
        id: 'node-core',
        type: 'miniNode',
        position: { x: 20, y: 130 },
        data: {
          title: metadata.siteName || 'NuVira Core',
          subtitle: 'Orbital Logistics & Space Logistics',
          badge: 'Site Entity Core',
          badgeType: 'core',
          score: `${dataset.healthScores?.semantic || 0}/100`,
          nodeCategory: 'core'
        }
      }
    ];

    if (top1) {
      nodes.push({
        id: 'node-top1',
        type: 'miniNode',
        position: { x: 320, y: 15 },
        data: {
          title: top1.name,
          subtitle: `${getPageCount(top1)} Pages • ${top1.coverage}% Coverage`,
          badge: '#1 TOP CLUSTER',
          badgeType: 'top1',
          score: `${top1.topicHealth}%`,
          nodeCategory: 'top-cluster',
          clusterData: top1
        }
      });
    }

    if (top2) {
      nodes.push({
        id: 'node-top2',
        type: 'miniNode',
        position: { x: 330, y: 125 },
        data: {
          title: top2.name,
          subtitle: `${getPageCount(top2)} Pages • ${top2.coverage}% Coverage`,
          badge: '#2 TOP CLUSTER',
          badgeType: 'top2',
          score: `${top2.topicHealth}%`,
          nodeCategory: 'top-cluster',
          clusterData: top2
        }
      });
    }

    if (top3) {
      nodes.push({
        id: 'node-top3',
        type: 'miniNode',
        position: { x: 320, y: 235 },
        data: {
          title: top3.name,
          subtitle: `${getPageCount(top3)} Pages • ${top3.coverage}% Coverage`,
          badge: '#3 TOP CLUSTER',
          badgeType: 'top3',
          score: `${top3.topicHealth}%`,
          nodeCategory: 'top-cluster',
          clusterData: top3
        }
      });
    }

    if (largestGap) {
      nodes.push({
        id: 'node-gap',
        type: 'miniNode',
        position: { x: 610, y: 200 },
        data: {
          title: largestGap.expectedSubtopic || largestGap.coreTopic,
          subtitle: `Vol: ${largestGap.searchVolumeEstimate} • Opp Score: ${largestGap.opportunityScore}/100`,
          badge: '⚠️ LARGEST CONTENT GAP',
          badgeType: 'gap',
          score: `+${Math.round(largestGap.opportunityScore * 10)} Clicks`,
          nodeCategory: 'content-gap',
          gapData: largestGap
        }
      });
    }

    return nodes;
  }, [metadata, dataset.healthScores, top1, top2, top3, largestGap]);

  // Construct React Flow Edges
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    
    if (top1) {
      edges.push({
        id: 'edge-core-top1',
        source: 'node-core',
        target: 'node-top1',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981', width: 14, height: 14 },
      });
    }

    if (top2) {
      edges.push({
        id: 'edge-core-top2',
        source: 'node-core',
        target: 'node-top2',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#0d9488', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#0d9488', width: 14, height: 14 },
      });
    }

    if (top3) {
      edges.push({
        id: 'edge-core-top3',
        source: 'node-core',
        target: 'node-top3',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6', width: 14, height: 14 },
      });
    }

    if (largestGap && top3) {
      edges.push({
        id: 'edge-top3-gap',
        source: 'node-top3',
        target: 'node-gap',
        type: 'smoothstep',
        animated: true,
        label: 'Missing Subtopic',
        labelStyle: { fill: '#b45309', fontWeight: 700, fontSize: 10, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#fef3c7', stroke: '#f59e0b', strokeWidth: 1 },
        labelBgPadding: [6, 2],
        labelBgBorderRadius: 4,
        style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 14, height: 14 },
      });
    } else if (largestGap && top1) {
      edges.push({
        id: 'edge-top1-gap',
        source: 'node-top1',
        target: 'node-gap',
        type: 'smoothstep',
        animated: true,
        label: 'Missing Subtopic',
        labelStyle: { fill: '#b45309', fontWeight: 700, fontSize: 10, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#fef3c7', stroke: '#f59e0b', strokeWidth: 1 },
        labelBgPadding: [6, 2],
        labelBgBorderRadius: 4,
        style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 14, height: 14 },
      });
    } else if (largestGap) {
      edges.push({
        id: 'edge-core-gap',
        source: 'node-core',
        target: 'node-gap',
        type: 'smoothstep',
        animated: true,
        label: 'Missing Subtopic',
        labelStyle: { fill: '#b45309', fontWeight: 700, fontSize: 10, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#fef3c7', stroke: '#f59e0b', strokeWidth: 1 },
        labelBgPadding: [6, 2],
        labelBgBorderRadius: 4,
        style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 14, height: 14 },
      });
    }

    return edges;
  }, [top1, top2, top3, largestGap]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const data = node.data as unknown as MiniNodeData;
    if (node.id === 'node-core') {
      setSelectedNodeData({
        type: 'core',
        title: metadata.siteName,
        description: 'Root site knowledge entity establishing primary semantic domain authority in orbital space logistics, satellite refueling, and eco-propulsion.',
        metrics: [
          { label: 'Semantic Score', value: `${dataset.healthScores?.semantic || 78}/100` },
          { label: 'Total Clusters', value: `${topicClusters.length} Clusters` },
          { label: 'Active URLs', value: `${dataset.technical?.crawlSummary?.totalCrawled || 46} Pages` },
          { label: 'Primary Entity', value: 'NuVira Space Systems' }
        ]
      });
    } else if (data.clusterData) {
      const c = data.clusterData;
      setSelectedNodeData({
        type: 'cluster',
        cluster: c,
        title: c.name,
        description: `Verified cluster containing ${getPageCount(c)} mapped pages with ${c.topicHealth}% health index and ${c.coverage}% comprehensive keyword coverage.`,
        metrics: [
          { label: 'Topic Health', value: `${c.topicHealth}%` },
          { label: 'Coverage', value: `${c.coverage}%` },
          { label: 'Page Count', value: `${getPageCount(c)} Pages` },
          { label: 'Opportunity', value: `${c.opportunityScore || 75}/100` }
        ]
      });
    } else if (data.gapData) {
      const g = data.gapData;
      setSelectedNodeData({
        type: 'gap',
        gap: g,
        title: g.expectedSubtopic || g.coreTopic,
        description: `${g.reasonItMatters || 'High-value semantic opportunity missing from current site architecture.'} Target suggested URL: ${g.missingPageSuggestedUrl}`,
        metrics: [
          { label: 'Search Volume', value: g.searchVolumeEstimate },
          { label: 'Opportunity Score', value: `${g.opportunityScore}/100` },
          { label: 'Format', value: g.suggestedPageType },
          { label: 'Priority', value: `${g.priority} Intent` }
        ]
      });
    }
  }, [metadata, dataset, topicClusters]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      {/* Interactive React Flow Canvas */}
      <div className="lg:col-span-8 bg-slate-900/5 rounded-xl border border-slate-200 overflow-hidden relative shadow-inner" style={{ height: '340px' }}>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={customNodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.5}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          attributionPosition="bottom-left"
        >
          <Background color="#cbd5e1" gap={16} size={1} />
          <Controls 
            showInteractive={false} 
            className="!bg-white !shadow-xs !border !border-slate-200 !rounded-lg" 
          />
        </ReactFlow>

        {/* Floating Quick Legend Badge */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-300 shadow-xs flex items-center gap-3.5 text-[10px] font-mono pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-2xs shrink-0 ring-1 ring-emerald-700/30" />
            <span className="text-slate-900 font-black">Top Clusters</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs animate-pulse shrink-0 ring-1 ring-amber-600/40" />
            <span className="text-slate-900 font-black">Largest Content Gap</span>
          </div>
          <div className="text-slate-600 font-semibold hidden sm:inline">| Pan & Zoom</div>
        </div>

        {/* Reset View Button */}
        <button
          onClick={() => fitView({ padding: 0.15, duration: 400 })}
          title="Reset Graph Zoom"
          className="absolute bottom-2.5 right-2.5 bg-white dark:bg-[#141c2c] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer z-10 transition-colors"
        >
          <RotateCcw className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          <span>Reset Zoom</span>
        </button>
      </div>

      {/* Node Inspection & Action Card */}
      <div className="lg:col-span-4 bg-white dark:bg-[#141c2c] p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs text-left">
        <div>
          {/* Header Tag */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
              selectedNodeData.type === 'core' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300' :
              selectedNodeData.type === 'gap' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50' :
              'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
            }`}>
              {selectedNodeData.type === 'core' ? 'Site Knowledge Core' :
               selectedNodeData.type === 'gap' ? '⚠️ Content Opportunity Gap' :
               'Verified Topic Cluster'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Interactive Selection</span>
          </div>

          {/* Node Title */}
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug mb-1">
            {selectedNodeData.title}
          </h4>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            {selectedNodeData.description}
          </p>

          {/* Metrics Matrix */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {selectedNodeData.metrics.map((m, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-[#0c121e] border border-slate-100 dark:border-slate-800/60">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{m.label}</div>
                <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons based on selection */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          {selectedNodeData.type === 'gap' ? (
            <button
              onClick={() => onNavigateToView('content-gaps')}
              className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Explore Content Gap & Keyword Matrix</span>
            </button>
          ) : selectedNodeData.type === 'cluster' ? (
            <button
              onClick={() => onNavigateToView('clusters')}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Inspect Topic Clusters View</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateToView('semantic')}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Open Full Semantic Map</span>
            </button>
          )}

          <button
            onClick={() => onNavigateToView('semantic')}
            className="w-full py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <span>Launch Semantic Knowledge Workbench</span>
            <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const MiniSemanticFlow: React.FC<MiniSemanticFlowProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  );
};
