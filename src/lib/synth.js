import { joinItems } from '../lib/utils.js'
import saveAs from '../lib/FileSaver.js'

const BITDEPTH_16 = 0;

const getItemById = (list, id) => { // find property by id, in object
  let foundItem;
  for (let key in list) {
    if (list[key].id == id) {
      foundItem = list[key];
      break;
    }
  }
  return foundItem;
}

const defaultOutputSpec = {
  sampleRate: 44100, // sps
  duration: 0.25, // seconds
  channels: 1,
  filenameRoot: 'FMC 2 - output',
  depth: BITDEPTH_16,

  freq: 440 * Math.pow(2, -9/12), // C below concert pitch A
}
const defaultPatchPerformance = {
  baseFreq: 440 * Math.pow(2, -9/12), // C below concert pitch A
  baseNoteMIDI: 60
}

const defaultPatchNodes = () => {
  const nodes = [];
  nodes.push(newSynthNode(nodes, synthNodeTypes.GEN_FM.id));
  nodes.push(newSynthNode(nodes, synthNodeTypes.OUTPUT.id));

  nodes[1].x = 18;

  // add a link
  nodes[1].inputs[0].link = {
    synthNodeId: nodes[0].id,
    outputId: 1
  }
  return nodes;
}

// Synth Node Parameter intents

const synthNodeTerminalIntents = { // draft only
  LEVEL: {
    id: 1,
    name: 'Level',
    classCSS: 'level',
    modulatable: true
  },
  FREQUENCY_OCTAVES: {
    id: 2,
    name: 'Frequency',
    units: '+octave',
    classCSS: 'frequency',
    modulatable: true
  },
  SOURCE: {
    id: 3,
    name: 'Source',
    units: 'choice',
    classCSS: 'source',
    modulatable: false
  },
  ENUM: {
    id: 4,
    name: 'whole number',
    units: 'choice',
    classCSS: 'enum',
    modulatable: false
  },
}

const getSynthNodeTerminalIntentsById = id => {
  let found = false;
  for (let key in synthNodeTerminalIntents) {
    if (synthNodeTerminalIntents[key].id == id) {
      found = synthNodeTerminalIntents[key];
      break;
    }
  }
  return found;
} 

// Synth Node Types

