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
    id: 7,
    name: 'trigger',
    units: 'above 0',
    classCSS: 'trigger',
    modulatable: true
  },
  FREQUENCY_ABSOLUTE: {
    id: 8,
    name: 'Frequency',
    units: 'Hz',
    classCSS: 'frequency',
    description: 'A frequency, Hz',
    modulatable: true
  },  
  CHECK_BOOL: {
    id: 9,
    name: 'On/off',
    units: '',
    classCSS: 'boolean',
    description: 'On or off',
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

export {
  synthNodeTerminalIntents,
  getSynthNodeTerminalIntentsById
}