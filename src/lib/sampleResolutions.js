const sampleResolutions = {
  BIT_8: {
    id: 1,
    name: '8-bit',
    bytesPerSample: 1,
    isPlaceholder: true,
    fromFloat: s => s * 0x7F,
  },  
  BIT_8u: {
    id: 11,
    name: '8-bit unsigned',
    bytesPerSample: 1,
    isPlaceholder: true,
    fromFloat: s => s * 0x7F + 0x80,
  },  
  BIT_16: { // default - usually sufficient
    id: 2,
    name: '16-bit',
    bytesPerSample: 2,
    fromFloat: s => s * 0x7FFF,
  },  
  BIT_24: {
    id: 3,
    name: '24-bit in 32-bit',
    bytesPerSample: 4,
    isPlaceholder: true,
    fromFloat: s => s * 0x7FFFFFFF & 0x7FFFFF00,
  },  
  // BIT_24_3: { // todo: packing, in wav.js
  //   id: 83,
  //   name: '24-bit packed',
  //   bytesPerSample: 3,
  //   isPlaceholder: true,
  //   fromFloat: s => s * 0x7FFFFF,
  // },
  BIT_32: {
    id: 43,
    name: '32-bit',
    bytesPerSample: 4,
    isPlaceholder: true,
    fromFloat: s => s * 0x7FFFFFFF,
  },
  FLOAT_32: {
    id: 26,
    name: '32-bit float',
    bytesPerSample: 4,
    isPlaceholder: true,
  },  
  // FLOAT_64: {
  //   id: 26,
  //   name: '64-bit float',
  //   bytesPerSample: 8,
  //   isPlaceholder: true,
  // },  
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