import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  MiniMap, 
  Panel,
  useNodesState, 
  useEdgesState, 
  MarkerType, 
  Node, 
  Edge,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Layers, 
  Crosshair, 
  RotateCcw,
  Sparkles,
  GitFork,
  CheckSquare,
  Square,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  LayoutGrid,
  Radio,
  Share2,
  TrendingDown,
  Split,
  Compass,
  ArrowRight,
  ShieldAlert,
  Info,
  SlidersHorizontal,
  History
} from 'lucide-react';
import { SemanticNodeComponent } from './SemanticNodeComponent';
import { PageDetailPanel } from './PageDetailPanel';
import { EntityDetailPanel } from './EntityDetailPanel';
import { calculateGraphLayout, GraphLayoutAlgorithm } from './layoutHelper';
import { 
  SEODashboardDataset, 
  SemanticNodeData, 
  SemanticEdgeData, 
  SemanticNodeType, 
  SemanticNodeStatus, 
  SemanticRelationKind,
  IssueItem
} from '../../types/seo-schema';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

const nodeTypes = {
  site: SemanticNodeComponent,
  entity: SemanticNodeComponent,
  topic: SemanticNodeComponent,
  cluster: SemanticNodeComponent,
  subtopic: SemanticNodeComponent,
  page: SemanticNodeComponent,
  custom: SemanticNodeComponent,
};

type ViewDepth = 'CORE' | 'CLUSTERS_TOPICS' | 'FULL';

export type GraphModeType = 
  | 'CLUSTERS' 
  | 'LINK_FLOW' 
  | 'CANNIBALIZATION' 
  | 'DECAY' 
  | 'PERFORMANCE';

interface SemanticGraphViewProps {
  dataset: SEODashboardDataset;
  focusedNodeId?: string | null;
  onSelectIssue?: (issue: IssueItem) => void;
}

