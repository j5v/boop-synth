import './VisualizationWaveform.css'
import { remAsPx } from '../../lib/utils.js'

import { useState } from 'react'
import usePatchStore from '../../store/patchStore.jsx'


function VisualizationWaveform({ buffer, w, h }) {
  // renders inner SVG

  const perf = usePatchStore((state) => state.perf);
  const { duration, sampleRate, freq } = perf;
  const sampleFrames = sampleRate * duration;
  const wavelengthAsSamples = sampleRate / freq;
  
  const { samples } = buffer;

  // console.log({ duration, sampleRate, freq, wavelengthAsSamples, sampleFrames });


  const wPx = remAsPx(w);
  const wPy = remAsPx(h);
  const margin = remAsPx(0.6);
  
  const waveformAmplitude = remAsPx(3);
  const lineLength = wPx * 0.7;
  const gradient = 3;

  const lineStartX = margin;
  const lineStartY = wPy - margin - waveformAmplitude;
  const scaleX = lineLength / wavelengthAsSamples; // timeline: pixels per sample

  const lineSamples = Math.min(wavelengthAsSamples, buffer.samples.length)

  const svg = [];
  svg.push( <line className="axis" x1={lineStartX} y1={lineStartY} x2={lineStartX + lineLength} y2={lineStartY} /> );

  const path = [ ];
  let x = lineStartX;
  let cursor = 0;
  for (let xc = 0; xc <= lineSamples; xc++ ) {
    path.push( `${xc == 0 ? 'M' : 'L'} ${xc * scaleX + lineStartX} ${lineStartY - samples[xc] * waveformAmplitude} ` );
  }
  
  svg.push( <path className="wf" d={path.join('')} /> );


  return svg;

}

export default VisualizationWaveform
