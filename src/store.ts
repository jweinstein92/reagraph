import create, { StoreApi } from 'zustand';
import createContext from 'zustand/context';
import {
  InternalGraphEdge,
  InternalGraphNode,
  InternalGraphPosition
} from './types';
import ngraph, { Graph } from 'ngraph.graph';
import { BufferGeometry, Mesh } from 'three';

export type DragReferences = { [key: string]: InternalGraphNode };

export interface GraphState {
  nodes: InternalGraphNode[];
  edges: InternalGraphEdge[];
  graph: Graph;
  collapsedNodeIds?: string[];
  actives?: string[];
  selections?: string[];
  edgeContextMenus?: Set<string>;
  setEdgeContextMenus: (edges: Set<string>) => void;
  edgeMeshes: Array<Mesh<BufferGeometry>>;
  setEdgeMeshes: (edgeMeshes: Array<Mesh<BufferGeometry>>) => void;
  draggingId?: string | null;
  drags?: DragReferences;
  panning?: boolean;
  setPanning: (panning: boolean) => void;
  setDrags: (drags: DragReferences) => void;
  setDraggingId: (id: string | null) => void;
  setActives: (actives: string[]) => void;
  setSelections: (selections: string[]) => void;
  setNodes: (nodes: InternalGraphNode[]) => void;
  setEdges: (edges: InternalGraphEdge[]) => void;
  setNodePosition: (id: string, position: InternalGraphPosition) => void;
  setCollapsedNodeIds: (nodeIds: string[]) => void;
}

export const { Provider, useStore } = createContext<StoreApi<GraphState>>();

export const createStore = ({
  actives = [],
  selections = [],
  collapsedNodeIds = []
}: Partial<GraphState>) =>
  create<GraphState>(set => ({
    edges: [],
    nodes: [],
    collapsedNodeIds,
    panning: false,
    draggingId: null,
    actives,
    edgeContextMenus: new Set(),
    setEdgeContextMenus: edgeContextMenus =>
      set(state => ({
        ...state,
        edgeContextMenus
      })),
    edgeMeshes: [],
    setEdgeMeshes: edgeMeshes => set(state => ({ ...state, edgeMeshes })),
    selections,
    drags: {},
    graph: ngraph(),
    setPanning: panning => set(state => ({ ...state, panning })),
    setDrags: drags => set(state => ({ ...state, drags })),
    setDraggingId: draggingId => set(state => ({ ...state, draggingId })),
    setActives: actives => set(state => ({ ...state, actives })),
    setSelections: selections => set(state => ({ ...state, selections })),
    setNodes: nodes => set(state => ({ ...state, nodes })),
    setEdges: edges => set(state => ({ ...state, edges })),
    setNodePosition: (id, position) =>
      set(state => {
        const node = state.nodes.find(n => n.id === id);
        const nodeIndex = state.nodes.indexOf(node);
        const nodes = [...state.nodes];
        nodes[nodeIndex] = { ...node, position };
        return {
          ...state,
          drags: { ...state.drags, [id]: node },
          nodes
        };
      }),
    setCollapsedNodeIds: (nodeIds = []) =>
      set(state => ({ ...state, collapsedNodeIds: nodeIds }))
  }));
