import { create } from "zustand";
import {
  synthNodeTypes,
  defaultPatchNodes,
  defaultOutputSpec,
  newSynthNode,
  getNodeTypeById,
  assignLink,
} from "../lib/synth.js";
import { swapItemsInArray } from "../lib/utils.js";

const usePatchStore = create((set) => ({
  nodes: defaultPatchNodes(),
  perf: { ...defaultOutputSpec },
  ui: {
    draggingLinkFromInput: undefined,
  },

  setLinkDragFromInput: (spec) => set((state) => {
    // console.log('usePatchStore: setLinkDragFromInput()', spec);

    const newDraggingLinkFromInput = structuredClone(state.ui.draggingLinkFromInput);

    return {
      ...state,
      ui: {
        ...structuredClone(state.ui),
        draggingLinkFromInput: {
          ...newDraggingLinkFromInput,
          ...spec
        },
      }
    };
  }),

  endDragLinkFromInput: () => set((state) => {
    return {
      ...state,
      ui: {
        ...structuredClone(state.ui),
        draggingLinkFromInput: {},
      }
    };
  }),

  setNewLink: (spec) => set((state) => {
    const { fromInput, fromNode } = state.ui.draggingLinkFromInput;

    const newNodes = assignLink(state.nodes, {
      inputNodeId: fromNode.id,
      inputId: fromInput.id,
      targetNodeId: spec.targetNode.id,
      targetOutputId: spec.targetOutput.id,
    });

    return {
      ...state,
      nodes: newNodes,
    };
  }),
      
  

  addNode: (synthNodeTypeId) => set((state) => {
    const node = newSynthNode(state.nodes, synthNodeTypeId, { x: 16, y: 3 });

    return {
      ...state,
      nodes: [
        node, // insert at start of list, before the output node.
        ...structuredClone(state.nodes),
      ],
    }
  }),
  
  removeNode: (nodeId) => set((state) => ({
    ...state,
    nodes: state.nodes.filter((node) => node.id !== nodeId),
  })),

  removeSelectedNodes: () => set((state) => ({
    ...state,
    nodes: state.nodes.filter((node) => !node.selected),
  })),

  selectNode: (nodeId) => set((state) => ({
    ...state,
    nodes: state.nodes.map((node) =>
      node.id === nodeId ? { ...node, selected: true } : { ...node }
    ),
  })),

  selectExclusiveNode: (nodeId) => set((state) => ({
    // Select node, and unselect other nodes.
    ...state,
    nodes: state.nodes.map((node) =>
      node.id === nodeId
        ? { ...node, selected: true }
        : { ...node, selected: false }
    ),
  })),

  highlightExclusiveNode: (nodeId) => set((state) => ({
    // Select node, and unselect other nodes.
    ...state,
    nodes: state.nodes.map((node) =>
      node.id === nodeId
        ? { ...node, highlighted: true }
        : { ...node, highlighted: false }
    ),
  })),

  // Update node properties with an object
  updateNode: (nodeId, obj) => set((state) => ({
    ...state,
    nodes: state.nodes.map((node) =>
      node.id === nodeId ? { ...node, ...obj } : node
    ),
  })),

  swapNodes: (index1, index2) => set((state) => {
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

  dragSelectedNodes: (dx, dy) => set((state) => ({
    ...state,
    nodes: state.nodes.map((node) =>
      node.selected
        ? { ...node, x: node.x + dx, y: node.y + dy }
        : { ...node }
    ),
  })),

}));

export default usePatchStore;
