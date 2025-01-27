/* Contains: default data objects, pure functions
    related to synthGraph (patch and performance data).
*/

import { appInfo } from './appInfo.js'
import { getNewId, joinItems, getItemById } from './utils.js'
import { synthNodeTypes, getNodeTypeById } from '../lib/synthNodeTypes.js'


// Defaults

const BITDEPTH_16 = 0;

const defaultOutputSpec = {
  // TODO: refactor these into Output node and Performance parmaters
  sampleRate: 44100, // sps
  duration: 0.5, // seconds
  channels: 1,
  filenameRoot: `${appInfo.appName}`,
  sustainReleaseTime: 400, // ms
  depth: BITDEPTH_16,

  freq: 440 * Math.pow(2, -9/12), // C below concert pitch A
  baseNoteMIDI: 60
}

const defaultPatchNodes = () => {
  const nodes = [];
  nodes.push(newSynthNode(nodes, synthNodeTypes.GEN_FM.id));
  nodes.push(newSynthNode(nodes, synthNodeTypes.OUTPUT.id));

  if (nodes[0] && nodes[1]) {
    nodes[0].x = 3;
    nodes[1].x = 18;

    // add a link
    if (nodes[1].inputs && nodes[1].inputs[0]) {
      nodes[1].inputs[0].link = {
        synthNodeId: nodes[0].id,
        outputId: 1
      }
    }
  }
  return nodes; 
}


// Query functons
  
const getNodeDisplayTitle = node => {
  const nodeType = getNodeTypeById(node.nodeTypeId);
  const displayTypeName = nodeType ? `${nodeType.name}` : '';
  return joinItems([ node.displayName, displayTypeName ], ' - ');
}

const valueOfInput = (input, node, nodes) => {
  if (input && input.link && input.link.synthNodeId) {
    const link = input.link; // alias
    if (!link.resolvedOutput) {
      // cache a direct link as resolvedOutput, so we don't need to look up next time.
      const outputSynthNode = nodes.find(n => n.id == link.synthNodeId);
      if (outputSynthNode) {
        link.resolvedOutput = outputSynthNode && outputSynthNode.outputs.find(output => output.id == link.outputId);
      }
    }
    if (link.resolvedOutput) {
      return link.resolvedOutput.signal || 0;
    } else {
      console.warn('Link failed to resolve, from input:', input);
      return 0;
    }
  } else {    
    return valueOfInputNoLinks(input, node, nodes);
  }
}

const valueOfInputNoLinks = (input, node, nodes) => {
  if (input.value != undefined)
    return input.value;

  const nodeTypeInput =  getDefaultInput(node, input);
  return nodeTypeInput.defaultValue !== undefined ? nodeTypeInput.defaultValue : 0;
}

function valuesOfInputs(node, nodes) {
  return node.inputs.map(i => valueOfInput(i, node, nodes));
}

function valuesOfInputsNoLinks(node, nodes) {
  return node.inputs.map(i => valueOfInputNoLinks(i, node, nodes));
}

const getDefaultInput = (synthNode, input) => { // get matching input in synthNodeTypes
  const nodeType = getNodeTypeById(synthNode.nodeTypeId);
  return getItemById(nodeType.inputs, input.id);
}


// actions

function clearPeakMeters(nodes) {
  nodes.forEach(n => {
    delete n.peakMeter;
  });
}

function cleanPatch(nodes) {  // Remove extra properties and direct object refs
  for (let nodeIndex in nodes) {
    const node = nodes[nodeIndex];
    delete node.phase;
    delete node.buffer; // we retain node.bufferId
    delete node.proc;

    node.inputs.forEach(input => {
      if (input.link) {
        delete input.link.resolvedOutput;
      }
    });

    node.outputs.forEach(output => {
      delete output.signal;
    });
  }
}

function cleanStateForExport(workingState) {  

  const state = workingState; // want structuredClone(workingState);
  
  // clean up state
  delete state.ui.draggingLinkFromOutput;
  delete state.ui.draggingLinkFromInput;
  delete state.ui.expandPreviewWaveworm; // remove at v1.0

  state.nodes.forEach(node => {
    delete node.highlighted;
    delete node.selected;

    // Remove excess decimal places (units: rem; pixel at 100% is near 0.06)
    node.x = Number(node.x.toFixed(4));
    node.y = Number(node.y.toFixed(4));
    node.w = Number(node.w.toFixed(4));
    node.h = Number(node.h.toFixed(4));

    node.inputs.forEach(input => {
      // clear up old properties not used now - remove at v1.0
      delete input.displayName;
      delete input.displayNameShort;
      delete input.description;
      delete input.defaultValue;
      delete input.isParam; // TODO: remove also from new node
      delete input.placeholder;
      delete input.isPlaceholder;
      delete input.intentId;
      delete input.displayUnits;
      delete input.isOffset;
      delete input.onlyShowIf; // TODO: remove also from new node
      delete input.order; // TODO: remove also from new node
      delete input.posX;
      delete input.posY;
      if (input.link == {}) delete input.link;

      // remove reference to output buffer.
      delete input.buffer; // just from the node; will be discarded on generate()

      // userValues are only useful if different (parseable format) from value.
      if (input.userValue == input.value) delete input.userValue;

      // delete values identical to default (consider removing if defaults are likely to change)
      const nodeType = getNodeTypeById(node.nodeTypeId);
      const nodeTypeInput = getItemById(nodeType.inputs, input.id); // get matching input in synthNodeTypes
      if (input.value == nodeTypeInput.defaultValue) delete input.value;

    })

    node.outputs.forEach(output => {
      // clear up old properties not used now - remove at v1.0
      delete output.displayName;
      delete output.displayNameShort;
      delete output.description;
      delete output.intentId;
      delete output.displayUnits;
      delete output.isOffset;
      delete output.signal;
      delete output.posX;
      delete output.posY;
    })
  })


  // add some metadata
  state.appName = appInfo.appName;
  state.appVersion = appInfo.appVersion;
  state.saveVersion = appInfo.saveVersion;

  return state;

}


const assignLink = (nodes, spec) => {
  const newNodes = [ ...structuredClone(nodes) ];

  const { inputNodeId, inputId, targetNodeId, targetOutputId } = spec;
  
  const link = {
    synthNodeId: targetNodeId,
    outputId: targetOutputId,
    // debug: spec
  }

  // Set input.link to the new link
  let input;

  const node = newNodes.find(n => n.id == inputNodeId);
  if (node) {
    input = node.inputs.find(i => i.id == inputId);
  }
  if (input) {
    input.link = link;
  }
  return newNodes;
}

const newSynthNode = (nodes = [], nodeTypeId, overrides = {}) => {
  const nodeType = getNodeTypeById(nodeTypeId);
  const id = (nodes.length > 0) ? getNewId(nodes) : 1;
  
  if (nodeType) {
    return {
      id,
      nodeTypeId,
      x: 2, // rem
      y: 2, // rem
      w: 11, // rem
      inputs: structuredClone(nodeType.inputs),
      outputs: structuredClone(nodeType.outputs),
      ...overrides,
    }
  }
}

export {
  defaultOutputSpec,
  defaultPatchNodes,

  getNodeDisplayTitle,
  valueOfInput,
  valueOfInputNoLinks,
  valuesOfInputs,
  valuesOfInputsNoLinks,
  getDefaultInput,

  clearPeakMeters,
  cleanPatch,
  cleanStateForExport,
  assignLink,
  newSynthNode,
}