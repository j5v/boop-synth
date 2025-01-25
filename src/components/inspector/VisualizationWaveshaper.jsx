import './VisualizationWaveShaper.css'
import { remAsPx } from '../../lib/utils.js'

import { useState } from 'react'
import usePatchStore from '../../store/patchStore.jsx'


function VisualizationWaveform({ synthNodeId, w, h }) {

  // boop state: buffers

  
  // state
  
  const state = usePatchStore((state) => state)
  const { nodes, perf } = state;


  // events


  // highlight row
  
  const [ highlightRow, setHighlightRow ] = useState(-1);

  const handleMouseMove = (event) => {

    const svgElement = document.getElementById('preview-waveshaper');
    if (svgElement) {
      const svgBounds = svgElement.getBoundingClientRect();

      const y = event.clientY - svgBounds.top - svgElement.clientTop;
      // const line = Math.floor((y - graphOriginY) / lineIncY + 0.5);
      // setHighlightRow(line);
    };

  }

  const svg = [];

  // render inner SVG

  const wPx = remAsPx(w);
  const wPy = remAsPx(h);
  const margin = remAsPx(0.6);

  const dimMargin = remAsPx(0.5);
  const dimLength = remAsPx(0.8);
  const dimTextOffset = remAsPx(1.0);
  const textLH = remAsPx(1.4);

  const mapperSize = wPx * 0.4;

  const x1 = - mapperSize * 0.5;
  const x2 = mapperSize * 0.5;

  const y1 = - mapperSize * 0.5;
  const y2 = mapperSize * 0.5;

  const dotRadius = remAsPx(0.15);
  const inDotY = -mapperSize * 1.7;
  const inDotX1 = x1 * 1.4;
  const inDotX2 = x2 * 1.6;
  const inNormedY = inDotY + textLH * 1;

  const outDotX = x2 * 1.8;
  const outDotY1 = y1 * 1.0;
  const outDotY2 = 0;
  
  return (
    <div
      className="visualization small"
      onMouseMove={handleMouseMove}
    >
      <svg id="preview-waveshaper" className="visualization-svg ws small" width="15rem" height="17rem">
        <g transform={`translate( ${wPx * 0.41} ${wPy * 0.77} )`} >

          // waveshaper box
          <rect className="frame" x={x1} y={y1} width={mapperSize} height={mapperSize} />
          
          <line className="axis" x1={x1} y1={0} x2={x2} y2={0} />
          <line className="axis" x1={0} y1={y1} x2={0} y2={y2} />

          // input bounds
          <text className="dim-text h-under" x={x1} y={inNormedY + remAsPx(1)}>&minus;1</text>
          
          <text className="dim-text h-under" x={x2} y={inNormedY + remAsPx(1)}>+1</text>


          // input scaler
          <path className="scaler" d={`
            M ${inDotX1} ${inDotY}
            L ${inDotX2} ${inDotY}  
            L ${x2} ${inNormedY}    
            L ${x2} ${inNormedY + dimLength + textLH}  
            L ${x2 * 1.4} ${inNormedY + dimLength + textLH * 1.75}  
            L ${x2 * 1.2} ${inNormedY + dimLength + textLH * 2.75}  
            L ${x2 * 0.7} ${inNormedY + dimLength + textLH * 3.75}  

            L ${x1 * 1.2} ${inNormedY + dimLength + textLH * 3.75}  
            L ${x1 * 1.6} ${inNormedY + dimLength + textLH * 2.75}  
            L ${x1 * 1.4} ${inNormedY + dimLength + textLH * 1.75}  
            L ${x1} ${inNormedY + dimLength + textLH}  
            L ${x1} ${inNormedY}
          `} />
          <line className="scaler-edge" x1={inDotX1} y1={inDotY} x2={x1} y2={inNormedY} />
          <line className="scaler-edge" x1={inDotX2} y1={inDotY} x2={x2} y2={inNormedY} />

          // in flow arrow
          <line className="flow" x1={0} y1={inDotY} x2={0} y2={inNormedY + remAsPx(1.7)} />
          <line className="flow" x1={0} y1={inNormedY + remAsPx(1.7)} x2={remAsPx(0.3)} y2={inNormedY + remAsPx(1)} />
          <line className="flow" x1={0} y1={inNormedY + remAsPx(1.7)} x2={remAsPx(-0.3)} y2={inNormedY + remAsPx(1)} />
          

          // input labels
          <text className="dim-text h-over" x={0} y={inDotY - dimTextOffset * 0.6}>Signal</text>

          <text className="dim-text h-over" x={inDotX1} y={inDotY - dimTextOffset * 0.6}>In min</text>
          <circle className="dot" cx={inDotX1} cy={inDotY} r={dotRadius} />

          <text className="dim-text h-over" x={inDotX2} y={inDotY - dimTextOffset * 0.6}>In max</text>
          <circle className="dot" cx={inDotX2} cy={inDotY} r={dotRadius} />

          // post-scale process
          <text className="dim-text" x={0} y={y1 - dimMargin - textLH * 2.2}>Pre-amp</text>
          <text className="dim-text" x={0} y={y1 - dimMargin - textLH * 1.1}>Offset</text>
          <text className="dim-text" x={0} y={y1 - dimMargin - textLH * 0}>Threshold</text>

          // scaled
          {/* <circle className="dot" cx={x1} cy={inNormedY} r={dotRadius} />
          <circle className="dot" cx={x2} cy={inNormedY} r={dotRadius} /> */}

          <line className="dim" x1={x1} y1={inNormedY + dimLength} x2={x1} y2={inNormedY} />
          <line className="dim" x1={x2} y1={inNormedY + dimLength} x2={x2} y2={inNormedY} />

          <line className="dim" x1={x1} y1={y1 - dimMargin} x2={x1} y2={inNormedY + dimLength + textLH} />
          <line className="dim" x1={x2} y1={y1 - dimMargin} x2={x2} y2={inNormedY + dimLength + textLH} />

          // out axis

          <path className="scaler" d={`
            M ${outDotX} ${outDotY1}
            L ${outDotX} ${outDotY2}  
            L ${x2 + dimMargin} ${y2}    
            L ${x2 + dimMargin} ${y1}  
          `} />

          <line className="dim" x1={x1 - dimMargin} y1={y1} x2={x1 - dimMargin - dimLength } y2={y1} />
          <text className="dim-text v" x={x1 - dimMargin - dimTextOffset} y={y1}>+1</text>
          
          <line className="dim" x1={x1 - dimMargin} y1={y2} x2={x1 - dimMargin - dimLength } y2={y2} />
          <text className="dim-text v" x={x1 - dimMargin - dimTextOffset} y={y2}>&minus;1</text>

          // out flow arrow
          <line className="flow" x1={x2 * 2.5} y1={y1 * 0.25} x2={outDotX} y2={y1 * 0.25} />
          <line className="flow" x1={x2 * 2.5} y1={y1 * 0.25} x2={x2 * 2.5 - remAsPx(0.7)} y2={y1 * 0.25 + remAsPx(0.3)} />
          <line className="flow" x1={x2 * 2.5} y1={y1 * 0.25} x2={x2 * 2.5 - remAsPx(0.7)} y2={y1 * 0.25 - remAsPx(0.3)} />
          <line className="scaler-edge" x1={x2 + dimMargin} y1={y1} x2={outDotX} y2={outDotY1} />
          <line className="scaler-edge" x1={x2 + dimMargin} y1={y2} x2={outDotX} y2={outDotY2} />
          
          <circle className="dot" cx={outDotX} cy={outDotY1} r={dotRadius} />
          <text className="dim-text h-over" x={outDotX} y={outDotY1 - remAsPx(0.5)}>Out max</text>

          <circle className="dot" cx={outDotX} cy={outDotY2} r={dotRadius} />
          <text className="dim-text h-under" x={outDotX} y={outDotY2 + remAsPx(0.3)}>Out min</text>

          <text className="dim-text v" x={x2 * 2.5} y={y1 * 0.55}>Out</text>

        </g>
      </svg>
    </div>
  )

}

export default VisualizationWaveform
