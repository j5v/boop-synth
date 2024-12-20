import { newCreator } from '../lib/utils.js'

const synthNodeTypes = {
  MOCK: { id: 0, name: 'TEST' },
  GEN_FM: { id: 1, name: 'FM' },
}

const defaultSynthNode = {
  defaultObject: {
    x: 2,
    y: 1,
    w: 10,
    h: 7,
    nodeTypeId: synthNodeTypes.MOCK.id,
    displayName: 'Node',
    inputs: [],
    output: []
  }
}

const newSynthNode = newCreator(defaultSynthNode)

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


export {
  synthNodeTypes,
  newSynthNode,
  getNodeTypeById
}