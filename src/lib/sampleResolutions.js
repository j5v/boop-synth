const sampleResolutions = {
  BIT_8: {
    id: 1,
    name: '8-bit',
    isPlaceholder: true,
  },  
  BIT_16: {
    id: 2,
    name: '16-bit',
  },  
  BIT_32: {
    id: 3,
    name: '32-bit',
    isPlaceholder: true,
  },
  FLOAT_32: {
    id: 5,
    name: '32-bit float',
    isPlaceholder: true,
  },  
}

const getSampleResolutionById = id => {
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
  sampleResolutions,
  getSampleResolutionById
}