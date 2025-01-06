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
  // TODO: refactor these into Output node and Performance parmaters
  sampleRate: 44100, // sps
  duration: 0.5, // seconds
  channels: 1,
  filenameRoot: 'boop - output',
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

// Synth Node Parameter intents

const synthNodeTerminalIntents = { // draft only
  LEVEL: {
    id: 1,
    name: 'Level',
    classCSS: 'level',
    modulatable: true
  },
  PITCH_OFFSET_OCTAVES: {
    id: 2,
    name: 'Pitch offset',
    units: '+octave',
    classCSS: 'frequency',
    description: 'A pitch change in octaves, relative to the reference frequency. You can enter units here, like 10c for 10 cents, 2d for 2 semitones (12ET), 3:2 or 3/2 for harmonic ratios.',
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
  TIME_SPAN: {
    id: 5,
    name: 'time span',
    units: 'milliseconds',
    classCSS: 'time-span',
    modulatable: true
  },
  DECAY_RATE: {
    id: 6,
    name: 'time span',
    units: 'milliseconds',
    classCSS: 'decay-rate',
    modulatable: true
  },
  TRIGGER: {
    id: 6,
    name: 'trigger',
    units: 'above 0',
    classCSS: 'trigger',
    modulatable: true
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
        displayNameShort: 'In',
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
    nameShort: 'Osc',
    name: 'Oscillator',
    inputs: [
      {
        id: 1,
        displayName: 'Source',
        displayNameShort: 'Src',
        description: 'A waveform or sample',
        intentId: synthNodeTerminalIntents.SOURCE.id,
        exposed: false,
        placeholder: true,
        defaultValue: 1,
      },
      {
        id: 2,
        displayName: 'Pitch offset',
        displayNameShort: 'Pit±',
        description: 'Amount of change to the reference frequency (octaves)',
        displayUnits: 'semitones',
        intentId: synthNodeTerminalIntents.PITCH_OFFSET_OCTAVES.id,
        exposed: true,
        isOffset: true, // modifies value
        defaultValue: 0,
      },
      {
        id: 3,
        displayName: 'Phase mod',
        displayNameShort: 'PM',
        description: 'Amount of phase shift (cycles, at reference frequency)', // todo: with pitch
        displayUnits: '...0..1...',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        isOffset: true, // modifies value
        defaultValue: 0,
      },
      {
        id: 4,
        displayName: 'FM',
        displayNameShort: 'FM',
        description: 'Modulates the pitch, like FM (frequency modulation)',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 5,
        displayName: 'Post-mix',
        displayNameShort: '+',
        description: 'Mixes directly before node output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 0,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Signal',
        displayNameShort: 'Out',
        description: 'Link inputs to this output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
    description: 'Generates from a wave source, with optional FM (frequency modulation) and PM (phase modulation)',
  },
  RING: {
    id: 3,
    nameShort: '×',
    name: 'Multiply/Ring',
    inputs: [
      {
        id: 1,
        displayName: 'Source 1',
        displayNameShort: 'In 1',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 1,
      },
      {
        id: 2,
        displayName: 'Source 2',
        displayNameShort: 'In 2',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 1,
      },
      {
        id: 3,
        displayName: 'Source 3',
        displayNameShort: 'In 3',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 1,
      },
      {
        id: 4,
        displayName: 'Source 4',
        displayNameShort: 'In 4',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 1,
      },
      {
        id: 5,
        displayName: 'Post-mix',
        displayNameShort: '+',
        description: 'Mixes directly before node output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 0,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Signal',
        displayNameShort: 'Out',
        description: 'Link inputs to this output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
    description: 'Multiplies all signals, like digital ring modulation',
  },
  ADD: {
    id: 4,
    nameShort: '+',
    name: 'Add/Mix',
    inputs: [
      {
        id: 1,
        displayName: 'Source 1',
        displayNameShort: 'In 1',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 2,
        displayName: 'Source 2',
        displayNameShort: 'In 2',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 3,
        displayName: 'Source 3',
        displayNameShort: 'In 3',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 0,
      },
      {
        id: 4,
        displayName: 'Source 4',
        displayNameShort: 'In 4',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 0,
      },
      {
        id: 5,
        displayName: 'Gain',
        description: 'Gain for the mixed signal. Less than 1.0 is quieter, more than 1.0 is louder',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 1.0,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Signal',
        displayNameShort: 'Out',
        description: 'Link inputs to this output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
    description: 'Adds all signals',
  },
  SPLICE: {
    id: 5,
    name: 'Splice',
    inputs: [
      {
        id: 1,
        displayName: 'Source pitch',
        description: 'Amount of change to the reference frequency (octaves)',
        displayUnits: 'semitones',
        intentId: synthNodeTerminalIntents.PITCH_OFFSET_OCTAVES.id,
        exposed: true,
        isOffset: true, // modifies value
        defaultValue: 0,
      },
      {
        id: 2,
        displayName: 'Source 1',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: -0.5,
      },
      {
        id: 3,
        displayName: 'Source 2',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0.5,
      },
      {
        id: 4,
        displayName: 'Switch phase',
        description: 'Switches from Source 1 to Source 2 at this phase of the wave cycle',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        value: 0,
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
    description: 'Switches between Source 1 and Source 2, using a switch point at Switch phase (-1 to 1), every cycle at Pitch',
  },
  NUMBER: {
    id: 6,
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
    description: 'A constant number. For most inputs on other nodes, you can enter a number instead of linking. Use this Number node if you want to use the same number more than one input',
  },
  ENVELOPE_WAHDSR: {
    id: 7,
    name: 'Envelope: analog',
    inputs: [
      {
        id: 1,
        displayName: 'Signal',
        description: 'Signal that the envelope scales',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 1,
      },
      {
        id: 2,
        displayName: 'Wait time',
        description: 'Time (millisceonds) the envelope remains at its starting value',
        intentId: synthNodeTerminalIntents.TIME_SPAN.id,
        exposed: false,
        defaultValue: 0,
      },
      {
        id: 3,
        displayName: 'Attack time',
        description: 'Time (millisceonds) the envelope takes to reach a value of 1',
        intentId: synthNodeTerminalIntents.TIME_SPAN.id,
        exposed: false,
        defaultValue: 0.1,
      },
      {
        id: 4,
        displayName: 'Hold time',
        description: 'Time (millisceonds) the envelope remains at a value of 1',
        intentId: synthNodeTerminalIntents.TIME_SPAN.id,
        exposed: false,
        defaultValue: 0,
      },
      {
        id: 5,
        displayName: 'Decay time',
        description: 'Time (millisceonds) the envelope takes to reach halfway towards its Sustain value',
        intentId: synthNodeTerminalIntents.DECAY_RATE.id,
        exposed: false,
        defaultValue: 200,
      },
      {
        id: 6,
        displayName: 'Sustain level',
        description: 'Signal level for Sustain.',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 1,
      },
      {
        id: 7,
        displayName: 'Release time',
        description: 'Time (millisceonds) the envelope takes to reach halfway towards zero',
        intentId: synthNodeTerminalIntents.DECAY_RATE.id,
        exposed: false,
        defaultValue: 200,
      },
      {
        id: 8,
        displayName: 'Retrigger',
        description: 'Restarts at the attack phase, when Retrigger becomes positive',
        intentId: synthNodeTerminalIntents.TRIGGER.id,
        exposed: false,
        defaultValue: 0,
        placeholder: true,
      },
      {
        id: 9,
        displayName: 'Amp',
        description: 'Scales the node output, same effect as Signal',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 1,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Signal',
        description: 'Envelope output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
    description: 'An analog-style envelope, using \'Sustain time\' in Performance properties',
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

const stagesWAHDSR = {
  WAIT: 1,
  ATTACK: 2,
  HOLD: 3,
  DECAY: 4,
  SUSTAIN: 5,
  RELEASE: 6
}

const generate = function (
  nodes,
  { sampleRate, duration, freq, sustainReleaseTime = 0 }
) {
  const samples = new Array();
  const sampleFrames = sampleRate * duration;
  const PI = Math.PI;
  const TAU = PI * 2;

  const phaseIncNormalized = 2 * Math.PI / sampleRate;
  const sampleCountToMs = 1000 / sampleRate;
  const msToSampleCount = sampleRate * 0.001;

  const pitchUnit = 1; // 1 = octaves. Semitones would be 1/12

  // console.log('generate()');
  // console.table(nodes);
  initPatch(nodes);
  clearPeakMeters();

  const debugEnv = [];

  // Generate audio, one channel.
  for (let i = 0; i < sampleFrames; i++) {
    for (let n in nodes) {
      const node = nodes[n];
      const inputSignals = valuesOfInputs(node);

      // note: `switch (node.nodeTypeId) {}` doesn't work
      if (node.nodeTypeId == synthNodeTypes.GEN_FM.id) {
        const [ source, pitch, phaseMod, freqMod, postMix ] = inputSignals;
        const frequency = freq * (pitch == 0 ? 1 : Math.pow(2, pitch * pitchUnit));

        node.phase = (node.phase || 0) + phaseIncNormalized * frequency * (1 + freqMod);
        node.outputs[0].signal = Math.sin(node.phase + phaseMod * TAU) + postMix;

      } else if (node.nodeTypeId == synthNodeTypes.NUMBER.id) {
        node.outputs[0].signal = valueOfInput(node.inputs[0]);

      } else if (node.nodeTypeId == synthNodeTypes.ENVELOPE_WAHDSR.id) {
        const [ signal, waitTime, attackTime, holdTime, decayTime, sustainLevel, releaseTime, retrigger, amp ] = inputSignals;

        // if (i==0) {
        //   console.log({sustainReleaseTime});
        //   console.log({signal, waitTime, attackTime, holdTime, decayTime, sustainLevel, releaseTime, retrigger, amp});
        // }

        node.env = node.env || {
          stage: stagesWAHDSR.WAIT,
          timeMs: 0,
          startTime: 0,
          previousEnvOutValue: 0,
        };
        const env = node.env;

        env.outValue = 0;

        env.previousTrigger = env.previousTrigger || 0;
        if (env.previousTrigger <= 0 && retrigger > 0) {
          env.startTime = env.timeMs;
          env.stage = stagesWAHDSR.WAIT;
        }

        switch (env.stage) {
          // For zero-duration stages, flow can slip into the next stage on the same iteration.
          // Note selective use of `break`

          case stagesWAHDSR.WAIT:
            if (env.timeMs >= waitTime) {
              env.stage = stagesWAHDSR.ATTACK;
              env.startAttackTimeMs = env.timeMs;
              env.previousEnvOutValue = Math.min(1, env.previousEnvOutValue);
            } else break;

          case stagesWAHDSR.ATTACK:
            if (env.timeMs >= env.startAttackTimeMs + attackTime || env.timeMs >= sustainReleaseTime) {
              env.stage = stagesWAHDSR.HOLD;
              env.startHoldTimeMs = env.timeMs;
            } else {
              const attackTimeAsSamples = attackTime * msToSampleCount;
              const logOf2 = Math.log(2);
              const attackFactor = logOf2 / attackTimeAsSamples;
              env.outValue = Math.min(1, env.previousEnvOutValue + (1 - env.previousEnvOutValue) * attackFactor * 8);
              break;
            }

          case stagesWAHDSR.HOLD:
            env.outValue = 1;
            if (env.timeMs >= env.startHoldTimeMs + holdTime || env.timeMs >= sustainReleaseTime) {
              env.stage = stagesWAHDSR.DECAY;
              env.startDecayTimeMs = env.timeMs;
            } else {
              break;
            }

          case stagesWAHDSR.DECAY:
            // `decayTime`: Time (millisceonds) the envelope takes to reach halfway towards `sustainLevel`.
            // The envelope converges on, but does not reach, `sustainLevel`, so there is no SUSTAIN stage.
            if (env.timeMs >= sustainReleaseTime) {
              env.stage = stagesWAHDSR.RELEASE;
            } else {
              const decayTimeAsSamples = decayTime * msToSampleCount;
              const decayFactor = 1 - Math.pow(0.5, 1 / decayTimeAsSamples);
              env.outValue = env.previousEnvOutValue - (env.previousEnvOutValue - sustainLevel) * decayFactor;
              break;
            }

          case stagesWAHDSR.RELEASE:
            const releaseTimeAsSamples = releaseTime * msToSampleCount;
            const releaseFactor = Math.pow(0.5, 1 / releaseTimeAsSamples);
            env.outValue = env.previousEnvOutValue * releaseFactor;
            break;
        }

        env.previousEnvOutValue = env.outValue;

        env.outValue *= signal * amp;

        env.previousTrigger = env.retrigger;
        env.timeMs += sampleCountToMs;

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
  getItemById,
  assignLink,

  generateFile,
  generateAndPlay,
}