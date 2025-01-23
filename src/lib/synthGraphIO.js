import { encodeWAV } from './wav.js'
import saveAs from '../lib/FileSaver.js'

// Outputs

function writeFile(outputBuffers, perf) {

  const { channels, sampleRate, filenameRoot } = perf;

  for (let outputBufferIndex in outputBuffers) {
    const dataview = encodeWAV(
      outputBuffers[outputBufferIndex].samples,
      sampleRate,
      channels
    );

    const audioBlob = new Blob([dataview], { type : 'audio/wav' });
    saveAs(audioBlob, filenameRoot + '.wav');
  }
}

function playAudio(outputBuffers, perf) {

  // TODO: use patch data.
  const { duration, channels, sampleRate } = perf;

  for (let outputBufferIndex in outputBuffers) {

    const samples = outputBuffers[outputBufferIndex].samples;

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


export {
  writeFile,
  playAudio,
}