import { create } from "zustand";
import {
  synthNodeTypes,
  defaultPatchNodes,
  defaultOutputSpec,
  newSynthNode,
  getNodeTypeById,
} from "../lib/synth.js";
import { swapItemsInArray } from "../lib/utils.js";


const usePatchStore = create((set) => ({
  nodes: defaultPatchNodes, // non-clone is OK here
  perf: { ...defaultOutputSpec },
  ui: {
    draggingNewConnectorFrom: undefined
  },

  addNode: (synthNodeTypeId) =>
    set((state) => {
      const nodeType = getNodeTypeById(synthNodeTypeId);
      const node = nodeType ?
        newSynthNode.newObject({
          nodeTypeId: synthNodeTypeId,
          inputs: [...structuredClone(nodeType.inputs || [])],
          outputs: [...structuredClone(nodeType.outputs || [])],
          x: 20,
        }) : 
        newSynthNode.newObject({
          nodeTypeId: synthNodeTypes.GEN_FM.id,
          inputs: [...structuredClone(nodeType.inputs || [])],
          outputs: [...structuredClone(nodeType.outputs || [])],
          x: 20,
        });

      return {
        ...state,
        nodes: [
          ...state.nodes,
          node,
        ],
      }
    }),
  
  removeNode: (nodeId) =>
    set((state) => ({
      ...state,
      nodes: state.nodes.filter((node) => node.id !== nodeId),
    })),

  removeSelectedNodes: () =>
    set((state) => ({
      ...state,
      nodes: state.nodes.filter((node) => !node.selected),
    })),

  selectNode: (nodeId) =>
    set((state) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, selected: true } : { ...node }
      ),
    })),

  selectExclusiveNode: (nodeId) =>
    // Select node, and unselect other nodes.
    set((state) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, selected: true }
          : { ...node, selected: false }
      ),
    })),

  highlightExclusiveNode: (nodeId) =>
    // Select node, and unselect other nodes.
    set((state) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, highlighted: true }
          : { ...node, highlighted: false }
      ),
    })),

  // Update node properties with an object
  updateNode: (nodeId, obj) =>
    set((state) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...obj } : node
      ),
    })),

  swapNodes: (index1, index2) =>
    set((state) => {
      const nodesWithSwappedItems = swapItemsInArray(
        state.nodes,
        index1,
        index2
      );

      return {
        ...state,
        nodes: nodesWithSwappedItems,
      };
    }),

  // Drag node

  dragSelectedNodes: (dx, dy) =>
    set((state) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.selected
          ? { ...node, x: node.x + dx, y: node.y + dy }
          : { ...node }
      ),
    })),
}));

export default usePatchStore;
