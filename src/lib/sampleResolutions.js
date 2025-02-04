const WAVE_FORMAT_PCM = 0x0001;
const WAVE_FORMAT_IEEE_FLOAT = 0x0003;

const sampleResolutions = {
  // BIT_8: {
  //   id: 1,
  //   name: '8-bit signed',
  //   dataBytes: 1, // per sample
  //   storageBytes: 1, // per sample
  //   bitsPerSample: 8,
  //   writeFnName: 'setInt8',
  //   format: WAVE_FORMAT_PCM,
  //   fromFloat: s => s * 0x7F,
  // },  
  BIT_8u: {
    id: 11,
    name: '8-bit unsigned',
    dataBytes: 1,
    storageBytes: 1,
    bitsPerSample: 8,
    writeFnName: 'setInt8',
    format: WAVE_FORMAT_PCM,
    fromFloat: s => s * 0x7F + 0x80,
  },  
  BIT_16: { // default - usually sufficient
    id: 2,
    name: '16-bit',
    dataBytes: 2,
    storageBytes: 2,
    bitsPerSample: 16,
    writeFnName: 'setInt16',
    format: WAVE_FORMAT_PCM,
    fromFloat: s => s * 0x7FFF,
  },  
  BIT_24: {
    id: 3,
    name: '24-bit in 32-bit',
    dataBytes: 4,
    storageBytes: 4,
    bitsPerSample: 24,
    writeFnName: 'setInt32',
    format: WAVE_FORMAT_PCM,
    fromFloat: s => s * 0x7FFFFFFF & 0x7FFFFF00,
  },  
  BIT_24_3: { // todo: packing, in wav.js
    id: 83,
    isPlaceholder: true,
    name: '24-bit packed',
    dataBytes: 3,
    writeFnName: 'setInt24', // Might not exist - special packing?
    bytesPacked: true,
    format: WAVE_FORMAT_PCM,
    fromFloat: s => s * 0x7FFFFF,
  },
  BIT_32: {
    id: 43,
    name: '32-bit',
    dataBytes: 4,
    storageBytes: 4,
    bitsPerSample: 32,
    writeFnName: 'setInt32',
    format: WAVE_FORMAT_PCM,
    fromFloat: s => s * 0x7FFFFFFF,
  },
  FLOAT_32: {
    id: 26,
    isPlaceholder: true,
    name: '32-bit float',
    dataBytes: 4,
    storageBytes: 4, // per sample
    bitsPerSample: 32,
    writeFnName: 'setFloat32',
    format: WAVE_FORMAT_IEEE_FLOAT,
    fromFloat: s => s,
  },  
  FLOAT_64: {
    id: 27,
    isPlaceholder: true,
    name: '64-bit float',
    dataBytes: 8,
    storageBytes: 8,
    bitsPerSample: 64,
    writeFnName: 'setFloat64',
    format: WAVE_FORMAT_IEEE_FLOAT,
    fromFloat: s => s,
  },  
}

const getSampleResolutionById = id => {
  let found = false;
  for (let key in sampleResolutions) {
    if (sampleResolutions[key].id == id) {
      found = sampleResolutions[key];
      break;
    }
  }
  return found;
} 

export {
  sampleResolutions,
  getSampleResolutionById
}