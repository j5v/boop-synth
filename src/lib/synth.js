import { newCreator } from '../lib/utils.js'
import saveAs from '../lib/FileSaver.js'

const BITDEPTH_16 = 0;

const defaultOutputSpec = {
  sampleRate: 44100, // sps
  duration: 0.1, // seconds
  channels: 1,
  filename: 'FMC 2 - output.wav',
  depth: BITDEPTH_16,

  freq: 440,
  gain: Math.sqrt(2) * 0.5,
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

const generate = function (nodes, { sampleRate, duration, freq, gain }) {
  // test spec.
  var samples = new Array();
  var sampleFrames = sampleRate * duration;
  var fNormalize = 2 * Math.PI * freq / sampleRate;

  initPatch();

  // Generate audio, one channel.
  for (var i = 0; i < sampleFrames; i++) {
    for (var n = 0; n < nodes.length; n++) {
      const node = nodes[n];
      switch (node.nodeTypeId) {
        case synthNodeTypes.GEN_FM.id:
          node.outputs[0].signal = Math.sin(i * fNormalize) * gain;
          break;
        case synthNodeTypes.OUTPUT.id:
          const signal = getSignalLinkedToInput(node.inputs[0]);
          samples.push(signal); // Todo: a buffer per output node
          break;
      }
    }
  }

  return {
    sampleFrames,
    samples
  }

  function getSignalLinkedToInput(input) {
    return  (input && input.linkedOutput && input.linkedOutput.signal) || 0;
  }

  function initPatch() { // resolve link Ids (non-serializable, mutates state, may be lost on next state update)
    for (let nodeIndex in nodes) {
      const node = nodes[nodeIndex];
      for (let inputIndex in node.inputs) {
        // TODO: check input intent
        const input = node.inputs[inputIndex];
        if (input.link) {
          const signalInputLink = input && input.link;
          const outputNode = signalInputLink && nodes.find(n => n.id == signalInputLink.synthNodeId);
          input.linkedOutput = outputNode && outputNode.outputs.find(output => output.id == signalInputLink.outputId);
        }

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