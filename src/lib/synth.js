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
  LEVEL: { id: 0, name: 'Level', classCSS: 'terminal-level', modulatable: true },
  FREQUENCY: { id: 1, name: 'Frequency', classCSS: 'terminal-frequency', modulatable: false },
  SOURCE: { id: 2, name: 'Source', classCSS: 'terminal-source', modulatable: false },
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
    name: 'Test'
  },
  OUTPUT: {
    id: 1,
    name: 'Output',
    inputs: [
      {
        id: 1,
        displayName: 'Signal',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 2,
        displayName: 'Gain',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 1.0,
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
        displayName: 'Carrier Source',
        intentId: synthNodeTerminalIntents.SOURCE.id,
        exposed: false,
        defaultValue: 1,
      },
      {
        id: 2,
        displayName: 'Carrier Frequency',
        intentId: synthNodeTerminalIntents.FREQUENCY.id,
        exposed: false,
        defaultValue: 1,
      },
      {
        id: 3,
        displayName: 'Modulator',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 4,
        displayName: 'Post-mix',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Signal',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
  },
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
    x: 12,
    y: 13,
    inputs: [ ...synthNodeTypes.OUTPUT.inputs ]
  }),
];

// add a link
defaultPatchNodes[1].inputs[0].link = {
  synthNodeId: defaultPatchNodes[0].id,
  outputId: 1
}

const defaultPerfNodes = {
  
}


// query functons
const getItemById = (list, id) => {
  let foundItem;
  for (let key in list) {
    if (list[key].id == id) {
      foundItem = list[key];
      break;
    }
  }
  return foundItem;
} 

const getNodeTypeById = id => getItemById(synthNodeTypes, id);
  


export {
  synthNodeTerminalIntents,
  getSynthNodeTerminalIntentsById,
  synthNodeTypes,
  getNodeTypeById,
  newSynthNode,
  defaultSynthNode,
  defaultPatchNodes,
  defaultPerfNodes,
  getItemById
}