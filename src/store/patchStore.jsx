import { create } from 'zustand'
import { synthNodeTypes } from '../lib/synth.js'

const usePatchStore = create((set) => ({
  nodes: [ 
    {
      id: 1,
      x: 2,
      y: 1,
      w: 10,
      h: 7,
      nodeTypeId: synthNodeTypes.MOCK.id,
      displayName: 'Node A'
    },
    {
      id: 2,
      x: 16,
      y: 4,
      w: 10,
      h: 7,
      nodeTypeId: synthNodeTypes.GEN_FM.id,
      displayName: 'Node B'
    }    

   ],

  // Add a new node
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, { id: Date.now(), text: node, completed: false }],
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