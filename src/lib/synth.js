import { newCreator } from '../lib/utils.js'
import saveAs from '../lib/FileSaver.js'

const BITDEPTH_16 = 0;

const defaultOutputSpec = {
  sps: 44100,
  channels: 1,
  depth: BITDEPTH_16,
  length: 22050,
  gain: Math.sqrt(2) * 0.5
}
const defaultPatchPerformance = {
  baseFreq: 440 * Math.pow(2, -9/12), // C below concert pitch A
  baseNoteMIDI: 60
}

// Synth Node Parameter intents

const synthNodeTerminalIntents = { // draft only
  LEVEL: { id: 0, name: 'Level', classCSS: 'terminal-level', modulatable: true },
  FREQUENCY: { id: 1, name: 'Frequency', classCSS: 'terminal-frequency', modulatable: false },
  SOURCE: { id: 2, name: 'Source', classCSS: 'terminal-source', modulatable: false },
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
        displayName: 'Carrier Frequency',
        intentId: synthNodeTerminalIntents.FREQUENCY.id,
        exposed: false,
        defaultValue: 1,
      },
      {
        id: 3,
        displayName: 'Modulator',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 4,
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

const testSpec = {
  sampleRate: 44100, // sps
  duration: 0.25, // seconds
  freq: 440,
  gain: Math.sqrt(2) * 0.5,
  channels: 1,
  filename: 'FMC 2 - test 1.wav',
}

const generate = function ({ sampleRate, duration, freq, gain }) {
  // test spec.
  var samples = new Array();
  var sampleFrames = sampleRate * duration;
  var fNormalize = 2 * Math.PI * freq / sampleRate;

  // Generate audio, one channel.
  for (var i = 0; i < sampleFrames; i++) {
    samples.push(Math.sin(i * fNormalize) * gain);
  }

  return {
    sampleFrames,
    samples
  }
}

const generateFile = function () {

  var dataview = encodeWAV(
    generate(testSpec).samples,
    testSpec.sampleRate,
    testSpec.channels
  );

  var audioBlob = new Blob([dataview], { type : 'audio/wav' });
  saveAs(audioBlob, testSpec.filename);
  
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

const generateAndPlay = function () {
  // TODO: use patch data.
  const { duration, rate, channels, sampleRate } = testSpec;

  // synthesize a buffer
  const output = generate(testSpec).samples;

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