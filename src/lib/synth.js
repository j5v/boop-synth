import { synthNodeTypes, getNodeTypeById } from '../lib/synthNodeTypes.js'
import { sourceTypeGroups } from '../lib/sourceTypeGroups.js'
import { sourceFunctions } from '../lib/sourceFunctions.js'
import { initEnvelope, processEnvelope } from '../nodeTypes/synthEnvelopeAnalog.js'
import { getItemById } from './utils.js'
import { encodeWAV } from './wav.js'
import saveAs from '../lib/FileSaver.js'
import { getWaveshaperFunctionById } from './waveshaperFunctions.js'


const generate = function (params) {
  const { nodes, perf, boop } = params;
  const { sampleRate, duration, freq, sustainReleaseTime = 0 } = (perf || {});

  boop.defaultBoopState.outputBuffers = [];
  const outputBuffers = boop.defaultBoopState.outputBuffers;

  const sampleFrames = sampleRate * duration;
  const phaseIncNormalized = 1 / sampleRate;
  const PI = Math.PI;
  const TAU = PI * 2;

  initPatch(nodes);
  clearPeakMeters();

  // Generate audio, one channel.
  for (let i = 0; i < sampleFrames; i++) {
    for (let n in nodes) {
      const node = nodes[n];
      const inputSignals = valuesOfInputs(node);
      const nodeTypeId = node.nodeTypeId;

      if (nodeTypeId == synthNodeTypes.GEN_FM.id) {
        const [ sourceType, pitch, phaseMod, freqMod, postMix, fixedFreq, isFixedFreq, sourceFn ] = inputSignals;

        const frequency = isFixedFreq ?
          fixedFreq :
          (freq * (pitch == 0 ? 1 : Math.pow(2, pitch)));

        const ph = node.phase + phaseMod * TAU;
        if (sourceType == sourceTypeGroups.FUNCTION.id) {
          switch (sourceFn) {
            case sourceFunctions.SINE.id:
              node.outputs[0].signal = Math.sin(ph * TAU) + postMix;
              break;
            case sourceFunctions.SAW.id:
              node.outputs[0].signal = ph % 1 * -2 + 1 + postMix;
              break;
            case sourceFunctions.SQUARE.id:
              node.outputs[0].signal = ((ph % 1) > 0.5 ? -1 : 1) + postMix;
              break;
            case sourceFunctions.TRIANGLE.id:
              node.outputs[0].signal = (Math.abs(1 - (ph * 2) % 2)) * 2 - 1 + postMix;
              break;
          }
        }
        node.phase = node.phase + phaseIncNormalized * frequency * (1 + freqMod);

      } else if (nodeTypeId == synthNodeTypes.NUMBER.id) {
        node.outputs[0].signal = inputSignals[0];

      } else if (nodeTypeId == synthNodeTypes.ENVELOPE_WAHDSR.id) {
        const env = node.env;
        processEnvelope(env, inputSignals, sampleRate); // mutates env
        node.outputs[0].signal = env.outValue;

      } else if (nodeTypeId == synthNodeTypes.RING.id) {
        const [ signal1, signal2, signal3, signal4, postMix ] = inputSignals;
        node.outputs[0].signal = signal1 * signal2 * signal3 * signal4 + postMix;

      } else if (nodeTypeId == synthNodeTypes.ADD.id) {
        const [ signal1, signal2, signal3, signal4, gain ] = inputSignals;
        node.outputs[0].signal = (signal1 + signal2 + signal3 + signal4) * gain;

      } else if (nodeTypeId == synthNodeTypes.SPLICE.id) {
        const [ pitch, signal1, signal2, switchPhase ] = inputSignals;
        
        const frequency = freq * (pitch == 0 ? 1 : Math.pow(2, pitch));
        const phasePos = node.phase % (phaseIncNormalized * frequency);
        node.phase = node.phase + (phaseIncNormalized * frequency);

        node.outputs[0].signal = (switchPhase > phasePos) ? signal1 : signal2;

      } else if (nodeTypeId == synthNodeTypes.MAPPER.id) {
        const [ signal, inMin, inMax, outMin, outMax, preAmp, offset, threshold, shaperId, doClipInput, doClipOutput ] = inputSignals;

        let sig = signal; // Mutate this through the signal path of the waveshaper.

        if (doClipInput)
          sig = Math.min(Math.max(sig, inMin), inMax);

        // Scale input from inMin..inMax to -1..1
        if ((inMin !== -1 && inMax !== 1) && (inMax - inMin) !== 0)
          sig = (sig - inMin) * 2 / (inMax - inMin) - 1;

        // Pre-amp (gain) and offset (bias)
        sig = sig * preAmp + offset;

        // Threshold
        if (threshold !== 0)
          if (Math.abs(sig) > Math.abs(threshold)) {
            sig = sig - threshold * Math.sign(sig);
          } else if (threshold > 0) {
            sig = 0;
          } else {
            sig = threshold;
          }

        // Waveshaper
        // TODO: optimize later
        const ws = getWaveshaperFunctionById(shaperId);
        // @ts-ignore
        if (ws) sig = ws.fn(sig);

        // Scale output from -1..1 to outMin..outMax
        sig = (sig + 1) * (outMax - outMin) * 0.5 + outMin

        // Clip output
        if (doClipOutput)
          sig = Math.min(Math.max(sig, outMin), outMax);

        node.outputs[0].signal = sig;

      } else if (nodeTypeId == synthNodeTypes.NOISE.id) {
        const [ freqSH, min, max ] = inputSignals;
        node.prevPhase = node.phase;
        node.phase = node.phase + (phaseIncNormalized * freqSH);
        if (Math.floor(node.prevPhase) !== Math.floor(node.phase)) {
          node.outputs[0].signal = Math.random() * (max - min) + min;
        }

      } else if (nodeTypeId == synthNodeTypes.OUTPUT.id) {
        const [ signal, gain ] = inputSignals;
        const output = signal * gain;
        node.peakMeter = Math.max(node.peakMeter || -Infinity, Math.abs(output));
        node.buffer.samples.push(output);
      }

    }
  }

  finishPatch();
  
  return {
    sampleFrames,
    outputBuffers
  }

  function clearPeakMeters() {
    nodes.forEach(n => {
      delete n.peakMeter;
    });
  }

  function valueOfInput(input, node) {
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

      if (input.value != undefined)
        return input.value;

      const nodeType = getNodeTypeById(node.nodeTypeId);
      const nodeTypeInput = getItemById(nodeType.inputs, input.id); // get matching input in synthNodeTypes
      return nodeTypeInput.defaultValue !== undefined ? nodeTypeInput.defaultValue : 0;
    }
  }

  function valuesOfInputs(node) {
    return node.inputs.map(i => valueOfInput(i, node));
  }

  function cleanPatch() {  // Remove extra properties and direct object refs
    for (let nodeIndex in nodes) {
      const node = nodes[nodeIndex];
      delete node.env;
      delete node.phase;
      delete node.buffer; // but retain node.buffer.id

      node.inputs.forEach(input => {
        if (input.link) {
          delete input.link.resolvedOutput;
        }
      });

      node.outputs.forEach(output => {
        delete output.signal;
      });

    }
  }

  function initPatch(nodes) { // call before generate()
    cleanPatch();

    let id = 1;

    nodes.forEach(node => {

      // initialize output buffers
      if (node.nodeTypeId == synthNodeTypes.OUTPUT.id) {
        const newBuffer = {
          id: id++,
          nodeId: node.id,
          samples: []
        };
        outputBuffers.push(newBuffer);

        node.bufferId = newBuffer.id;

        // fast access in generate(). non-serializable; delete reference in finishPatch()
        node.buffer = newBuffer; 
      }

      // misc
      node.phase = 0;

      // initialize envelope nodes
      if (node.nodeTypeId == synthNodeTypes.ENVELOPE_WAHDSR.id) {
        initEnvelope(node, sustainReleaseTime);
      }

      // order inputs by id. This ensures the list is predictable when destructured in the synth.
      node.inputs.sort((a, b) => a.id - b.id);

      // optimization: force input[].value to avoid expensive lookups to nodeType
      node.inputs.forEach(input => {
        if (input.value === undefined) {
          const nodeType = getNodeTypeById(node.nodeTypeId);
          const nodeTypeInput = getItemById(nodeType.inputs, input.id); // get matching input in synthNodeTypes
          input.value = nodeTypeInput.defaultValue !== undefined ? nodeTypeInput.defaultValue : 0;
        }
      })

    });

  }

  function finishPatch() {
    cleanPatch();
  } 
}

