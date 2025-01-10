import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  defaultPatchNodes,
  defaultOutputSpec,
  newSynthNode,
  assignLink,
  synthNodeTerminalIntents,
} from "../lib/synth.js";

import { swapItemsInArray, cleanNodeLinks, remAsPx, pxAsRem } from "../lib/utils.js";

const defaultView = {
  scale: 1,
  panX: 0, // screen coords (logical pixels)
  panY: 0 // screen coords (logical pixels)
};

const usePatchStore = create(
  persist(
    (set, get) => ({
      nodes: defaultPatchNodes(),
      perf: {
        ...defaultOutputSpec
      },
      prefs: {
        hideNodeDescription: false, // in instpector panel
      },
      ui: {
        draggingLinkFromInput: undefined,
        draggingLinkFromOutput: undefined,
        view: defaultView
      },

      // UI Prefs
      toggleHideNodeDescription: () => set((state) => ({
        ...state,
        prefs: {
          ...state.prefs,
          hideNodeDescription: !state.prefs.hideNodeDescription,
        },
      })),

      // UI state
      setImportExpanded: (value) => set((state) => ({
        ...state,
        ui: {
          ...state.ui,
          importExpanded: value,
        },
      })),

      panView: (dx, dy) => set((state) => {
        const view = state.ui.view || defaultView;

        return {
          ...state,
          ui: {
            ...state.ui,
            view: {
              ...view,
              panX: view.panX + dx,
              panY: view.panY + dy,
            }
          }
        }

      }),

      setViewScale: (newScale, mousePos) => set((state) => {
        const view = state.ui.view || defaultView;
        const scaleFactor = (newScale - view.scale) / view.scale;
        
        return {
          ...state,
          ui: {
            ...state.ui,
            view: {
              ...view,
              scale: newScale,
              panX: view.panX - ( mousePos.x - view.panX ) * scaleFactor,
              panY: view.panY - ( mousePos.y - view.panY ) * scaleFactor,
            }
          }
        }
      }),

      viewAll: (vw = 400, vh = 300) => set((state) => {

        const bounds = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }

        state.nodes.forEach(node => {
          bounds.top = Math.min(bounds.top, node.y);
          bounds.bottom = Math.max(bounds.bottom, node.y + node.h);
          bounds.left = Math.min(bounds.left, node.x);
          bounds.right = Math.max(bounds.right, node.x + node.w);
        })

        // add padding
        const xPadding = 3;
        const yPadding = 1;

        bounds.top -= yPadding; 
        bounds.bottom += yPadding; 
        bounds.left -= xPadding; 
        bounds.right += xPadding; 

        const scale = Math.min(
          vw / remAsPx(bounds.right - bounds.left),
          vh / remAsPx(bounds.bottom - bounds.top)
        );

        const newView = {
          panX: scale * -remAsPx(bounds.left),
          panY: scale * -remAsPx(bounds.top),
          scale
        }

        return {
          ...state,
          ui: {
            ...state.ui,
            view: {
              ...state.ui.view,
              ...defaultView,
              ...newView
            }
          },
        }
      }),

      // Node input field changes
      setInputValue: (targetInput, value) => set((state) => {
        targetInput.userValue = value; // re-displayed in form input, for editing again

        // interpret input
        // TODO: move into parse function if DRY needed

        let writeValue = value !== undefined ? value : 0; // best guess so far; improve below with parsing

        const trimmed = value.toString().trim().toLowerCase();

        if (targetInput.intentId == synthNodeTerminalIntents.PITCH_OFFSET_OCTAVES.id) {
          if (trimmed.slice(-1) == 'c') { // cents
            writeValue = parseFloat(trimmed.slice(0,-1)) / 1200;

          } else if (trimmed.slice(-1) == 'd') { // ET12 notes
            writeValue = parseFloat(trimmed.slice(0,-1)) / 12;

          } else if (trimmed.indexOf('/') > -1) { // fraction of numbers (slash divide)
            const parts = trimmed.split('/').map(n => parseFloat(n));
            if (parts[1] !== 0) writeValue = Math.log(parts[0] / parts[1]) / Math.log(2);

          } else if (trimmed.indexOf(':') > -1) { // fraction of numbers (colon ratio)
            const parts = trimmed.split(':').map(n => parseFloat(n));
            if (parts[1] !== 0) writeValue = Math.log(parts[0] / parts[1]) / Math.log(2);
          }

        } else if (targetInput.intentId == synthNodeTerminalIntents.LEVEL.id) {
          if (trimmed.slice(-2) == 'db') { // dB
            const dB = parseFloat(trimmed.slice(0,-2));
            writeValue = Math.pow(10, dB * 0.1);

          } else if (trimmed.indexOf('/') > -1) { // fraction of numbers (slash divide)
            const parts = trimmed.split('/').map(n => parseFloat(n));
            if (parts[1] !== 0) writeValue = parts[0] / parts[1];

          } else if (trimmed.indexOf(':') > -1) { // fraction of numbers (colon ratio)
            const parts = trimmed.split(':').map(n => parseFloat(n));
            if (parts[1] !== 0) writeValue = parts[0] / parts[1];
          }

        }

        return {
          ...state,
          nodes: state.nodes.map(node => ({
            ...node,
            inputs: node.inputs.map(input => ({
              ...input,
              value: (input == targetInput) ? parseFloat(writeValue) : input.value
            }))
          }))
        }
      }),

      setInputExposed: (targetInput, value) => set((state) => {

        return {
          ...state,
          nodes: state.nodes.map(node => ({
            ...node,
            inputs: node.inputs.map(input => ({
              ...input,
              exposed: (input == targetInput) ? value : input.exposed
            }))
          }))
        }
      }),

      // Remove link from input

      removeLinkFromInput: (targetInput) => set((state) => {
        // console.log('usePatchStore: setLinkDragFromInput()', spec);
        
        return {
          ...state,
          nodes: state.nodes.map(node => ({
            ...node,
            inputs: node.inputs.map(input => ({
              ...input,
              link: (input == targetInput) ? {} : { ...input.link }
            }))
          }))
        }

      }),

      removeLinksFromOutput: (outputNodeId, outputId) => set((state) => {
        // console.log('usePatchStore: setLinkDragFromInput()', spec);
        
        return {
          ...state,
          nodes: state.nodes.map(node => ({
            ...node,
            inputs: node.inputs.map(input => ({
              ...input,
              link: (
                input.link &&
                input.link.synthNodeId == outputNodeId &&
                input.link.outputId == outputId
              ) ? {} : { ...input.link }
            }))
          }))
        }

      }),

      // Drag new links

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
        const newState = {
          ...state,
          ui: {
            ...structuredClone(state.ui),
            draggingLinkFromInput: undefined,
          }
        };
        delete newState.ui.draggingLinkFromInput; // test 1

        return newState;
      }),

      setLinkDragFromOutput: (spec) => set((state) => {
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
        const newState = {
          ...state,
          ui: {
            ...structuredClone(state.ui),
            draggingLinkFromOutput: undefined
          }
        };

        return newState;
      }),

      setNewLinkFromInput: (spec) => set((state) => {
        if (state.ui.draggingLinkFromInput) {
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
              ui: {
                ...state.ui,
                draggingLinkFromInput: undefined,
                draggingLinkFromOutput: undefined,
              },
              nodes: newNodes,
            }
          }
        }

        // failed; do not modify
        return { ...state }
      }),
          
      setNewLinkFromOutput: (spec) => set((state) => {
        if (state.ui.draggingLinkFromOutput) {

          const { fromNode,fromOutput } = state.ui.draggingLinkFromOutput;
          if (fromNode && fromOutput) {

            const newNodes = assignLink(state.nodes, {
              inputNodeId: spec.targetNode.id,
              inputId: spec.targetInput.id,
              targetNodeId: fromNode.id,
              targetOutputId: fromOutput.id,
            });

            return {
              ...state,
              ui: {
                ...state.ui,
                draggingLinkFromInput: undefined,
                draggingLinkFromOutput: undefined,
              },
              nodes: newNodes,
            };
          }
        }

        // failed; do not modify
        return { ...state }
      }),

      clearLinkDragging: () => set((state) => ({
        ...state,
        ui: {
          ...state.ui,
          draggingLinkFromInput: undefined,
          draggingLinkFromOutput: undefined,
        },
      })),

          
      // Node management

      addNode: (synthNodeTypeId) => set((state) => {
        const view = state.ui.view || defaultView;
        const node = newSynthNode(state.nodes, synthNodeTypeId, {
          x: pxAsRem(view.panX) + 10,
          y: pxAsRem(view.panY) + 2,
          selected: true
        });

        return {
          ...state,
          nodes: [
            node, // insert at start of list, before the output node.
            ...structuredClone(state.nodes).map(n => ({...n, selected: false })),
          ],
        }
      }),
      
      duplicateSelectedNodes: () => set((state) => {
        let newId = Math.max(0, ...state.nodes.map((item) => item.id)) + 1;

        const nodeClones = state.nodes.filter(node => node.selected).map(
          n => {
            const newNode = {
              ...structuredClone(n), 
              x: n.x + 1, 
              y: n.y + 1, 
              id: newId++,
            };
            n.clonedToId = newNode.id; // used to remap inputs
            n.selected = false;
            return newNode;
          }
        );

        // if any input links in new nodes point to cloned nodes, link instead to their clones.
        nodeClones.forEach(n => {
          n.inputs.forEach(i => {
            const existingOutputNode = i.link && state.nodes.find(sn => sn.id == i.link.synthNodeId);
            if (existingOutputNode && existingOutputNode.clonedToId) {
              i.link.synthNodeId = existingOutputNode.clonedToId;
            }
          })
        })

        state.nodes.forEach(n => { delete n.cloneToId; } );
      
        const newNodes = [
          ...nodeClones, // insert at start of list, before the output node.
          ...structuredClone(state.nodes),
        ];

        newNodes.forEach(n => {
          delete n.clonedToId;
        })

        return {
          ...state,
          nodes: newNodes,
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

      toggleSelectNode: (nodeId) => set((state) => ({
        ...state,
        nodes: state.nodes.map((node) => {
          const newSelectionState = !node.selected;
          if (node.id === nodeId) 
            console.log(newSelectionState);

          return (
            node.id === nodeId ? { ...node, selected: newSelectionState } : { ...node }
          );
        }),
      })),

      selectAllNodes: (nodeId) => set((state) => ({
        ...state,
        nodes: state.nodes.map((node) => ({ ...node, selected: true }))
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

      // Data mutation for 'drag and drop patch file'

      importFileData: (importedJSON) => set((state) => {
        const loadedState = JSON.parse(importedJSON);
        delete loadedState.ui;
        delete loadedState.prefs;

        // TODO: parse for boop version

        // console.log(loadedState);          

        return {
          ...state,
          ...loadedState
        }
      }),


    })
  ),

  {
    name: 'boop', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  }
);

export default usePatchStore;
