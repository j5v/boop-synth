import { create } from 'zustand'
import { synthNodeTypes, defaultPatchNodes, defaultOutputSpec } from '../lib/synth.js'

const usePatchStore = create((set) => ({
  nodes: defaultPatchNodes, // non-clone is OK here
  perf: {...defaultOutputSpec},
  
  addNode: () =>
    set((state) => ({
      ...state,
      nodes: [
        ...state.nodes,
        synthNodeCreator.newObject({
          nodeTypeId: synthNodeTypes.GEN_FM.id,
          x: 20
        })
      ],
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      ...state,
      nodes: state.nodes.filter((node) => node.id !== nodeId),
    })),

  selectNode: (nodeId) =>
    set(state => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === nodeId ?
          { ...node, selected: true } :
          { ...node }
      ),
    })),

  selectExclusiveNode: (nodeId) =>
    // Select node, and unselect other nodes.
    set(state => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === nodeId ?
          { ...node, selected: true } :
          { ...node, selected: false }
      ),
    })),
  
    // Update node properties with an object
  updateNode: (nodeId, obj) =>
    set(state => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...obj } : node
      ),
    })),

  // Drag node

  startDragSelectedNodes: () =>
    set(state => ({
      ...state,
      dragging: true,
      nodes: state.nodes.map(node =>
        node.selected ?
          { ...node, dragging: true } :
          { ...node }
      ),
    })),

  dragSelectedNodes: (dx, dy) =>
    set(state => ({
      ...state,
      nodes: state.nodes.map(node =>
        node.selected && state.dragging ?
          { ...node, x: node.x + dx, y: node.y + dy } :
          { ...node }
      ),
    })),
  
  endDragSelectedNodes: () =>
    set(state => ({
      ...state,
      dragging: false,
      nodes: state.nodes.map(node => (
        { ...node, dragging: false }
      )),
    })),

}));

export default usePatchStore;