const generateFile = function (params) {

  const output = generate(params);

  const { channels, sampleRate, filenameRoot } = params.perf;

  for (let outputBufferIndex in output.outputBuffers) {
    const samples = output.outputBuffers[outputBufferIndex].samples;

    const dataview = encodeWAV(
      samples,
      sampleRate,
      channels
    );

    const audioBlob = new Blob([dataview], { type : 'audio/wav' });
    saveAs(audioBlob, filenameRoot + '.wav');
  }
}

const generateAndPlay = function (params) {

  // synthesize a buffer
  const output = generate(params);

  // TODO: use patch data.
  const { duration, channels, sampleRate } = params.perf;

  for (let outputBufferIndex in output.outputBuffers) {

    const samples = output.outputBuffers[outputBufferIndex].samples;

    const audioCtx = new AudioContext();
    
    // Allocate audio buffer. Fractional sample at end is rendered as a whole sample.
    const sampleFrames = duration * sampleRate;
    const myArrayBuffer = audioCtx.createBuffer(channels, sampleFrames, sampleRate);

    // Populate audio buffer
    for (let channel = 0; channel < channels; channel++) {
      const nowBuffering = myArrayBuffer.getChannelData(channel);
      for (let i = 0; i < sampleFrames; i++) {
        nowBuffering[i] = samples[i];
      }
    }

    // Play audiio buffer
    const source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(audioCtx.destination);
    source.start();

  }
  // TODO: check if context and buffers need async deallocation

}

export {
  generate,
  generateFile,
  generateAndPlay,
}