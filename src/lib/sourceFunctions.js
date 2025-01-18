const sourceFunctions = {
  SINE: {
    id: 1,
    name: 'Sine',
  },  
  SAW: {
    id: 2,
    name: 'Saw',
  },  
  TRIANGLE: {
    id: 3,
    name: 'Triangle',
  },  
  SQUARE: {
    id: 4,
    name: 'Square',
  },  
}

const getSourceFunctionById = id => {
  let found = false;
  for (let key in sourceFunctions) {
    if (sourceFunctions[key].id == id) {
      found = sourceFunctions[key];
      break;
    }
  }
  return found;
} 

export {
  sourceFunctions,
  getSourceFunctionById
}