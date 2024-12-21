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

const synthNodeTerminalIntents = { // draft only
  LEVEL: { id: 0, name: 'Level', classCSS: 'terminal-level' },
  FREQUENCY: { id: 1, name: 'Frequency', classCSS: 'terminal-frequency' },
}

const getSynthNodeTerminalIntentsById = id => {
  let found = false;
  for (let key in synthNodeTerminalIntents) {
    if (synthNodeTerminalIntents[key].id == id) {
      found = synthNodeTerminalIntents[key];
      break;
    }
  }
  return found;
} 

// Synth Node Types

const synthNodeTypes = {
  MOCK: {
    id: 0,
    name: 'Test' },
  OUTPUT: {
    id: 1,
    name: 'Output',
    inputs: [
      {
        id: 1,
        displayName: 'Signal',
        intentId: synthNodeTerminalIntents.LEVEL.id,
      },
      {
        id: 2,
        displayName: 'Gain',
        intentId: synthNodeTerminalIntents.LEVEL.id,
      }
    ],
    outputs: [],
  },
  GEN_FM: {
    id: 2,
    name: 'FM',
    inputs: [
      {
        id: 1,
        displayName: 'Modulator',
        intentId: synthNodeTerminalIntents.LEVEL.id,
      },
      {
        id: 2,
        displayName: 'Mix in',
        intentId: synthNodeTerminalIntents.LEVEL.id,
      }      
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Signal',
        intentId: synthNodeTerminalIntents.LEVEL.id,
      }
    ],
  },
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
    x: 2, // rem
    y: 1, // rem
    w: 11, // rem
    nodeTypeId: synthNodeTypes.GEN_FM.id,
    displayName: 'Node',
    inputs: [ ...synthNodeTypes.GEN_FM.inputs ],
    output: [ ...synthNodeTypes.GEN_FM.outputs ]
  }
}

const newSynthNode = newCreator(defaultSynthNode)

// Default fragments for init state
const defaultPatchNodes = [ 
  newSynthNode.newObject({
    outputs: [ ...synthNodeTypes.GEN_FM.outputs ],
  }),
  newSynthNode.newObject({
    nodeTypeId: synthNodeTypes.OUTPUT.id,
    x: 18,
    y: 3,
    inputs: [ ...synthNodeTypes.OUTPUT.inputs ]
  }),
]
const defaultPerfNodes = {
  
}


export {
  synthNodeTerminalIntents,
  getSynthNodeTerminalIntentsById,
  synthNodeTypes,
  getNodeTypeById,
  newSynthNode,
  defaultSynthNode,
  defaultPatchNodes,
  defaultPerfNodes,

}