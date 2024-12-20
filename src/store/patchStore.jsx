import { create } from 'zustand'
import { synthNodeTypes, newSynthNode } from '../lib/synth.js'

const usePatchStore = create((set) => ({
  nodes: [ 
    newSynthNode.newObject({}),
    newSynthNode.newObject({
      nodeTypeId: synthNodeTypes.GEN_FM.id,
      x: 17, y: 2
    }),
   ],

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

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
    })),

  selectExclusiveNode: (id) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ?
          { ...node, selected: true } :
          { ...node, selected: false }
      ),
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