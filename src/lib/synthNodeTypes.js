import { synthNodeTerminalIntents } from '../lib/synthNodeIntents.js'
import { getItemById } from '../lib/utils.js'

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
        isParam: true,
        exposed: false,
        isPlaceholder: true,
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
        id: 6,
        displayName: 'Fixed frequency',
        displayNameShort: 'Hz',
        description: 'Absolute frequency, not affected by reference frequency',
        displayUnits: 'Hz',
        intentId: synthNodeTerminalIntents.FREQUENCY_ABSOLUTE.id,
        defaultValue: 440,
      },
      {
        id: 7,
        displayName: 'Frequency fixed?',
        displayNameShort: 'Hz?',
        description: 'When enabled, use "Fixed frequency" input. Otherwise, use "Pitch offset"',
        displayUnits: 'Hz',
        isParam: true,
        intentId: synthNodeTerminalIntents.CHECK_BOOL.id,
        defaultValue: false,
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

export {
  synthNodeTypes,
  getNodeTypeById
}