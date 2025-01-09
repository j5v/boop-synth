import { names } from './appInfo.js'
import { joinItems } from './utils.js'
import { synthNodeTerminalIntents, getSynthNodeTerminalIntentsById } from '../lib/synthNodeIntents.js'
import { synthNodeTypes, getNodeTypeById } from '../lib/synthNodeTypes.js'
import { initEnvelope, processEnvelope } from '../lib/synthEnvelopeAnalog.js'
import saveAs from '../lib/FileSaver.js'

const BITDEPTH_16 = 0;

const defaultOutputSpec = {
  // TODO: refactor these into Output node and Performance parmaters
  sampleRate: 44100, // sps
  duration: 0.5, // seconds
  channels: 1,
  filenameRoot: `${names.appName} - output`,
  sustainReleaseTime: 400, // ms
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

const generate = function (
  nodes,
  { sampleRate, duration, freq, sustainReleaseTime = 0 }
) {
  const samples = new Array();
  const sampleFrames = sampleRate * duration;
  const PI = Math.PI;
  const TAU = PI * 2;

  const phaseIncNormalized = 2 * Math.PI / sampleRate;

  const pitchUnit = 1; // 1 = octaves. Semitones would be 1/12

  initPatch(nodes);
  clearPeakMeters();

  // Generate audio, one channel.
  for (let i = 0; i < sampleFrames; i++) {
    for (let n in nodes) {
      const node = nodes[n];
      const inputSignals = valuesOfInputs(node);

      if (node.nodeTypeId == synthNodeTypes.GEN_FM.id) {
        const [ source, pitch, phaseMod, freqMod, postMix ] = inputSignals;
        const frequency = freq * (pitch == 0 ? 1 : Math.pow(2, pitch * pitchUnit));

        node.phase = (node.phase || 0) + phaseIncNormalized * frequency * (1 + freqMod);
        const ph = node.phase + phaseMod * TAU;
        node.outputs[0].signal = Math.sin(ph) + postMix;

      } else if (node.nodeTypeId == synthNodeTypes.NUMBER.id) {
        node.outputs[0].signal = valueOfInput(node.inputs[0]);

      } else if (node.nodeTypeId == synthNodeTypes.ENVELOPE_WAHDSR.id) {
        const env = node.env;
        processEnvelope(env, inputSignals, sampleRate); // mutates env
        node.outputs[0].signal = env.outValue;

      } else if (node.nodeTypeId == synthNodeTypes.RING.id) {
        const [ signal1, signal2, signal3, signal4, postMix ] = inputSignals;
        node.outputs[0].signal = signal1 * signal2 * signal3 * signal4 + postMix;

      } else if (node.nodeTypeId == synthNodeTypes.ADD.id) {
        const [ signal1, signal2, signal3, signal4, gain ] = inputSignals;
        node.outputs[0].signal = (signal1 + signal2 + signal3 + signal4) * gain;

      } else if (node.nodeTypeId == synthNodeTypes.SPLICE.id) {
        const [ pitch, signal1, signal2, switchPhase ] = inputSignals;
        
        const frequency = freq * (pitch == 0 ? 1 : Math.pow(2, pitch * pitchUnit));
        node.phase = (node.phase || 0) + (phaseIncNormalized * frequency);
        const phasePos = node.phase % (phaseIncNormalized * frequency);

        node.outputs[0].signal = (switchPhase > phasePos) ? signal1 : signal2;

      } else if (node.nodeTypeId == synthNodeTypes.OUTPUT.id) {
        const [ signal, gain ] = inputSignals;
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
    if (input && input.link && input.link.synthNodeId) {
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
    return input.value != undefined ? input.value : 
      input.defaultValue != undefined ? input.defaultValue : 0;
    }
  }

  function valuesOfInputs(node) {
    return node.inputs.map(i => valueOfInput(i));
  }

  function cleanPatch() {  // Remove extra properties and direct object refs
    for (let nodeIndex in nodes) {
      const node = nodes[nodeIndex];
      node.nodeTypeId = parseInt(node.nodeTypeId); // TODO: test if needed
      delete node.env;
      delete node.phase;
      for (let inputIndex in node.inputs) {
        const input = node.inputs[inputIndex];
        if (input.link) {
          delete input.link.resolvedOutput;
        }
      }
    }
  }

  function initPatch() {
    cleanPatch();
    for (let n in nodes) {
      const node = nodes[n];
      if (node.nodeTypeId == synthNodeTypes.ENVELOPE_WAHDSR.id) {
        initEnvelope(node, sustainReleaseTime);
      }
    }
  }

  function finishPatch() {
    cleanPatch();
  } 
}

const generateFile = function (nodes, spec) {

  var dataview = encodeWAV(
    generate(nodes, spec).samples,
    spec.sampleRate,
    spec.channels
  );

  var audioBlob = new Blob([dataview], { type : 'audio/wav' });
  saveAs(audioBlob, spec.filenameRoot + '.wav');
  
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
  assignLink,

  generateFile,
  generateAndPlay,
}