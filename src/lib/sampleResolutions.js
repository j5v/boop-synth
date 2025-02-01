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
  BIT_24: {
    id: 3,
    name: '24-bit',
    isPlaceholder: true,
  },  
  BIT_32: {
    id: 4,
    name: '32-bit',
    isPlaceholder: true,
  },
  FLOAT_32: {
    id: 6,
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