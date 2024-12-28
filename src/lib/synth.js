import { newCreator } from '../lib/utils.js'
import saveAs from '../lib/FileSaver.js'

const BITDEPTH_16 = 0;

const defaultOutputSpec = {
  sampleRate: 44100, // sps
  duration: 0.1, // seconds
  channels: 1,
  filename: 'FMC 2 - output.wav',
  depth: BITDEPTH_16,

  freq: 440 * Math.pow(2, -9/12), // C below concert pitch A
  gain: Math.sqrt(2) * 0.5,
}
const defaultPatchPerformance = {
  baseFreq: 440 * Math.pow(2, -9/12), // C below concert pitch A
  baseNoteMIDI: 60
}

// Synth Node Parameter intents

const synthNodeTerminalIntents = { // draft only
  LEVEL: {
    id: 1,
    name: 'Level',
    classCSS: 'terminal-level',
    modulatable: true
  },
  FREQUENCY_OCTAVES: {
    id: 2,
    name: 'Frequency',
    units: '+octave',
    classCSS: 'terminal-frequency',
    modulatable: true
  },
  SOURCE: {
    id: 3,
    name: 'Source',
    units: 'choice',
    classCSS: 'terminal-source',
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
  MOCK: {
    id: 0,
    name: 'Test'
  },
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
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 1.0,
      }
    ],
    outputs: [],
  },
  GEN_FM: {
    id: 2,
    name: 'FM',
    inputs: [
      {
        id: 1,
        displayName: 'Carrier Source',
        intentId: synthNodeTerminalIntents.SOURCE.id,
        exposed: false,
        defaultValue: 1,
      },
      {
        id: 2,
        displayName: 'Carrier Pitch',
        displayUnits: 'semitones',
        intentId: synthNodeTerminalIntents.FREQUENCY_OCTAVES.id,
        exposed: true,
        isOffset: true, // modifies value
        value: 0,
        defaultValue: 0,
      },
      {
        id: 3,
        displayName: 'Phase',
        displayUnits: '...0..1...',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        isOffset: true, // modifies value
        value: 0,
        defaultValue: 0,
      },
      {
        id: 4,
        displayName: 'Modulator',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 5,
        displayName: 'Post-mix',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Signal',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
  },
  NUMBER: {
    id: 3,
    name: 'Number',
    inputs: [
      {
        id: 1,
        displayName: 'Value',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 0,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Signal',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
  },
    
}

const defaultSynthNode = {
  defaultObject: {
    x: 2, // rem
    y: 1, // rem
    w: 11, // rem
    nodeTypeId: synthNodeTypes.GEN_FM.id,
    displayName: 'Node',
    inputs: [ ...synthNodeTypes.GEN_FM.inputs ],
    output: [ ...synthNodeTypes.GEN_FM.outputs ]
  }
}

const newSynthNode = newCreator(defaultSynthNode)

// Default fragments for init state
const defaultPatchNodes = [ 
  newSynthNode.newObject({
    outputs: [ ...synthNodeTypes.GEN_FM.outputs ],
  }),
  newSynthNode.newObject({
    nodeTypeId: synthNodeTypes.OUTPUT.id,
    x: 16,
    y: 9,
    inputs: [ ...synthNodeTypes.OUTPUT.inputs ]
  }),
];

// add a link
defaultPatchNodes[1].inputs[0].link = {
  synthNodeId: defaultPatchNodes[0].id,
  outputId: 1
}

// query functons
const getItemById = (list, id) => {
  let foundItem;
  for (let key in list) {
    if (list[key].id == id) {
      foundItem = list[key];
      break;
    }
  }
  return foundItem;
}

const getNodeTypeById = id => getItemById(synthNodeTypes, id);
  

// processing

const generate = function (nodes, { sampleRate, duration, freq, gain }) {
  // test spec.
  const samples = new Array();
  const sampleFrames = sampleRate * duration;
  const phaseIncNormalized = 2 * Math.PI / sampleRate;

  const pitchUnit = 1 / 12;

  initPatch();

  // Generate audio, one channel.
  for (var i = 0; i < sampleFrames; i++) {
    for (var n = 0; n < nodes.length; n++) {
      const node = nodes[n];
      switch (node.nodeTypeId) {
        case synthNodeTypes.NUMBER.id:
          node.outputs[0].signal = node.inputs[0].value || node.inputs[0].defaultValue;
          break;
        case synthNodeTypes.GEN_FM.id:

          const pitch = valueOfInput(node.inputs[1]);
          const frequency = freq * (pitch == 0 ? 1 : Math.pow(2, pitch * pitchUnit));
          const phaseMod = valueOfInput(node.inputs[2]);
          const freqMod = valueOfInput(node.inputs[3]);
          const postMix = valueOfInput(node.inputs[4]);

          node.phase = (node.phase || 0) + phaseIncNormalized * frequency * (1 + freqMod);
          node.outputs[0].signal = Math.sin(node.phase + phaseMod) + postMix;

          break;

        case synthNodeTypes.OUTPUT.id:
          const signal = valueOfInput(node.inputs[0]);
          samples.push(signal * gain); // TODO: a buffer per output node
          break;
      }
    }
  }

  finishPatch();

  return {
    sampleFrames,
    samples
  }

  function valueOfInput(input) {
    return input && input.link ?
      (input.linkedOutput && input.linkedOutput.signal) || 0 :
      (input.value || input.defaultValue);
  }

  function initPatch() { // resolve link Ids (non-serializable, mutates state, may be lost on next state update)
    for (let nodeIndex in nodes) {
      const node = nodes[nodeIndex];
      // node.synthState = {};
      for (let inputIndex in node.inputs) {
        const input = node.inputs[inputIndex];
        if (input.link) {
          const signalInputLink = input && input.link;
          const outputNode = signalInputLink && nodes.find(n => n.id == signalInputLink.synthNodeId);
          input.linkedOutput = outputNode && outputNode.outputs.find(output => output.id == signalInputLink.outputId);
        }
      }
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
  saveAs(audioBlob, spec.filename);
  
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
  newSynthNode,
  defaultSynthNode,
  defaultPatchNodes,
  defaultOutputSpec,
  defaultPatchPerformance,
  getItemById,

  generateFile,
  generateAndPlay,
}