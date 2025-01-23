import { appInfo } from './appInfo.js'
import { getNewId, joinItems } from './utils.js'
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


// actions

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

  assignLink,
  newSynthNode,
}