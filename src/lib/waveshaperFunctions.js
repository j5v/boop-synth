const waveshaperFunctions = {
  PASS_THROUGH: {
    id: 1,
    name: 'No change',
    fn: i => i,
  },
  SIN: { // periodic
    id: 10,
    name: 'Sine',
    fn: i => Math.sin(Math.PI * 0.5 * i),
  },
  SAW: { // periodic
    id: 11,
    name: 'Saw',
    fn: i => i % 1,
  },
  RECTIFY: {
    id: 30,
    name: 'Rectify',
    fn: i => Math.abs(i),
  },
}

// not used yet - some dependencies to work out.
const waveShaperPreviewData = (inputSignals, steps = 200) => {
  const [ signal, inMin, inMax, outMin, outMax, preAmp, offset, threshold, shaperId, doClipInput, doClipOutput ] = inputSignals;
 
  const outputs = [];

  for (i = 0; i < steps; i++) {
    const x = inMin + (inMax - inMin) * i;
    outputs.push(
      doShaper({
        ...inputSignals,
        signal: x
      })
    );
  }
}

const getWaveshaperFunctionById = id => {
  let found = false;
  for (let key in waveshaperFunctions) {
    if (waveshaperFunctions[key].id == id) {
      found = waveshaperFunctions[key];
      break;
    }
  }
  return found;
} 

export {
  waveshaperFunctions,
  getWaveshaperFunctionById
}