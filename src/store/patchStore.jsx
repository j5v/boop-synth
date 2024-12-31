import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  defaultPatchNodes,
  defaultOutputSpec,
  newSynthNode,
  assignLink,
} from "../lib/synth.js";

import { swapItemsInArray, cleanNodeLinks } from "../lib/utils.js";


const usePatchStore = create(
  persist(
    (set, get) => ({
      nodes: defaultPatchNodes(),
      perf: { ...defaultOutputSpec },
      ui: {
        draggingLinkFromInput: undefined,
        draggingLinkFromOutput: undefined,
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

      setLinkDragFromOutput: (spec) => set((state) => {
        // New
        // console.log('usePatchStore: setLinkDragFromOutput()', spec);

        const newDraggingLinkFromOutput = structuredClone(state.ui.draggingLinkFromOutput);

        return {
          ...state,
          ui: {
            ...structuredClone(state.ui),
            draggingLinkFromOutput: {
              ...newDraggingLinkFromOutput,
              ...spec
            },
          }
        };
      }),

      endDragLinkFromOutput: () => set((state) => {
        // New
        return {
          ...state,
          ui: {
            ...structuredClone(state.ui),
            draggingLinkFromOutput: {},
          }
        };
      }),

      setNewLinkFromInput: (spec) => set((state) => {
        const { fromInput, fromNode } = state.ui.draggingLinkFromInput;

        if (fromNode && fromInput) {
          const newNodes = assignLink(state.nodes, {
            inputNodeId: fromNode.id,
            inputId: fromInput.id,
            targetNodeId: spec.targetNode.id,
            targetOutputId: spec.targetOutput.id,
          });

          return {
            ...state,
            nodes: newNodes,
          }
        } else {
          // failed; do not modify
          return { ...state }
        }
      }),
          
      setNewLinkFromOutput: (spec) => set((state) => {
        // New
        const { fromOutput, fromNode } = state.ui.draggingLinkFromOutput;

        const newNodes = assignLink(state.nodes, {
          inputNodeId: spec.targetNode.id,
          inputId: spec.targetInput.id,
          targetNodeId: fromNode.id,
          targetOutputId: fromOutput.id,
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

      reset: () => set((state) => ({
        ...state,
        nodes: defaultPatchNodes(),
        perf: { ...defaultOutputSpec },
        ui: {
          draggingLinkFromInput: undefined,
        },
      })),

      removeSelectedNodes: () => set((state) => {
        const nodesWithSelectedDeleted = state.nodes.filter((node) => !node.selected);
        const cleanedNodes = cleanNodeLinks(nodesWithSelectedDeleted);

        return {
          ...state,
          nodes: cleanedNodes,
        }
      }),

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

    })
  
  ),
  {
    name: 'fmc2', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  }
);

export default usePatchStore;
