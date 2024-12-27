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

  dragSelectedNodes: (dx, dy) =>
    set(state => ({
      ...state,
      nodes: state.nodes.map(node =>
        node.selected ?
          { ...node, x: node.x + dx, y: node.y + dy } :
          { ...node }
      ),
    })),
  
}));

export default usePatchStore;