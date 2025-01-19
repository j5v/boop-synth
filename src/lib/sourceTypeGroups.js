const sourceTypeGroups = {
  FUNCTION: {
    id: 1,
    name: 'Shape',
  },  
  WAVE_TABLE: {
    id: 2,
    name: 'Wave table',
    isPlaceholder: true,
  },  
  SAMPLE: {
    id: 3,
    name: 'Sample',
    isPlaceholder: true,
  },  
}

const getSourceTypeGroupById = id => {
  let found = false;
  for (let key in sourceTypeGroups) {
    if (sourceTypeGroups[key].id == id) {
      found = sourceTypeGroups[key];
      break;
    }
  }
  return found;
} 

export {
  sourceTypeGroups,
  getSourceTypeGroupById
}