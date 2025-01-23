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
  filenameRoot: `${appInfo.appName} - output`,
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

function valueOfInput(input, node, nodes) {
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

    if (input.value != undefined)
      return input.value;

    const nodeType = getNodeTypeById(node.nodeTypeId);
    const nodeTypeInput = getItemById(nodeType.inputs, input.id); // get matching input in synthNodeTypes
    return nodeTypeInput.defaultValue !== undefined ? nodeTypeInput.defaultValue : 0;
  }
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
    delete node.env;
    delete node.phase;
    delete node.buffer; // but retain node.buffer.id

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

  clearPeakMeters,
  cleanPatch,
  assignLink,
  newSynthNode,
}