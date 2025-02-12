import './VisualizationWaveform.css'
import { remAsPx } from '../../lib/utils.js'
import { generate } from '../../lib/synth.js'

import IconRefresh from '../generic/IconRefresh.jsx'

import { useContext } from 'react';
import { BoopContext } from '../../store/AppContext.js';
import { useState } from 'react'
import usePatchStore from '../../store/patchStore.jsx'


function VisualizationWaveform({ synthNodeId, w, h }) {

  // boop state: buffers
  const { boop, setBoop } = useContext(BoopContext);

  const buffers = boop.defaultBoopState.outputBuffers;
  const buffer = buffers.find(b => b.nodeId == synthNodeId);

  
  // state
  
  const stateDirty = usePatchStore((state) => state.stateDirty)
  const state = usePatchStore((state) => state)
  const { nodes, perf } = state;


  // events

  const handleGenerateOnly = (params) => {
    generate(params);
    stateDirty();
  }


  // highlight row
  
  const [ highlightRow, setHighlightRow ] = useState(-1);

  const handleMouseMove = (event) => {

    const svgElement = document.getElementById('preview-waveform');
    if (svgElement) {
      const svgBounds = svgElement.getBoundingClientRect();

      const y = event.clientY - svgBounds.top - svgElement.clientTop;
      const line = Math.floor((y - graphOriginY) / lineIncY + 0.5);
      setHighlightRow(line);
    };

  }

  // declared in this scope, so handleMouseMove can use these:
  let lineIncY, graphOriginY;

  const svg = [];

  if (buffer) {

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
    graphOriginY = wPy - margin - waveformAmplitude;
    const scaleX = lineLength / wavelengthAsSamples; // timeline: pixels per sample


    const maxLines = 60;
    const numLinesPossible = samples.length / wavelengthAsSamples;
    const numLines = Math.min(maxLines, numLinesPossible);
    
    const lineIncX = (wPx - margin) * 0.1 / numLines;
    lineIncY = - (wPy - (margin + waveformAmplitude) * 2) / numLines;

    const cursorIncPerLine = (samples.length - wavelengthAsSamples) / numLines; // not yet quanitzed to wavelength

    let cursor = 0;
    let linePhase = 0;
    let key = 0;

    for (let lineCount = 0; lineCount < numLines; lineCount++) {

      const numSamplesThisLine = Math.min(cursor + wavelengthAsSamples, samples.length) - cursor;
      const path = [ ];

      let lineOriginX = graphOriginX + lineCount * lineIncX;
      let lineOriginY = graphOriginY + lineCount * lineIncY;

      for (let xc = 0; xc <= numSamplesThisLine; xc++ ) {
        const sample = Math.min(1, Math.max(-1, samples[Math.floor(cursor + xc)]));
        path.push( `${xc == 0 ? 'M' : 'L'} ${xc * scaleX + lineOriginX} ${lineOriginY - sample * waveformAmplitude} ` );
      }

      // error distribution, for the start of the next wavelength
      linePhase += cursorIncPerLine;
      cursor += Math.floor((linePhase - cursor) / wavelengthAsSamples) * wavelengthAsSamples;

      const lineClass = lineCount == highlightRow ? 'wf highlight' : 'wf';
      
      svg.push( <path className={lineClass} key={key++} d={path.join('')} /> );
      svg.push( <line key={key++} className="axis" x1={lineOriginX} y1={lineOriginY} x2={lineOriginX - 2} y2={lineOriginY} /> );
      svg.push( <line key={key++} className="axis" x1={lineOriginX + lineLength} y1={lineOriginY} x2={lineOriginX + lineLength + 2} y2={lineOriginY} /> );
    }
  }

  return (
    buffer ? (
      <div
        className="visualization small"
        onMouseMove={handleMouseMove}
      >
        <svg id="preview-waveform" className="visualization-svg small" width="17rem" height="16rem">
          {svg.reverse()}
        </svg>
      </div>
      ) : (
      <button
        className="icon" 
        onClick={() => handleGenerateOnly({ nodes, perf, boop })}
        title="Refresh previews"
      ><IconRefresh /></button>
    )
  )

}

export default VisualizationWaveform
