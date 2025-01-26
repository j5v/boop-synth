import { synthNodeTerminalIntents } from '../lib/synthNodeIntents.js'
import { sourceTypeGroups } from '../lib/sourceTypeGroups.js'
import { getItemById } from '../lib/utils.js'
import { synthNodeVisualizationTypes } from './synthNodeVisualizationTypes.js'

const synthNodeTypes = {
  GEN_FM: {
    id: 2,
    name: 'Oscillator',
    nameShort: '~',
    description: 'Generates from a wave source, with optional FM (frequency modulation) and PM (phase modulation)',
    inputs: [
      {
        id: 1,
        order: 1,
        displayName: 'Source',
        displayNameShort: 'Src',
        description: 'A shape, waveform, or sample',
        intentId: synthNodeTerminalIntents.SOURCE_TYPE_GROUP.id,
        isParam: true,
        defaultValue: sourceTypeGroups.FUNCTION.id,
      },
      {
        id: 2,
        order: 12,
        displayName: 'Pitch offset',
        displayNameShort: 'Pit±',
        description: 'Amount of change to the reference frequency (octaves)',
        displayUnits: 'semitones',
        intentId: synthNodeTerminalIntents.PITCH_OFFSET_OCTAVES.id,
        onlyShowIf: { inputId: 7, hasValue: false },
        defaultValue: 0,
      },
      {
        id: 6,
        order: 13,
        displayName: 'Fixed frequency',
        displayNameShort: 'Ff',
        description: 'Absolute frequency, not affected by reference frequency',
        onlyShowIf: { inputId: 7, hasValue: true },
        displayUnits: 'Hz',
        intentId: synthNodeTerminalIntents.FREQUENCY_ABSOLUTE.id,
        defaultValue: 440,
      },
      {
        id: 7,
        order: 14,
        displayName: 'Fixed frequency',
        displayNameShort: 'Ff?',
        description: 'When enabled, use "Fixed frequency" input. Otherwise, use "Pitch offset"',
        displayUnits: 'On or off',
        isParam: true,
        intentId: synthNodeTerminalIntents.CHECK_BOOL.id,
        defaultValue: false,
      },
      {
        id: 3,
        order: 15,
        displayName: 'Phase mod',
        displayNameShort: 'PM',
        description: 'Amount of phase shift (cycles, at reference frequency)', // todo: with pitch
        displayUnits: '...0..1...',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        defaultValue: 0,
      },
      {
        id: 4,
        order: 16,
        displayName: 'FM',
        displayNameShort: 'FM',
        description: 'Modulates the pitch, like FM (frequency modulation)',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 5,
        order: 20,
        displayName: 'Post-mix',
        displayNameShort: '+',
        description: 'Mixes directly before node output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 10,
        order: 2,
        displayName: 'Shape',
        displayNameShort: 'Sh',
        description: 'A function that creates a wave shape',
        intentId: synthNodeTerminalIntents.SOURCE_TYPE_FUNCTION.id,
        onlyShowIf: { inputId: 1, hasValue: sourceTypeGroups.FUNCTION.id },
        isParam: true,
        defaultValue: 1,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Out',
        displayNameShort: 'Out',
        description: 'Link inputs to this output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
  },
  NOISE: {
    id: 8,
    name: 'Noise',
    nameShort: 'Nse',
    description: 'A random number, changing at S/H rate',
    inputs: [
      {
        id: 1,
        displayName: 'S/H rate',
        description: 'Double the highest frequency it can generate.',
        intentId: synthNodeTerminalIntents.FREQUENCY_ABSOLUTE.id,
        exposed: false,
        defaultValue: 22050,
      },
      {
        id: 2,
        displayName: 'Min signal',
        description: 'Minimum value',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: -1,
      },
      {
        id: 3,
        displayName: 'Max signal',
        description: 'Maximum value',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 1,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Out',
        description: 'Link inputs to use this number',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
  },
  OUTPUT: {
    id: 1,
    name: 'Output',
    nameShort: 'Out',
    description: 'Collects a signal to be the output for the graph',
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
        defaultValue: 0.125,
      },
      {
        id: 3,
        displayName: 'Filename part',
        description: 'Added into your project name, to make up a filename',
        intentId: synthNodeTerminalIntents.FILENAME_PART.id,
        isParam: true,
        defaultValue: 'output',
      },
    ],
    outputs: [],
    visualizations: [
      synthNodeVisualizationTypes.WAVEFORM.id
    ],
  },
  MAPPER: {
    id: 9,
    name: 'Shaper Map',
    nameShort: 'Map',
    description: 'A waveshaper that changes the range of a signal, and its shape.',
    inputs: [
      {
        id: 1,
        displayName: 'Signal',
        description: 'Input to shape',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 11,
        displayName: 'In min',
        description: 'Input range, minimum',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        defaultValue: -1,
      },
      {
        id: 12,
        displayName: 'In max',
        description: 'Input range, maximum',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        defaultValue: 1,
      },
      {
        id: 13,
        displayName: 'Out min',
        description: 'Output range, minimum',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        defaultValue: -1,
      },
      {
        id: 14,
        displayName: 'Out max',
        description: 'Output range, maximum',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        defaultValue: 1,
      },
      {
        id: 20,
        displayName: 'Pre-amp',
        description: 'Gain, after input, before shaping',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        defaultValue: 1,
      },
      {
        id: 21,
        displayName: 'Offset',
        description: 'Adds to level, after pre-amp, before shaping',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        defaultValue: 0,
      },
      {
        id: 22,
        displayName: 'Threshold',
        description: 'Subtracts between -Threshold and Threshold. Positive adds a square threshold for non-zero values',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        defaultValue: 0,
      },
      {
        id: 30,
        displayName: 'Shaper',
        description: 'Mapping shape, to transform the signal',
        intentId: synthNodeTerminalIntents.WAVESHAPER_FUNCTION.id,
        isParam: true,
        defaultValue: 1,
      },
      {
        id: 40,
        displayName: 'Clip input',
        description: 'Clips to In min and In max. Useful for limiting repeating shapes',
        intentId: synthNodeTerminalIntents.CHECK_BOOL.id,
        isParam: true,
        defaultValue: false,
      },
      {
        id: 45,
        displayName: 'Clip output',
        description: 'Clips to Out min and Out max',
        intentId: synthNodeTerminalIntents.CHECK_BOOL.id,
        isParam: true,
        defaultValue: false,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Out',
        description: 'Link inputs to use this number',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
    visualizations: [
      synthNodeVisualizationTypes.WAVESHAPER.id
    ],
  },
  RING: {
    id: 3,
    name: 'Multiply/Ring',
    nameShort: '×',
    description: 'Multiplies all signals, like digital ring modulation',
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
        displayName: 'Out',
        displayNameShort: 'Out',
        description: 'Link inputs to this output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
  },
  ADD: {
    id: 4,
    name: 'Add/Mix',
    nameShort: '+',
    description: 'Adds all signals',
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
        displayName: 'Out',
        displayNameShort: 'Out',
        description: 'Link inputs to this output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
  },
  DELAY: {
    id: 10,
    name: 'Delay',
    nameShort: 'Dly',
    description: 'Stores a signal, and outputs it after a delay',
    isPlaceholder: true,
    inputs: [
      {
        id: 1,
        displayName: 'Signal',
        description: 'Signal entering the delay node',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      },
      {
        id: 2,
        displayName: 'Absolute delay',
        description: 'Enable to enter frequency with Hz, s, ms, ns, or bpm units. Otherwise, enter a pitch offset.',
        intentId: synthNodeTerminalIntents.CHECK_BOOL.id,
        isParam: true,
        defaultValue: false,
      },
      {
        id: 3,
        displayName: 'Size: octaves',
        description: 'Buffer size, as octaves. For example -1 is twice as long as the reference wavelength.',
        intentId: synthNodeTerminalIntents.PITCH_OFFSET_OCTAVES.id,
        onlyShowIf: { inputId: 2, hasValue: false },
        isParam: true,
        defaultValue: -1,
      },
      {
        id: 4,
        displayName: 'Size: time',
        description: 'Buffer size, as a time. For example, 100ms, 400Hz, or C2.',
        intentId: synthNodeTerminalIntents.FREQUENCY_ABSOLUTE.id,
        onlyShowIf: { inputId: 2, hasValue: true },
        isParam: true,
        defaultValue: 220,
      },
      {
        id: 5,
        displayName: 'Delay: octaves',
        description: 'Time after recording, that the signal is played back.',
        intentId: synthNodeTerminalIntents.PITCH_OFFSET_OCTAVES.id,
        onlyShowIf: { inputId: 2, hasValue: false },
        defaultValue: 0,
      },
      {
        id: 6,
        displayName: 'Delay: time',
        description: 'Time after recording, that the signal is played back.',
        intentId: synthNodeTerminalIntents.FREQUENCY_ABSOLUTE.id,
        onlyShowIf: { inputId: 2, hasValue: true },
        defaultValue: 440,
      },
      {
        id: 7,
        displayName: 'Replay pitch',
        description: 'Changes the speed of playback. Might create broken sound.',
        intentId: synthNodeTerminalIntents.PITCH_OFFSET_OCTAVES.id,
        isPlaceholder: true,
        defaultValue: 0,
      },
      {
        id: 8,
        displayName: 'Crossfade',
        description: 'Smooths transitions if using Replay pitch.',
        intentId: synthNodeTerminalIntents.PITCH_OFFSET_OCTAVES.id,
        isPlaceholder: true,
        defaultValue: 0,
      },
      {
        id: 10,
        displayName: 'Latency comp',
        description: 'Offset the read of the buffer, in samples. For example, 1 outputs the sound sooner by 1 sample, to compensate for a feedback loop.',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        isParam: true,
        isPlaceholder: true,
        defaultValue: 0,
      },
      {
        id: 11,
        displayName: 'Subsample',
        description: 'Enable for more time precision, with signal interpolation. Might reduce the brightness of the output.',
        intentId: synthNodeTerminalIntents.CHECK_BOOL.id,
        isParam: true,
        isPlaceholder: true,
        defaultValue: 0,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Out',
        description: 'Link inputs to use this number',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
  },
  SPLICE: {
    id: 5,
    name: 'Splice',
    nameShort: 'Spl',
    description: 'Switches between Source 1 and Source 2, using a switch point at Switch phase (-1 to 1), every cycle at Pitch',
    inputs: [
      {
        id: 1,
        displayName: 'Source pitch',
        description: 'Amount of change to the reference frequency (octaves)',
        displayUnits: 'semitones',
        intentId: synthNodeTerminalIntents.PITCH_OFFSET_OCTAVES.id,
        exposed: true,
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
        displayName: 'Out',
        description: 'Link inputs to this output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
  },
  NUMBER: {
    id: 6,
    name: 'Number',
    nameShort: '#',
    description: 'A constant number. For most inputs on other nodes, you can enter a number instead of linking. Use this Number node if you want to use the same number more than one input',
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
        displayName: 'Out',
        description: 'Link inputs to use this number',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
  },
  ENVELOPE_WAHDSR: {
    id: 7,
    name: 'Envelope: analog',
    description: 'An analog-style envelope, using \'Sustain time\' in Performance properties',
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
        displayName: 'Out',
        description: 'Envelope output',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
    description: 'An analog-style envelope, using \'Sustain time\' in Performance properties',
  },
  MSEG: {
    id: 11,
    name: 'Envelope: MSEG',
    nameShort: 'MSEG',
    isPlaceholder: true,
    description: 'Multi-segment envelope. Use to precisely control a signal over time.',
    inputs: [
      {
        id: 1,
        displayName: 'Input',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 0,
      },
      {
        id: 10,
        displayName: 'Mod A',
        description: 'Shift MSEG points using this modulator',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 0,
      },
      {
        id: 10,
        displayName: 'Mod B',
        description: 'Shift MSEG points using this modulator',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 0,
      },
      {
        id: 10,
        displayName: 'Mod C',
        description: 'Shift MSEG points using this modulator',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 0,
      },
      {
        id: 10,
        displayName: 'Mod D',
        description: 'Shift MSEG points using this modulator',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: false,
        defaultValue: 0,
      },
    ],
    outputs: [
      {
        id: 1,
        displayName: 'Out',
        description: 'Link inputs to use this number',
        intentId: synthNodeTerminalIntents.LEVEL.id,
        exposed: true,
        defaultValue: 0,
      }
    ],
  },
    
}
const getNodeTypeById = id => getItemById(synthNodeTypes, id);

export {
  synthNodeTypes,
  getNodeTypeById
}