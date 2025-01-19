const waveshaperFunctions = {
  PASS_THROUGH: {
    id: 1,
    name: 'No change',
    fn: inp => inp,
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