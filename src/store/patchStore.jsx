import { create } from 'zustand'
import { synthNodeTypes, newSynthNode } from '../lib/synth.js'

const usePatchStore = create((set) => ({
  nodes: [ 
    newSynthNode.newObject({
      outputs: [ ...synthNodeTypes.GEN_FM.outputs ],
    }),
    newSynthNode.newObject({
      nodeTypeId: synthNodeTypes.OUTPUT.id,
      x: 18,
      y: 3,
      inputs: [ ...synthNodeTypes.OUTPUT.inputs ]
    }),
   ],

  addNode: () =>
    set((state) => ({
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
      nodes: state.nodes.filter((node) => node.id !== nodeId),
    })),

  selectExclusiveNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ?
          { ...node, selected: true } :
          { ...node, selected: false }
      ),
    })),

  // Update node properties with an object
  updateNode: (nodeId, obj) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...obj } : node
      ),
    })),


}));

export default usePatchStore;