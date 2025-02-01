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
  SOURCE_TYPE_GROUP: {
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
    description: 'Enter a frequency, s, ms, ms, bpm, or a note like Eb5, or Eb5@439 for a note relative to a tuned A4.',
    modulatable: true
  },
  CHECK_BOOL: {
    id: 9,
    name: 'On/off',
    units: '',
    classCSS: 'boolean',
    description: 'On or off',
  },
  SOURCE_TYPE_FUNCTION: {
    id: 10,
    name: 'Function',
    units: 'choice',
    classCSS: 'enum',
    description: 'Choose a wave shape for the function',
  },
  WAVESHAPER_FUNCTION: {
    id: 11,
    name: 'WS Function',
    units: 'choice',
    classCSS: 'enum',
    description: 'Choose a wave shape for the function',
  },  
  FILENAME_PART: {
    id: 12,
    name: 'Filename part',
    units: '',
    classCSS: '',
    description: '',
  }, 
}

const parseUserInput = ({ intentId, value }) => {

  let writeValue = value !== undefined ? value : 0; // best guess so far; improve below with parsing

  const trimmed = value.toString().trim().toLowerCase();

  if (intentId == synthNodeTerminalIntents.PITCH_OFFSET_OCTAVES.id) {
    if (trimmed.slice(-1) == 'c') { // cents
      writeValue = parseFloat(trimmed.slice(0,-1)) / 1200;

    } else if (trimmed.slice(-1) == 'd') { // ET12 notes
      writeValue = parseFloat(trimmed.slice(0,-1)) / 12;

    } else if (trimmed.indexOf('/') > -1) { // fraction of numbers (slash divide)
      const parts = trimmed.split('/').map(n => parseFloat(n));
      if (parts[1] !== 0) writeValue = Math.log(parts[0] / parts[1]) / Math.log(2);

    } else if (trimmed.indexOf(':') > -1) { // fraction of numbers (colon ratio)
      const parts = trimmed.split(':').map(n => parseFloat(n));
      if (parts[1] !== 0) writeValue = Math.log(parts[0] / parts[1]) / Math.log(2);
    } else {
      writeValue = parseFloat(trimmed);
    }

  } else if (intentId == synthNodeTerminalIntents.LEVEL.id) {
    if (trimmed.slice(-2) == 'db') { // dB
      const dB = parseFloat(trimmed.slice(0,-2));
      writeValue = Math.pow(10, dB * 0.1);

    } else if (trimmed.indexOf('/') > -1) { // fraction of numbers (slash divide)
      const parts = trimmed.split('/').map(n => parseFloat(n));
      if (parts[1] !== 0) writeValue = parts[0] / parts[1];

    } else if (trimmed.indexOf(':') > -1) { // fraction of numbers (colon ratio)
      const parts = trimmed.split(':').map(n => parseFloat(n));
      if (parts[1] !== 0) writeValue = parts[0] / parts[1];
    } else {
      writeValue = parseFloat(trimmed);
    }

  } else if (intentId == synthNodeTerminalIntents.FREQUENCY_ABSOLUTE.id) {
    if (trimmed.slice(-2) == 'ms') { // ms
      const ms = parseFloat(trimmed.slice(0,-2));
      writeValue = (ms == 0) ? ms : 1000 / ms;

    } else if (trimmed.slice(-2) == 'ns') { // ms
      const ns = parseFloat(trimmed.slice(0,-2));
      writeValue = (ns == 0) ? ns : 1000000 / ns;

    } else if (trimmed.slice(-1) == 's') { // s
      const s = parseFloat(trimmed.slice(0,-1));
      writeValue = (s == 0) ? s : 1 / s;

    } else if (trimmed.slice(-3) == 'bpm') { // s
      const bpm = parseFloat(trimmed.slice(0,-3));
      writeValue = bpm / 60;

    } else {
      const parsed = /([a-g])([#b]?)(\d*)([@]?)([0-9.]*)?/.exec(trimmed);

      if (parsed) {
        const [ignore, letter, accidental, octave, ignore2, freqOfA] = parsed;
        if (letter) { // minimum spec
          const semitones = [0, 2, 4, 5, 7, 9, 11]['cdefgab'.indexOf(letter)];
          const accidentalInc = accidental == '#' ? 1 : (accidental == 'b' ? -1 : 0);
          // @ts-ignore
          writeValue = Math.pow(2, (octave || 4) - 4 + (accidentalInc + semitones - 9) / 12 ) * (parseFloat(freqOfA || '440'));
        }
      } else {
        writeValue = parseFloat(trimmed);
      }
    }

  } else if (intentId == synthNodeTerminalIntents.CHECK_BOOL.id) {
    writeValue = value; // Boolean

  } else if (intentId == synthNodeTerminalIntents.SOURCE_TYPE_GROUP.id) {
    writeValue = parseInt(value, 10);

  } else if (intentId == synthNodeTerminalIntents.SOURCE_TYPE_FUNCTION.id) {
    writeValue = parseInt(value, 10);

  }

  return writeValue;


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
  getSynthNodeTerminalIntentsById,

  parseUserInput,
}