const synthNodeTypes = {
  OUTPUT: {
    id: 1,
    name: 'Output',
    inputs: [
      {
        id: 1,
        displayName: 'Signal',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 2,
        displayName: 'Gain',
        description: 'Less than 1.0 is quieter, more than 1.0 is louder',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 1.0,
      }
    ],
    outputs: [],
    description: 'Collects a signal to be the output for the graph',
  },
  GEN_FM: {
    id: 2,
    name: 'Osc',
    inputs: [
      {
        id: 1,
        displayName: 'Source',
        description: 'A waveform or sample',
        intentId: synthNodeTerminalIntents.SOURCE.id,
        exposed: false,
        placeholder: true,
        defaultValue: 1,
      },
      {
        id: 2,
        displayName: 'Source Pitch',
        description: 'Amount of change to the reference frequency (octaves)',
        displayUnits: 'semitones',
        intentId: synthNodeTerminalIntents.FREQUENCY_OCTAVES.id,
        exposed: true,
        placeholder: true,
        isOffset: true, // modifies value
        value: 0,
        defaultValue: 0,
      },
      {
        id: 3,
        displayName: 'Phase',
        description: 'Amount of phase shift (cycles, at reference frequency)', // todo: with pitch
        displayUnits: '...0..1...',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        isOffset: true, // modifies value
        value: 0,
        defaultValue: 0,
      },
      {
        id: 4,
        displayName: 'Frequency',
        description: 'Modulates the pitch, like FM (frequency modulation)',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 5,
        displayName: 'Post-mix',
        description: 'Mixes directly before node output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Signal',
        description: 'Link inputs to this output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
    description: 'Generates from a wave source, with optional FM (frequency modulation) and PM (phase modulation)',
  },
  NUMBER: {
    id: 3,
    name: 'Number',
    inputs: [
      {
        id: 1,
        displayName: 'Value',
        description: 'A number',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 0,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Signal',
        description: 'Link inputs to use this number',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
    description: 'A constant number',
  },
    
}
const getNodeTypeById = id => getItemById(synthNodeTypes, id);


// Links 
const assignLink = (nodes, spec) => {
  const newNodes = [ ...structuredClone(nodes) ];

  const { inputNodeId, inputId, targetNodeId, targetOutputId } = spec;
  
  const link = {
    synthNodeId: targetNodeId,
    outputId: targetOutputId,
    debug: spec
  }

  // Set input.link to the new link
  let input;

  const node = newNodes.find(n => n.id == inputNodeId);
  if (node) {
    input = node.inputs.find(i => i.id == inputId);
  }
  if (input) {
    input.link = link;
  }
  return newNodes;
}

// const newSynthNode = newCreator(defaultSynthNode)
const newSynthNode = (nodes = [], nodeTypeId, overrides) => {
  const nodeType = getNodeTypeById(nodeTypeId);
  let id = 1;
  if (nodes.length > 0) {
    const max = Math.max(...nodes.map((item) => item.id));
    if (max < 0) {
      id = 1;
    } else {
      id = max + 1;
    }
  }
  
  if (nodeType) {
    return {
      id,
      nodeTypeId,
      x: 2, // rem
      y: 1, // rem
      w: 11, // rem
      displayName: '',
      inputs: structuredClone(nodeType.inputs),
      outputs: structuredClone(nodeType.outputs),
      ...overrides,
    }
  }
}

// query functons
  
const getNodeDisplayTitle = node => {
  const nodeType = getNodeTypeById(node.nodeTypeId);
  const displayTypeName = nodeType ? `${nodeType.name}` : '';
  return joinItems([ node.displayName, displayTypeName ], ' - ');
}

// processing

const generate = function (nodes, { sampleRate, duration, freq }) {
  // test spec.
  const samples = new Array();
  const sampleFrames = sampleRate * duration;
  const phaseIncNormalized = 2 * Math.PI / sampleRate;

  const pitchUnit = 1 / 12;

  // console.log('generate()');
  // console.table(nodes);
  // initPatch(nodes);
  clearPeakMeters();

  // Generate audio, one channel.
  for (let i = 0; i < sampleFrames; i++) {
    for (let n in nodes) {
      const node = nodes[n];

      // note: `switch (node.nodeTypeId) {}` doesn't work
      if (node.nodeTypeId == synthNodeTypes.GEN_FM.id) {
        const pitch = valueOfInput(node.inputs[1]);
        const frequency = freq * (pitch == 0 ? 1 : Math.pow(2, pitch * pitchUnit));
        const phaseMod = valueOfInput(node.inputs[2]);
        const freqMod = valueOfInput(node.inputs[3]);
        //console.log(`node ${node.id} freqMod`, freqMod, node.inputs[3]);
        const postMix = valueOfInput(node.inputs[4]);

        node.phase = (node.phase || 0) + phaseIncNormalized * frequency * (1 + freqMod);
        node.outputs[0].signal = Math.sin(node.phase + phaseMod) + postMix;

      } else if (node.nodeTypeId == synthNodeTypes.NUMBER.id) {
        node.outputs[0].signal = valueOfInput(node.inputs[0]);

      } else if (node.nodeTypeId == synthNodeTypes.OUTPUT.id) {
        const signal = valueOfInput(node.inputs[0]);
        const gain = valueOfInput(node.inputs[1]);
        const output = signal * gain;
        node.peakMeter = Math.max(node.peakMeter || -Infinity, Math.abs(output));
        samples.push(output); // TODO: a buffer per output node
      }

    }
  }

  finishPatch();

  return {
    sampleFrames,
    samples
  }

  function clearPeakMeters() {
    nodes.forEach(n => {
      delete n.peakMeter;
    });
  }

  function valueOfInput(input) {
    if (input && input.link) {
      const link = input.link; // alias
      if (!link.resolvedOutput) {
        // cache a direct link as resolvedOutput, so we don't need to look up next time.
        const outputSynthNode = nodes.find(n => n.id == link.synthNodeId);
        if (outputSynthNode) {
          link.resolvedOutput = outputSynthNode && outputSynthNode.outputs.find(output => output.id == link.outputId);
        }
      }        
      if (link.resolvedOutput) {
        return link.resolvedOutput.signal || 0;
      } else {
        console.warn('Link failed to resolve, from input:', input);
        return 0;
      }
    } else {
    return input.value || input.defaultValue;
    }
  }


  function finishPatch() { // Remove extra properties created by initPatch()
    for (let nodeIndex in nodes) {
      const node = nodes[nodeIndex];
      delete node.phase;
      for (let inputIndex in node.inputs) {
        delete node.inputs[inputIndex].linkedOutput;
      }
    }
  }
}

const generateFile = function (nodes, spec) {

  var dataview = encodeWAV(
    generate(nodes, spec).samples,
    spec.sampleRate,
    spec.channels
  );

  var audioBlob = new Blob([dataview], { type : 'audio/wav' });
  saveAs(audioBlob, spec.filename + '.wav');
  
  function encodeWAV(buf, sr, ch) {
    var bytesPerSample = 2;
  
    var buffer = new ArrayBuffer(44 + buf.length * ch * bytesPerSample);
    var view = new DataView(buffer);
  
    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
  
    /* file length */
    view.setUint32(4, 32 + buf.length * 2, true);
  
    /* RIFF type */
    writeString(view, 8, 'WAVE');
  
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
  
    /* format chunk length */
    view.setUint32(16, 16, true);
  
    /* sample format (raw) */
    view.setUint16(20, 1, true);
  
    /* channel count */
    view.setUint16(22, 1, true);
  
    /* sample rate */
    view.setUint32(24, sr, true);
  
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sr * 2, true);
  
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
  
    /* bits per sample */
    view.setUint16(34, 16, true);
  
    /* data chunk identifier */
    writeString(view, 36, 'data');
  
    /* data chunk length */
    view.setUint32(40, buf.length * 2, true);
  
    floatTo16BitPCM(view, 44, buf);
  
    return view;
  
    function floatTo16BitPCM(output, offset, input) {
      var bytesPerSample = 2;
      for (var i = 0; i < input.length; i++, offset += bytesPerSample) {
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    }
    
    function writeString(view, offset, string) {
      // TODO: check if this supports Unicode (and does it need to?)
      for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }
    
  }
}

const generateAndPlay = function (nodes, spec) {
  // TODO: use patch data.
  const { duration, channels, sampleRate } = spec;

  // synthesize a buffer
  const output = generate(nodes, spec).samples;

  // allocate audio context
  const audioCtx = new AudioContext();
  
  // allocate audio buffer
  const sampleFrames = duration * sampleRate;
  const myArrayBuffer = audioCtx.createBuffer(channels, sampleFrames, sampleRate);

  // populate buffer
  for (var channel = 0; channel < channels; channel++) {
    var nowBuffering = myArrayBuffer.getChannelData(channel);
    for (var i = 0; i < sampleFrames; i++) {
      nowBuffering[i] = output[i];
    }
  }

  // Play buffer
  var source = audioCtx.createBufferSource();
  source.buffer = myArrayBuffer;
  source.connect(audioCtx.destination);
  source.start();

  // TODO: check if context and buffers need async deallocation

}

export {
  synthNodeTerminalIntents,
  getSynthNodeTerminalIntentsById,
  synthNodeTypes,
  getNodeTypeById,
  getNodeDisplayTitle,
  newSynthNode,
  defaultPatchNodes,
  defaultOutputSpec,
  defaultPatchPerformance,
  getItemById,
  assignLink,

  generateFile,
  generateAndPlay,
}