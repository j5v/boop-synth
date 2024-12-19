import { create } from 'zustand'
import { synthNodeTypes, synthNodeCreator } from '../lib/synth.js'

const usePatchStore = create((set) => ({
  nodes: [ 
    synthNodeCreator.newObject({
      nodeTypeId: synthNodeTypes.MOCK.id,
    }),
    synthNodeCreator.newObject({
      nodeTypeId: synthNodeTypes.GEN_FM.id,
      x: 20
    }),
   ],

  // Add a new node
  addNode: (node) =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        synthNodeCreator.newObject({
          nodeTypeId: synthNodeTypes.GEN_FM.id,
          x: 20
        })
      ],
    })),

  // Remove a node by ID
  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
    })),

  // Toggle a node's completion status
  toggleNode: (id) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, completed: !node.completed } : node
      ),
    })),
}));

export default usePatchStore;