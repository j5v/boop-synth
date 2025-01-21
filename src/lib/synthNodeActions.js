import { synthNodeTypes } from '../lib/synthNodeTypes.js'

const synthNodeActions = { // draft only
  VIEW_WAVE: {
    id: 1,
    synthNodeTypeId: synthNodeTypes.OUTPUT.id,
    name: 'View wave',
    isPlaceholder: true,
  },
  SPECTRUM: {
    id: 2,
    synthNodeTypeId: synthNodeTypes.OUTPUT.id,
    name: 'View spectrum',
    isPlaceholder: true,
  },
}

const getActionsForSynthNodeTypeId = synthNodeTypeId => {
  let found = [];
  for (let key in synthNodeActions) {
    if (synthNodeActions[key].synthNodeTypeId == synthNodeTypeId) {
      found.push(synthNodeActions[key]);
    }
  }
  return found;
} 

const getSynthNodeActionById = id => {
  let found = false;
  for (let key in synthNodeActions) {
    if (synthNodeActions[key].id == id) {
      found = synthNodeActions[key];
      break;
    }
  }
  return found;
} 

export {
  synthNodeActions,
  getActionsForSynthNodeTypeId,
  getSynthNodeActionById
}