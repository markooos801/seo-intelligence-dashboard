import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';

export type GraphLayoutAlgorithm = 
  | 'HIERARCHICAL_TB' 
  | 'HIERARCHICAL_LR' 
  | 'RADIAL_HUB_SPOKE' 
  | 'ENTITY_FIRST' 
  | 'URL_ARCHITECTURE'
  | 'ORGANIC';

export function calculateGraphLayout(
  nodes: Node[],
  edges: Edge[],
  algorithm: GraphLayoutAlgorithm = 'HIERARCHICAL_LR'
): { nodes: Node[]; edges: Edge[] } {
  if (algorithm === 'HIERARCHICAL_LR' || algorithm === 'HIERARCHICAL_TB') {
    return getDagreLayout(nodes, edges, algorithm === 'HIERARCHICAL_TB' ? 'TB' : 'LR');
  }

  if (algorithm === 'RADIAL_HUB_SPOKE') {
    return getRadialHubSpokeLayout(nodes, edges);
  }

  if (algorithm === 'ENTITY_FIRST') {
    return getEntityFirstLayout(nodes, edges);
  }

  if (algorithm === 'URL_ARCHITECTURE') {
    return getUrlArchitectureLayout(nodes, edges);
  }

  // Fallback / Organic:
  return getOrganicLayout(nodes, edges);
}

export function getDagreLayout(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'LR'
) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: 75,
    ranksep: 120,
    marginx: 50,
    marginy: 50
  });

  nodes.forEach((node) => {
    const width = node.type === 'site' ? 340 : node.type === 'page' ? 300 : node.type === 'cluster' ? 290 : 270;
    const height = node.type === 'site' ? 140 : node.type === 'page' ? 145 : 135;
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width = node.type === 'site' ? 340 : node.type === 'page' ? 300 : node.type === 'cluster' ? 290 : 270;
    const height = node.type === 'site' ? 140 : node.type === 'page' ? 145 : 135;

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: (nodeWithPosition?.x ?? 0) - width / 2,
        y: (nodeWithPosition?.y ?? 0) - height / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
}

// Radial Concentric Hub & Spoke Layout around central entity
function getRadialHubSpokeLayout(nodes: Node[], edges: Edge[]) {
  const centerNode = nodes.find(n => n.type === 'site' || n.type === 'entity') || nodes[0];
  const otherNodes = nodes.filter(n => n.id !== centerNode?.id);

  // Group into tiers: Tier 1 (Entity/Topic), Tier 2 (Cluster), Tier 3 (Subtopic/Page)
  const tier1 = otherNodes.filter(n => n.type === 'entity' || n.type === 'topic');
  const tier2 = otherNodes.filter(n => n.type === 'cluster');
  const tier3 = otherNodes.filter(n => n.type === 'subtopic' || n.type === 'page');

  const newNodes: Node[] = [];

  // Center node at 0, 0
  if (centerNode) {
    newNodes.push({
      ...centerNode,
      position: { x: 400, y: 350 },
    });
  }

  // Place Tier 1 at radius 300
  tier1.forEach((node, idx) => {
    const angle = (idx / Math.max(tier1.length, 1)) * 2 * Math.PI;
    newNodes.push({
      ...node,
      position: {
        x: 400 + 320 * Math.cos(angle),
        y: 350 + 260 * Math.sin(angle),
      },
    });
  });

  // Place Tier 2 at radius 600
  tier2.forEach((node, idx) => {
    const angle = (idx / Math.max(tier2.length, 1)) * 2 * Math.PI;
    newNodes.push({
      ...node,
      position: {
        x: 400 + 640 * Math.cos(angle),
        y: 350 + 520 * Math.sin(angle),
      },
    });
  });

  // Place Tier 3 at radius 950
  tier3.forEach((node, idx) => {
    const angle = (idx / Math.max(tier3.length, 1)) * 2 * Math.PI;
    newNodes.push({
      ...node,
      position: {
        x: 400 + 980 * Math.cos(angle),
        y: 350 + 800 * Math.sin(angle),
      },
    });
  });

  return { nodes: newNodes, edges };
}

// Entity-First Layout: columns for entities, clusters, and supporting nodes
function getEntityFirstLayout(nodes: Node[], edges: Edge[]) {
  const dagreResult = getDagreLayout(nodes, edges, 'TB');
  return dagreResult;
}

// URL Directory Architecture Layout
function getUrlArchitectureLayout(nodes: Node[], edges: Edge[]) {
  // Sort by URL directory depth
  const sorted = [...nodes].sort((a, b) => {
    const urlA = (a.data as any)?.url || '';
    const urlB = (b.data as any)?.url || '';
    return urlA.localeCompare(urlB);
  });

  let currentY = 50;
  const newNodes = sorted.map((node, idx) => {
    const depth = ((node.data as any)?.url || '').split('/').filter(Boolean).length;
    const x = depth * 320 + 50;
    const y = currentY;
    currentY += 160;

    return {
      ...node,
      position: { x, y },
    };
  });

  return { nodes: newNodes, edges };
}

// Organic scatter
function getOrganicLayout(nodes: Node[], edges: Edge[]) {
  return getDagreLayout(nodes, edges, 'LR');
}
