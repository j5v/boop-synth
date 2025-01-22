import './VisualizationWaveform.css'
import { remAsPx } from '../../lib/utils.js'
import { generate } from '../../lib/synth.js'

import ParameterGroup from '../generic/ParameterGroup.jsx'
import IconRefresh from '../generic/IconRefresh.jsx'

import { useContext } from 'react';
import { BoopContext } from '../../store/AppContext.js';
import { useState } from 'react'
import usePatchStore from '../../store/patchStore.jsx'


function VisualizationWaveform({ buffer, w, h }) {

  // Opportunities to refresh state

  const { boop, setBoop } = useContext(BoopContext);

  const stateDirty = usePatchStore((state) => state.stateDirty)
  const state = usePatchStore((state) => state)
  const { nodes, perf } = state;


  const handleGenerateOnly = (params) => {
    generate(params);
    stateDirty();
  }

  const generateActionBtn = (buffer ? <></> :
    <button
      className="icon" 
      onClick={() => handleGenerateOnly({ nodes, perf, boop })}
      title="Refresh previews"
    ><IconRefresh /></button>
  )
  if (!buffer) {
    return generateActionBtn;
  }

  // render inner SVG

  const { duration, sampleRate, freq } = perf;
  const sampleFrames = sampleRate * duration;
  const wavelengthAsSamples = sampleRate / freq;
  
  const { samples } = buffer;

  // console.log({ duration, sampleRate, freq, wavelengthAsSamples, sampleFrames });
  
  const wPx = remAsPx(w);
  const wPy = remAsPx(h);
  const margin = remAsPx(0.6);
  
  const waveformAmplitude = remAsPx(1.5);
  const lineLength = wPx * 0.7;
  
  const graphOriginX = margin;
  const graphOriginY = wPy - margin - waveformAmplitude;
  const scaleX = lineLength / wavelengthAsSamples; // timeline: pixels per sample


  const maxLines = 60;
  const numLinesPossible = samples.length / wavelengthAsSamples;
  const numLines = Math.min(maxLines, numLinesPossible);
  
  const lineIncX = (wPx - margin) * 0.1 / numLines;
  const lineIncY = - (wPy - (margin + waveformAmplitude) * 2) / numLines;

  const cursorIncPerLine = (samples.length - wavelengthAsSamples) / numLines; // not yet quanitzed to wavelength

  const svg = [];
  let cursor = 0;
  let linePhase = 0;
  let key = 0;

  console.log({cursorIncPerLine});


  for (let lineCount = 0; lineCount < numLines; lineCount++) {


    const lineSamples = Math.min(cursor + wavelengthAsSamples, samples.length) - cursor;

    const path = [ ];
    let lineOriginX = graphOriginX + lineCount * lineIncX;
    let lineOriginY = graphOriginY + lineCount * lineIncY;
    for (let xc = 0; xc <= lineSamples; xc++ ) {
      const sample = Math.min(1, Math.max(-1, samples[Math.floor(cursor + xc)]));
      path.push( `${xc == 0 ? 'M' : 'L'} ${xc * scaleX + lineOriginX} ${lineOriginY - sample * waveformAmplitude} ` );
    }

    // error distribution, for the start of the next wavelength
    linePhase += cursorIncPerLine;
    cursor += Math.floor((linePhase - cursor) / wavelengthAsSamples) * wavelengthAsSamples;
    
    svg.push( <path key={key++} className="wf" d={path.join('')} /> );
    svg.push( <line key={key++} className="axis" x1={lineOriginX} y1={lineOriginY} x2={lineOriginX + lineLength} y2={lineOriginY} /> );
  }


  return (
    <div className="visualization small">
      <svg className="visualization-svg small" width="17rem" height="16rem">
        {svg.reverse()}
      </svg>
    </div>
  )

}

export default VisualizationWaveform
