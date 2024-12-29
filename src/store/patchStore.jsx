import { create } from "zustand";
import {
  synthNodeTypes,
  defaultPatchNodes,
  defaultOutputSpec,
  newSynthNode,
} from "../lib/synth.js";
import { swapItemsInArray } from "../lib/utils.js";

const usePatchStore = create((set) => ({
  nodes: defaultPatchNodes, // non-clone is OK here
  perf: { ...defaultOutputSpec },

  addNode: () =>
    set((state) => ({
      ...state,
      nodes: [
        ...state.nodes,
        newSynthNode.newObject({
          nodeTypeId: synthNodeTypes.GEN_FM.id,
          x: 20,
        }),
      ],
    })),

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