const InnerSemanticGraph: React.FC<SemanticGraphViewProps> = ({
  dataset,
  focusedNodeId,
  onSelectIssue,
}) => {
  const reactFlowInstance = useReactFlow();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDepth, setViewDepth] = useState<ViewDepth>('CLUSTERS_TOPICS');
  const [graphMode, setGraphMode] = useState<GraphModeType>('CLUSTERS');
  const [layoutAlgorithm, setLayoutAlgorithm] = useState<GraphLayoutAlgorithm>('HIERARCHICAL_LR');
  const [isRecommendedMap, setIsRecommendedMap] = useState<boolean>(false);

  const [selectedTypes, setSelectedTypes] = useState<Set<SemanticNodeType>>(
    new Set(['SITE', 'ENTITY', 'TOPIC', 'CLUSTER', 'PAGE'])
  );

  const [selectedStatuses, setSelectedStatuses] = useState<Set<SemanticNodeStatus>>(
    new Set(['STRONG', 'COVERED', 'WEAK', 'MISSING', 'ORPHAN', 'OPPORTUNITY', 'OFF-TOPIC'])
  );

  const [selectedRelationKinds, setSelectedRelationKinds] = useState<Set<SemanticRelationKind>>(
    new Set(['semantic relationship', 'content relationship', 'internal-link relationship', 'canonical relationship'])
  );

  const [focusMode, setFocusMode] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<SemanticNodeData | null>(null);

  const rawGraph = dataset.semanticGraph || { 
    nodes: [], 
    edges: [], 
    topicalCenter: { available: false, centerEntity: '', dimensions: [], zones: { core: [], relevantPeriphery: [], distantOffTopic: [] } } 
  };

  // Sync types based on depth presets
  const applyViewDepth = (depth: ViewDepth) => {
    setViewDepth(depth);
    if (depth === 'CORE') {
      setSelectedTypes(new Set(['SITE', 'ENTITY', 'CLUSTER']));
    } else if (depth === 'CLUSTERS_TOPICS') {
      setSelectedTypes(new Set(['SITE', 'ENTITY', 'TOPIC', 'CLUSTER']));
    } else {
      setSelectedTypes(new Set(['SITE', 'ENTITY', 'TOPIC', 'CLUSTER', 'SUBTOPIC', 'PAGE']));
    }
  };

  // Generate nodes & edges with Before/After recommendations
  const { initialNodes, initialEdges } = useMemo(() => {
    let baseNodes = rawGraph.nodes || [];
    let baseEdges = rawGraph.edges || [];

    // If "Recommended Site Structure" mode is active (Requirement 13)
    if (isRecommendedMap) {
      // 1. Mark duplicate/cannibalized pages as consolidated
      // 2. Add synthetic missing cluster pages
      // 3. Re-route edges
      const newNodes: SemanticNodeData[] = [
        ...baseNodes.map(n => {
          if (n.id.includes('bus') && n.type === 'PAGE') {
            return {
              ...n,
              beforeAfterStatus: 'CONSOLIDATED' as const
            };
          }
          return n;
        }),
        {
          id: 'new-propulsion-cluster',
          label: 'In-Space Electric Propulsion Hub',
          type: 'CLUSTER',
          status: 'OPPORTUNITY',
          coverageScore: 92,
          findingsCount: 0,
          description: 'Recommended new cluster hub consolidating high-intent satellite propulsion queries.',
          url: 'https://nuviraspace.com/propulsion/electric-hall-thrusters',
          beforeAfterStatus: 'NEW_CLUSTER_PAGE' as const
        }
      ];

      const newEdges: SemanticEdgeData[] = [
        ...baseEdges.filter(e => !e.id.includes('cannibalized-split')),
        {
          id: 'rec-edge-propulsion',
          source: 'entity-propulsion',
          target: 'new-propulsion-cluster',
          relationKind: 'content relationship',
          confidence: 0.98
        }
      ];

      baseNodes = newNodes;
      baseEdges = newEdges;
    }

    const flowNodes: Node[] = baseNodes.map((n: SemanticNodeData) => ({
      id: n.id,
      type: n.type.toLowerCase(),
      data: {
        ...(n as unknown as Record<string, unknown>),
        graphMode,
      },
      position: { x: 0, y: 0 },
    }));

    const flowEdges: Edge[] = baseEdges.map((e: SemanticEdgeData) => {
      // Edge coloring based on relation kind and graphMode
      let strokeColor = '#94a3b8'; // neutral slate
      let isDashed = false;
      let strokeWidth = 1.5;
      let label = '';

      if (e.relationKind === 'internal-link relationship') {
        strokeColor = '#2563eb'; // blue
        strokeWidth = 2.0;
        label = 'Internal Link';
      } else if (e.relationKind === 'content relationship') {
        strokeColor = '#059669'; // emerald
        strokeWidth = 1.5;
        label = 'Topical Parent';
      } else if (e.relationKind === 'canonical relationship') {
        strokeColor = '#d97706'; // amber
        isDashed = true;
        label = 'Canonical';
      } else {
        strokeColor = '#6366f1'; // indigo
        label = 'Semantic';
      }

      if (graphMode === 'CANNIBALIZATION' && (e.id.includes('bus') || e.source.includes('bus'))) {
        strokeColor = '#e11d48'; // red
        strokeWidth = 2.5;
        isDashed = true;
        label = 'Cannibalization Conflict';
      }

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: e.relationKind === 'internal-link relationship' || graphMode === 'LINK_FLOW',
        style: {
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray: isDashed ? '5 5' : undefined,
          opacity: 0.85,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 14,
          height: 14,
        },
        data: {
          ...(e as unknown as Record<string, unknown>),
          edgeLabel: label
        },
      };
    });

    return {
      initialNodes: flowNodes,
      initialEdges: flowEdges,
    };
  }, [rawGraph, isRecommendedMap, graphMode]);

  // Apply layout
  const layouted = useMemo(() => {
    return calculateGraphLayout(initialNodes, initialEdges, layoutAlgorithm);
  }, [initialNodes, initialEdges, layoutAlgorithm]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layouted.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layouted.edges);

  // Sync state on updates
  useEffect(() => {
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.15 });
    }, 60);
  }, [layouted, setNodes, setEdges, reactFlowInstance]);

  // Focus node externally
  useEffect(() => {
    if (focusedNodeId) {
      const target = rawGraph.nodes.find(n => n.id === focusedNodeId || n.url === focusedNodeId);
      if (target) {
        setSelectedNodeData(target);
        reactFlowInstance.setCenter(0, 0, { zoom: 1.0, duration: 400 });
      }
    }
  }, [focusedNodeId, rawGraph.nodes, reactFlowInstance]);

  // Visual filter and Dimming
  const filteredNodes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    let connectedNodeIds: Set<string> | null = null;
    if (focusMode && selectedNodeData) {
      connectedNodeIds = new Set<string>([selectedNodeData.id]);
      rawGraph.edges.forEach(e => {
        if (e.source === selectedNodeData.id) connectedNodeIds?.add(e.target);
        if (e.target === selectedNodeData.id) connectedNodeIds?.add(e.source);
      });
    }

    return nodes.map(node => {
      const data = node.data as unknown as SemanticNodeData;
      const matchesType = selectedTypes.has(data.type);
      const matchesStatus = selectedStatuses.has(data.status);
      const matchesSearch = !query || 
        data.label.toLowerCase().includes(query) || 
        (data.url && data.url.toLowerCase().includes(query));

      const isConnected = !connectedNodeIds || connectedNodeIds.has(node.id);
      const isVisible = matchesType && matchesStatus && matchesSearch;
      const isDimmed = !isConnected || (!matchesSearch && query.length > 0);

      return {
        ...node,
        hidden: !isVisible,
        data: {
          ...data,
          graphMode,
          isDimmed
        },
        style: {
          ...node.style,
          opacity: isDimmed ? 0.2 : 1,
          transition: 'opacity 0.2s ease',
        },
      };
    });
  }, [nodes, searchQuery, selectedTypes, selectedStatuses, focusMode, selectedNodeData, rawGraph.edges, graphMode]);

  const filteredEdges = useMemo(() => {
    return edges.map(edge => {
      const edgeData = edge.data as unknown as SemanticEdgeData;
      const matchesKind = !edgeData || selectedRelationKinds.has(edgeData.relationKind);

      let isConnected = true;
      if (focusMode && selectedNodeData) {
        isConnected = edge.source === selectedNodeData.id || edge.target === selectedNodeData.id;
      }

      return {
        ...edge,
        hidden: !matchesKind,
        style: {
          ...edge.style,
          opacity: isConnected ? 0.85 : 0.15,
        },
      };
    });
  }, [edges, selectedRelationKinds, focusMode, selectedNodeData]);

  // Click node handler
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const nodeData = node.data as unknown as SemanticNodeData;
    setSelectedNodeData(nodeData);
  }, []);

  // Fit screen handler
  const handleFitScreen = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.15, duration: 400 });
  }, [reactFlowInstance]);

  // Re-layout trigger
  const handleAutoLayout = useCallback(() => {
    const res = calculateGraphLayout(nodes, edges, layoutAlgorithm);
    setNodes(res.nodes);
    setEdges(res.edges);
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.15, duration: 400 });
    }, 50);
  }, [nodes, edges, layoutAlgorithm, setNodes, setEdges, reactFlowInstance]);

  // Reset view
  const handleResetView = useCallback(() => {
    setSearchQuery('');
    setFocusMode(false);
    setSelectedNodeData(null);
    setIsRecommendedMap(false);
    setGraphMode('CLUSTERS');
    setLayoutAlgorithm('HIERARCHICAL_LR');
    applyViewDepth('CLUSTERS_TOPICS');
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.15, duration: 400 });
    }, 80);
  }, [reactFlowInstance]);

  return (
    <div className="w-full h-[calc(100vh-140px)] min-h-[680px] flex flex-col neu-card rounded-2xl overflow-hidden text-left">
      
      {/* Top Controls Toolbar */}
      <div className="p-3 neu-inset border-b border-[#d4dce7] flex flex-wrap items-center justify-between gap-3 z-20">
        
        {/* Left: Search & Mode Selector */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search bar */}
          <div className="relative w-52 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search topic, entity, or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs neu-inset rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 placeholder:text-slate-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Requirement 8: Graph Modes Selector */}
          <div className="flex items-center gap-1 neu-well p-1 rounded-xl border border-slate-300/80 text-xs">
            <span className="text-[10px] font-bold text-slate-600 uppercase px-2 flex items-center gap-1 font-mono">
              <SlidersHorizontal className="w-3 h-3 text-blue-600" />
              Mode:
            </span>
            <button
              onClick={() => setGraphMode('CLUSTERS')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                graphMode === 'CLUSTERS' ? 'neu-inset-active text-blue-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Semantic Clusters (Topical grouping)"
            >
              Topical Clusters
            </button>
            <button
              onClick={() => setGraphMode('LINK_FLOW')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                graphMode === 'LINK_FLOW' ? 'neu-inset-active text-indigo-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Internal Link Flow (PageRank / Link equity)"
            >
              Link Flow (PR)
            </button>
            <button
              onClick={() => setGraphMode('CANNIBALIZATION')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                graphMode === 'CANNIBALIZATION' ? 'neu-inset-active text-rose-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Cannibalization Overlay (Competing nodes flagged in red/amber)"
            >
              Cannibalization
            </button>
            <button
              onClick={() => setGraphMode('DECAY')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                graphMode === 'DECAY' ? 'neu-inset-active text-amber-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Content Decay (Freshness / traffic risk)"
            >
              Content Decay
            </button>
            <button
              onClick={() => setGraphMode('PERFORMANCE')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                graphMode === 'PERFORMANCE' ? 'neu-inset-active text-emerald-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Search Performance (Nodes sized by GSC clicks/impressions)"
            >
              GSC Traffic
            </button>
          </div>
        </div>

        {/* Right: Layout Switcher & Before/After Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Requirement 13: Before / After Semantic Map Toggle */}
          <button
            onClick={() => setIsRecommendedMap(!isRecommendedMap)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isRecommendedMap
                ? 'neu-btn-primary'
                : 'neu-btn text-slate-700 hover:text-slate-950'
            }`}
            title="Toggle between Current Site Structure and Recommended Site Architecture"
          >
            <History className="w-3.5 h-3.5" />
            <span>{isRecommendedMap ? 'Recommended Architecture (Active)' : 'Compare: Recommended Map'}</span>
          </button>

          {/* Requirement 7: Layout Algorithm Selector */}
          <div className="flex items-center gap-1 neu-well p-1 rounded-xl border border-slate-300/80 text-xs">
            <span className="text-[10px] font-bold text-slate-600 uppercase px-1.5 font-mono">Layout:</span>
            <select
              value={layoutAlgorithm}
              onChange={(e) => setLayoutAlgorithm(e.target.value as GraphLayoutAlgorithm)}
              className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer pr-1"
            >
              <option value="HIERARCHICAL_LR">Hierarchical (LR)</option>
              <option value="HIERARCHICAL_TB">Hierarchical (TB)</option>
              <option value="RADIAL_HUB_SPOKE">Radial Hub & Spoke</option>
              <option value="ENTITY_FIRST">Entity-First</option>
              <option value="URL_ARCHITECTURE">URL Architecture</option>
              <option value="ORGANIC">Organic</option>
            </select>
          </div>

          {/* Focus Mode */}
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              focusMode
                ? 'neu-inset-active text-indigo-900 font-bold'
                : 'neu-btn text-slate-700 hover:text-slate-950'
            }`}
            title={selectedNodeData ? "Focus on selected node" : "Select node to isolate paths"}
          >
            <Crosshair className={`w-3.5 h-3.5 ${focusMode ? 'text-indigo-700' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Focus</span>
          </button>

          {/* Auto Layout */}
          <button
            onClick={handleAutoLayout}
            className="neu-btn px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1 transition-all cursor-pointer"
            title="Re-run layout calculation"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">Re-layout</span>
          </button>

          {/* Fit Screen */}
          <button
            onClick={handleFitScreen}
            className="neu-btn p-2 rounded-xl text-slate-700 hover:text-slate-950 transition-all cursor-pointer"
            title="Fit graph to view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Reset */}
          <button
            onClick={handleResetView}
            className="neu-btn p-2 rounded-xl text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
            title="Reset view and filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recommended Site Structure Notification Banner (when active) */}
      {isRecommendedMap && (
        <div className="bg-emerald-100/90 border-b border-emerald-300 px-4 py-2 text-xs text-emerald-950 flex items-center justify-between font-medium shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Recommended Site Architecture View:</strong> Demonstrates target state after consolidating cannibalized duplicate pages, creating the In-Space Propulsion cluster, and re-routing PageRank equity.
            </span>
          </div>
          <button
            onClick={() => setIsRecommendedMap(false)}
            className="text-[11px] font-bold text-emerald-900 hover:underline shrink-0 font-mono"
          >
            Return to Current Crawl
          </button>
        </div>
      )}

      {/* Main Flow Canvas */}
      <div className="flex-1 relative w-full h-full bg-[#e8edf4] dark:bg-[#0c121e]">
        <ReactFlow
          nodes={filteredNodes}
          edges={filteredEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={() => setSelectedNodeData(null)}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ type: 'smoothstep' }}
        >
          <Background color="#94a3b8" gap={24} size={1.2} />
          
          <Controls className="!bg-white dark:!bg-[#141c2c] !border !border-slate-300 dark:!border-slate-700 !shadow-md !rounded-xl !text-slate-800 dark:!text-slate-200" />
          
          <MiniMap 
            className="!bg-white dark:!bg-[#141c2c] !border !border-slate-300 dark:!border-slate-700 !shadow-md !rounded-xl"
            nodeColor={(n) => {
              if (n.type === 'site') return '#2563eb';
              if (n.type === 'entity') return '#4f46e5';
              if (n.type === 'topic') return '#64748b';
              if (n.type === 'cluster') return '#0891b2';
              if (n.type === 'page') return '#059669';
              return '#94a3b8';
            }}
          />

          {/* Requirement 9: Explicit Graph Legend */}
          <Panel position="bottom-left" className="neu-card-sm p-4 rounded-xl border border-slate-300/80 text-[11px] space-y-2.5 z-10 text-slate-800 max-w-sm">
            <div>
              <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px] mb-1.5 flex items-center justify-between font-mono">
                <span>Semantic Graph Legend</span>
                <span className="text-[9.5px] font-normal text-slate-500">Audited Topology</span>
              </div>
              
              {/* Node Types (Requirement 9) */}
              <div className="space-y-1">
                <span className="text-[9.5px] font-bold uppercase text-slate-500 block font-mono">Node Types:</span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10.5px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-blue-600 shrink-0 shadow-2xs" />
                    <span>Central Entity</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-700 shrink-0" />
                    <span>Pillar Page / Topic</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-600 shrink-0" />
                    <span>Supporting Content</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded border border-rose-500 bg-rose-100 shrink-0" />
                    <span>Content Gap (Missing)</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:col-span-2">
                    <span className="w-2.5 h-2.5 rounded border border-red-500 bg-red-100 shrink-0" />
                    <span>Orphan Page (0 Inbound Links)</span>
                  </div>
                </div>
              </div>

              {/* Edge Types (Requirement 9) */}
              <div className="pt-2 border-t border-slate-200 space-y-1">
                <span className="text-[9.5px] font-bold uppercase text-slate-400 block">Edge Types:</span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10.5px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-emerald-600 inline-block" />
                    <span>Primary Topical Parent</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-blue-600 inline-block" />
                    <span>Supporting Cross-Link</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 border-t border-dashed border-rose-600 inline-block" />
                    <span>Cannibalization Conflict</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 border-t border-dotted border-amber-500 inline-block" />
                    <span>Missing Internal Link</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </ReactFlow>

        {/* Page Detail Drawer (Requirement 10) */}
        {selectedNodeData && selectedNodeData.type === 'PAGE' && (
          <PageDetailPanel
            node={selectedNodeData}
            onClose={() => setSelectedNodeData(null)}
            dataset={dataset}
            allIssues={dataset.issues}
            allEvidence={dataset.evidence}
            onSelectIssue={onSelectIssue}
          />
        )}

        {/* Entity / Topic Detail Panel */}
        {selectedNodeData && selectedNodeData.type !== 'PAGE' && (
          <EntityDetailPanel
            node={selectedNodeData}
            onClose={() => setSelectedNodeData(null)}
            dataset={dataset}
            onSelectNodeById={(id) => {
              const target = rawGraph.nodes.find(n => n.id === id);
              if (target) setSelectedNodeData(target);
            }}
          />
        )}
      </div>
    </div>
  );
};

export const SemanticGraphView: React.FC<SemanticGraphViewProps> = (props) => {
  return (
    <ReactFlowProvider>
      <InnerSemanticGraph {...props} />
    </ReactFlowProvider>
  );
};
