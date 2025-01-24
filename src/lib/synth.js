import { synthNodeTypes, getNodeTypeById } from '../lib/synthNodeTypes.js'
import { sourceTypeGroups } from '../lib/sourceTypeGroups.js'
import { sourceFunctions } from '../lib/sourceFunctions.js'
import { initEnvelope, processEnvelope } from '../nodeTypes/synthEnvelopeAnalog.js'
import { getWaveshaperFunctionById } from './waveshaperFunctions.js'
import { getDefaultInput } from './synthGraphUtils.js'

import { writeFile, playAudio } from './synthGraphIO.js'
import { clearPeakMeters, cleanPatch, valueOfInput } from './synthGraphUtils.js'


const generate = function (params) {
  const { nodes, perf, boop } = params;
  const { sampleRate = 44100, duration = 0.5, freq, sustainReleaseTime = 0 } = (perf || {});

  boop.defaultBoopState.outputBuffers = [];
  const outputBuffers = boop.defaultBoopState.outputBuffers;

  const sampleFrames = sampleRate * duration;
  const phaseIncNormalized = 1 / sampleRate;
  const PI = Math.PI;
  const TAU = PI * 2;

  initPatch(nodes);
  clearPeakMeters(nodes);

  // Generate audio, one channel.
  for (let i = 0; i < sampleFrames; i++) {
    for (let n in nodes) {
      const node = nodes[n];
      const inputSignals = valuesOfInputs(node, nodes);
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

      } else if (nodeTypeId == synthNodeTypes.DELAY.id) {
        const [ signal, isAbsoluteDelay, sizeOctaves, sizeTime, delayOctaves, delayTime, replayPitch, latencyComp, subsample, crossfade ] = inputSignals;
        // todo: algorithm
        node.outputs[0].signal = signal;

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

  
  function valuesOfInputs(node, nodes) {
    return node.inputs.map(i => valueOfInput(i, node, nodes));
  }

  function initPatch(nodes) { // call before generate()
    cleanPatch(nodes);

    let id = 1;

    nodes.forEach(node => {

      // Initialize output buffers
      if (node.nodeTypeId == synthNodeTypes.OUTPUT.id) {

        const [ forget, forget2, filenamePart ] = valuesOfInputs(node, nodes);

        const newBuffer = {
          id: id++,
          nodeId: node.id,
          filenamePart,
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
          const nodeTypeInput = getDefaultInput(node, input);
          input.value = nodeTypeInput.defaultValue !== undefined ? nodeTypeInput.defaultValue : 0;
        }
      })

    });

  }

  function finishPatch() {
    cleanPatch(nodes);
  } 
}

const generateFile = function (params) {
  const output = generate(params);
  writeFile(output.outputBuffers, params.perf);
}

const generateAndPlay = function (params) {
  const output = generate(params);
  playAudio(output.outputBuffers, params.perf);
}

export {
  generate,
  generateFile,
  generateAndPlay,
}