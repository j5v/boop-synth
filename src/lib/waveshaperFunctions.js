const waveshaperFunctions = {
  PASS_THROUGH: {
    id: 1,
    name: 'No change',
    fn: i => i,
  },
  SQUARE: {
    id: 2,
    name: 'Power 2',
    fn: i => i * i * Math.sign(i),
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

const waveShaperPreviewData = ({ wsId = 1, steps = 200, first = -1, last = 1 }) => {
  // Returns (steps + 1) values
  const ws = getWaveshaperFunctionById(wsId);

  const outputs = [];

  for (let i = 0; i <= steps; i++) {
    const x = first + (last - first) * (i / steps);
    outputs.push({
      i,
      x,
      y: ws.fn(x)
    });
  }
  return outputs;
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
  waveShaperPreviewData,
  getWaveshaperFunctionById
}