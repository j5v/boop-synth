import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  assignLink,
  newSynthNode,
  defaultPerf,
  defaultPatchNodes,
  defaultView,
} from '../lib/synthGraphUtils.js'

import { parseUserInput } from '../lib/synthNodeIntents';
import { getNodeTypeById } from '../lib/synthNodeTypes';

import {
  rectanglesIntersect,
  swapItemsInArray,
  cleanNodeLinks,
  remAsPx,
  pxAsRem
} from "../lib/utils.js";


const usePatchStore = create(
  // @ts-ignore
  persist( // Used to maintain current state in localStorage
    (set, get) => ({
      nodes: defaultPatchNodes(),

      perf: {
        ...defaultPerf
      },

      prefs: {
        hideNodeDescription: false, // in instpector panel
      },

      ui: {
        draggingLinkFromInput: undefined,
        draggingLinkFromOutput: undefined,
        view: structuredClone(defaultView),
        visualizationState: [],
      },

      
      // Perf
      setPerf: (key, value) => set((state) => {

        const newPerf = structuredClone(state.perf);

        newPerf[key] = value.toString().trim().toLowerCase();
        return ({
          ...state,
          perf: newPerf,
        })
      }),


      // UI Prefs
      toggleHideNodeDescription: () => set((state) => ({
        ...state,
        prefs: {
          ...state.prefs,
          hideNodeDescription: !state.prefs.hideNodeDescription,
        },
      })),


      // UI state
      toggleVisualizationExpanded: (spec) => set((state) => {
        const id = `${spec.synthNodeId}-${spec.visualizationId}`;


        // set some state if there is none (and set to not-expanded; toggle afterwards)

        if (!state.ui.visualizationsState)
          state.ui.visualizationsState = [];

        if (!state.ui.visualizationsState.find(vs => vs.id == id)) {
          state.ui.visualizationsState.push({ id, isExpanded: false });
        }


        // New state

        return {
          ...state,
          ui: {
            ...state.ui,
            visualizationsState: state.ui.visualizationsState.map(vs => ({
              ...vs,
              isExpanded: (vs.id == id) ?
                !vs.isExpanded :
                vs.isExpanded
            }))
          },
        }
      }),


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
          top: Infinity,
          right: -Infinity,
          bottom: -Infinity,
          left: Infinity,
        }

        state.nodes.forEach(node => {
          bounds.top = Math.min(bounds.top, node.y);
          bounds.bottom = Math.max(bounds.bottom, node.y + node.h);
          bounds.left = Math.min(bounds.left, node.x);
          bounds.right = Math.max(bounds.right, node.x + node.w);
        })

        // add padding
        const xPadding = 3;
        const yPadding = 2;

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
      setInputValue: (targetInput, value, nodeTypeInput) => set((state) => {

        targetInput.userValue = value; // re-displayed in form input, for editing again

        const writeValue = parseUserInput({ intentId: nodeTypeInput.intentId, value });

        return {
          ...state,
          nodes: state.nodes.map(node => ({
            ...node,
            inputs: node.inputs.map(input => ({
              ...input,
              value: (input == targetInput) ? writeValue : input.value
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

      // Side-effect notification
      stateDirty: () => set((state) => {

        return {
          ...state,
          runCount: (state.runCount || 0) + 1
        }
      }),


      // Remove link from input

      removeLinkFromInput: (targetInput) => set((state) => {
        // console.log('usePatchStore: setLinkDragFromInput()', targetInput);
        
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
        // console.log('usePatchStore: setLinkDragFromInput()', outputNodeId, outputId);
        
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

      tidyInputs: () => set((state) => {
        return {
          ...state,
          nodes: state.nodes.map(node => ({
            ...node,
            inputs: node.inputs.map(input => ({
              ...input,
              exposed: input.link && input.link.synthNodeId
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

      reset: () => set((state) => ({
        ...state,
        nodes: defaultPatchNodes(),
        perf: { ...defaultPerf },
        ui: {
          draggingLinkFromInput: undefined,
        },
      })),

      addNode: (synthNodeTypeId) => set((state) => {
        const view = state.ui.view || defaultView;
        const node = newSynthNode(state.nodes, synthNodeTypeId, {
          x: ( -pxAsRem(view.panX) + 12 ) / view.scale,
          y: ( -pxAsRem(view.panY) + 2 ) / view.scale,
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
          return (
            node.id === nodeId ? { ...node, selected: newSelectionState } : { ...node }
          );
        }),
      })),
      
      selectAllNodes: (nodeId) => set((state) => ({
        ...state,
        nodes: state.nodes.map((node) => ({ ...node, selected: true }))
      })),

      selectExclusiveNode: (nodeId) => set((state) => {
        if (state.ui && state.ui.selectionBounds && state.ui.selectionBounds.hasSelected) {
          // Do not change selection, because we've just selected using a drag box.
          return {
            ...state,
            ui: {
              ...state.ui,
              selectionBounds: undefined
            }
          };

        } else {

          // Select node, and unselect other nodes.
          return {
            ...state,
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, selected: true }
                : { ...node, selected: false }
            ),
          }

        }
      }),

      highlightExclusiveNode: (nodeId) => set((state) => ({
        // Select node, and unselect other nodes.
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, highlighted: true }
            : { ...node, highlighted: false }
        ),
      })),

      toggleBypassSelectedNodes: () => set((state) => ({
        ...state,
        nodes: state.nodes.map((node) => {
          return (
            node.selected ? { ...node, bypassed: !node.bypassed } : { ...node }
          );
        }),
      })),

      setBypassNode: (synthNodeId, value) => set((state) => ({
        ...state,
        nodes: state.nodes.map((node) => {
          return (
            node.id == synthNodeId ? { ...node, bypassed: value } : { ...node }
          );
        }),
      })),

      setNodeDisplayName: (nodeId, value) => set((state) => ({
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === nodeId ? { ...node, displayName: value } : { ...node }
        ),
      })),

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


      // Selection drag box

      beginSelectionBox: (x1, y1) => set((state) => ({
        ...state,
        ui: {
          ...state.ui,
          selectionBounds: { x1, y1 },
          // debug: console.log(x1, y1)
        }
      })),

      dragSelectionBox: (nx2, ny2) => set((state) => {

        const b = state.ui.selectionBounds;

        const { panX, panY, scale } = state.ui.view || { panX: 0, panY: 0, scale: 1 };

        const x1 = pxAsRem(Math.min(b.x1, nx2) - panX) / scale;
        const x2 = pxAsRem(Math.max(b.x1, nx2) - panX) / scale;
      
        const y1 = pxAsRem(Math.min(b.y1, ny2) - panY) / scale;
        const y2 = pxAsRem(Math.max(b.y1, ny2) - panY) / scale;
      
        return {
          ...state,
          nodes: state.nodes.map(node => ({
            ...node,
            highlighted: rectanglesIntersect(
              x1, y1, x2, y2, 
              node.x, node.y, node.x + node.w, node.y + node.h, 
            ),
          })),
          ui: {
            ...state.ui,
            selectionBounds: {
              ...state.ui.selectionBounds,
              x2: nx2, y2: ny2
            }
          }
        }
      }),

      endSelectionBox: () => set((state) => {

        const b = state.ui.selectionBounds;

        if (b.x2 == undefined) { // Clicked in empty space but did not drag a box.
          return {
            ...state,
            ui: {
              ...state.ui,
              selectionBounds: undefined
            }
          };
        } else {
          const { panX, panY, scale } = state.ui.view || { panX: 0, panY: 0, scale: 1 };

          const x1 = pxAsRem(Math.min(b.x1, b.x2) - panX) / scale;
          const x2 = pxAsRem(Math.max(b.x1, b.x2) - panX) / scale;
        
          const y1 = pxAsRem(Math.min(b.y1, b.y2) - panY) / scale;
          const y2 = pxAsRem(Math.max(b.y1, b.y2) - panY) / scale;

          const newState = {
            ...state,
            nodes: state.nodes.map(node => ({
              ...node,
              selected: rectanglesIntersect(
                x1, y1, x2, y2, 
                node.x, node.y, node.x + node.w, node.y + node.h, 
              ),
            })),
            ui: {
              ...state.ui,
              selectionBounds: { hasSelected: true }
            }
          }
          return newState;
        }

      }),


      // Data mutation for 'drag and drop patch file'

      importFileData: (importedJSON) => set((state) => {
        const loadedState = JSON.parse(importedJSON);
        delete loadedState.ui;
        delete loadedState.prefs;

        const newState = structuredClone(loadedState);



        return {
          ...state,
          ...loadedState,
          nodes: loadedState.nodes.map(n => {

            const nodeType = getNodeTypeById(n.nodeTypeId);

            // merge inputs
            const inputs = structuredClone(nodeType.inputs).map(i => {
              const importInput = n.inputs.find(input => input.id == i.id);
              const newInput = importInput ? { ...importInput, ...i } : i;

              // tidying of legacy patch; remove at v1.0.
              if (newInput.link && !newInput.link.synthNodeId) delete newInput.link;

              return newInput;
            });

            // merge outputs
            const outputs = structuredClone(nodeType.outputs).map(i => {
              const importOutput = n.outputs.find(output => output.id == i.id);
              return (importOutput ? { ...importOutput, ...i } : i)
            });
          
            // const nodeTypeDefault = structuredClone(getNodeTypeById(n.nodeTypeId));
            
            return {
              ...n,
              inputs,
              outputs,              
            }
          }),
        }
      }),      

    })
  ),

  // @ts-ignore
  {
    name: 'boop', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  }
);

export default usePatchStore;
