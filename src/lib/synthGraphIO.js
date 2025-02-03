import { cleanStateForExport } from './synthGraphUtils.js'
import { joinItems } from './utils.js'

import { encodeWAV } from './wav.js'
import saveAs from '../lib/FileSaver.js'

// Outputs

function writeFile(outputBuffers, perf) {

  const { channels, sampleRate, filenameRoot } = perf;

  for (let outputBufferIndex in outputBuffers) {

    const buffer = outputBuffers[outputBufferIndex];

    if (buffer.doOutput) {
      const dataview = encodeWAV({
        samples: buffer.samples,
        sampleRate,
        channelCount: channels
      });

      const audioBlob = new Blob([dataview], { type : 'audio/wav' });

      saveAs(
        audioBlob,
        joinItems([filenameRoot, outputBuffers[outputBufferIndex].filenamePart || ''], '-') + '.wav'
      );
    }
  }
}

function playAudio(outputBuffers, perf) {

  // TODO: use patch data.
  const { duration, channels, sampleRate } = perf;

  for (let outputBufferIndex in outputBuffers) {

    const buffer = outputBuffers[outputBufferIndex];

    if (buffer.doOutput) {

      const samples = buffer.samples;

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
  }
}

function exportPatch(state) {

  const patchName = state.name || 'untitled';
  const exportState = cleanStateForExport(state);
  const stream = `data:text/json;charset=utf-8, ${encodeURIComponent(JSON.stringify(exportState))}`;

  saveAs(stream, patchName + '-boop-patch.json');
  
}


export {
  writeFile,
  playAudio,
  exportPatch,
}