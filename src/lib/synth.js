import { newCreator } from '../lib/utils.js'

const BITDEPTH_16 = 0;

const outputSpec = { // TODO: expand and make state
  sps: 44100,
  channels: 1,
  depth: BITDEPTH_16,
  length: 22050,
  gain: 0.707
}

// Synth Node Parameter intents

const synthNodeInputIntents = { // draft only
  LEVEL: { id: 0, name: 'Level', classCSS: 'terminal-level' },
  FREQUENCY: { id: 1, name: 'Frequency', classCSS: 'terminal-frequency' },
}

const getSynthNodeInputIntentsById = id => {
  let found = false;
  for (let key in synthNodeInputIntents) {
    if (synthNodeInputIntents[key].id == id) {
      found = synthNodeInputIntents[key];
      break;
    }
  }
  return found;
} 

// Synth Node Types

const synthNodeTypes = {
  MOCK: { id: 0, name: 'Test' },
  OUTPUT: { id: 1, name: 'Output', inputs: [
    {
      id: 1,
      displayName: 'Signal',
      intentId: synthNodeInputIntents.LEVEL.id,
    },
    {
      id: 2,
      displayName: 'Gain',
      intentId: synthNodeInputIntents.LEVEL.id,
    }
  ] },
  GEN_FM: { id: 2, name: 'FM' },
}

const getNodeTypeById = id => {
  let found = false;
  for (let key in synthNodeTypes) {
    if (synthNodeTypes[key].id == id) {
      found = synthNodeTypes[key];
      break;
    }
  }
  return found;
} 

const defaultSynthNode = {
  defaultObject: {
    x: 2,
    y: 1,
    w: 10,
    nodeTypeId: synthNodeTypes.GEN_FM.id,
    displayName: 'Node',
    inputs: [],
    output: []
  }
}

const newSynthNode = newCreator(defaultSynthNode)


export {
  synthNodeInputIntents,
  getSynthNodeInputIntentsById,
  synthNodeTypes,
  getNodeTypeById,
  newSynthNode,
}