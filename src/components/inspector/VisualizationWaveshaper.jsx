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
  const scalerSize = textLH;

  const x1 = - mapperSize * 0.5;
  const x2 = mapperSize * 0.5;

  const y1 = - mapperSize * 0.5;
  const y2 = mapperSize * 0.5;

  const sAsX = i => (i * x2); // signal to SVG position

  const dotRadius = remAsPx(0.15);
  const inDotY = -mapperSize * 1.7;
  const inNormedY = inDotY + scalerSize;

  const outDotX = x2 * 1.8;
  const outDotY1 = y1 * 1.0;
  const outDotY2 = 0;

  const pipelineItemMargin = remAsPx(0.4); // gap between pipeline steps
  const numPipelineItems = 4;
  const pipelineY1 = inDotY;
  const pipelineSize = (y1 - dimMargin) - pipelineY1;

  const pipelineItemStepSize = (pipelineSize + pipelineItemMargin) / numPipelineItems;
  const pipelineItemSize = pipelineItemStepSize - pipelineItemMargin;

  const signalValue = 0.5; // for WIP only ...
  const inMinValue = -1.5; 
  const inMaxValue = 1.8; 
  const outMinValue = 0.5; 
  const outMaxValue = 0.5; 
  const preampValue = 0.8; 
  const offsetValue = 0.1; 
  const thresholdValue = 0.2; 


  let sig1 = -1;
  let sig2 = 1;
  const pipelineItems = [];
  pipelineItems.push({ inputIds: [11, 12], name: '', x1: sig1, x2: sig2 });

  sig1 *= preampValue;
  sig2 *= preampValue;
  pipelineItems.push({ inputId: 20, name: 'Pre-amp', x1: sig1, x2: sig2 });

  sig1 += offsetValue;
  sig2 += offsetValue;
  pipelineItems.push({ inputId: 21, name: 'Offset', x1: sig1, x2: sig2 });

  const calcThreshold = (sig, threshold) => {
    if (Math.abs(sig) > Math.abs(threshold)) {
      return sig - threshold * Math.sign(sig);
    } else if (threshold > 0) {
      return 0;
    } else {
      return threshold;
    }
  }
  sig1 = calcThreshold(sig1, thresholdValue);
  sig2 = calcThreshold(sig2, thresholdValue);
  pipelineItems.push({ inputId: 22, name: 'Threshold', x1: sig1, x2: sig2 });
  
  let itemY = pipelineY1;
  let prevX1 = inMinValue;
  let prevX2 = inMaxValue;
  const pipelineItemsSVG = pipelineItems.map(item => {
    // y1: pipelineY1, y2: pipelineY1
    const ItemYBottom = itemY + pipelineItemSize;
    const itemSVG = (
      <g>
        <path className="scaler" d={`
          M ${sAsX(prevX1)} ${itemY}
          L ${sAsX(prevX2)} ${itemY}  
          L ${sAsX(item.x2)} ${ItemYBottom}
          L ${sAsX(item.x1)} ${ItemYBottom}
        `} />
        <line className="scaler-edge" x1={sAsX(prevX1)} y1={itemY} x2={sAsX(item.x1)} y2={ItemYBottom} />
        <line className="scaler-edge" x1={sAsX(prevX2)} y1={itemY} x2={sAsX(item.x2)} y2={ItemYBottom} />
        <text className="dim-text h-under" x={0} y={itemY + remAsPx(0.2)}>{item.name}</text>
      </g>
    );
    itemY += pipelineItemStepSize;
    prevX1 = item.x1;
    prevX2 = item.x2;
    return itemSVG
  });

  const arrowInPointY = inDotY + pipelineItemSize + pipelineItemMargin;

  return (
    <div
      className="visualization small"
      onMouseMove={handleMouseMove}
    >
      <svg id="preview-waveshaper" className="visualization-svg ws small" width="15rem" height="17rem">
        <g transform={`translate( ${wPx * 0.41} ${wPy * 0.77} )`} >


          {/* input scaler */}
          {/* <path className="scaler" d={`
            M ${inDotX1} ${inDotY}
            L ${inDotX2} ${inDotY}  
            L ${x2} ${inNormedY}    
            L ${x2} ${inNormedY + dimLength + textLH}  
            L ${x2 * 1.4} ${inNormedY + dimLength + textLH * 1.75}  
            L ${x2 * 1.6} ${inNormedY + dimLength + textLH * 2.75}  
            L ${x2 * 1.3} ${inNormedY + dimLength + textLH * 3.75}  

            L ${x1 * 0.7} ${inNormedY + dimLength + textLH * 3.75}  
            L ${x1 * 1.2} ${inNormedY + dimLength + textLH * 2.75}  
            L ${x1 * 1.4} ${inNormedY + dimLength + textLH * 1.75}  
            L ${x1} ${inNormedY + dimLength + textLH}  
            L ${x1} ${inNormedY}
          `} /> */}

          {/* Pipeline items*/}
          {pipelineItemsSVG}          

          {/* in flow arrow */}
          <line className="flow" x1={0} y1={inDotY} x2={0} y2={arrowInPointY} />
          <path className="flow" d={`
            M ${remAsPx(0.3)} ${arrowInPointY - remAsPx(0.6)}  
            L 0 ${arrowInPointY}   
            L ${remAsPx(-0.3)} ${arrowInPointY - remAsPx(0.6)}
            `} />
          

          {/* input labels */}
          <text className="dim-text h-over" x={0} y={inDotY - dimTextOffset * 0.6}>Signal</text>

          <text className="dim-text h-over" x={sAsX(inMinValue)} y={inDotY - dimTextOffset * 0.6}>In min</text>
          <circle className="dot" cx={sAsX(inMinValue)} cy={inDotY} r={dotRadius} />

          <text className="dim-text h-over" x={sAsX(inMaxValue)} y={inDotY - dimTextOffset * 0.6}>In max</text>
          <circle className="dot" cx={sAsX(inMaxValue)} cy={inDotY} r={dotRadius} />

          {/* scaled to -1..1 bounds */}
          {/* <line className="dim" x1={x1} y1={inNormedY + dimMargin + dimLength} x2={x1} y2={inNormedY + dimMargin} />
          <line className="dim" x1={x2} y1={inNormedY + dimMargin + dimLength} x2={x2} y2={inNormedY + dimMargin} /> */}

          <line className="dim" x1={x1} y1={y1 - dimMargin} x2={x1} y2={inNormedY} />
          <line className="dim" x1={x2} y1={y1 - dimMargin} x2={x2} y2={inNormedY} />

          {/* input bounds */}
          <circle className="dot soft" cx={x1} cy={inNormedY} r={dotRadius} />
          <text className="dim-text v after" x={x1 - remAsPx(0.0)} y={inNormedY - remAsPx(0.6)}>&minus;1</text>
          
          <circle className="dot soft" cx={x2} cy={inNormedY} r={dotRadius} />
          <text className="dim-text v" x={x2 - remAsPx(0.2)} y={inNormedY - remAsPx(0.6)}>+1</text>


          {/* waveshaper box */}
          <rect className="frame" x={x1} y={y1} width={mapperSize} height={mapperSize} />
          <line className="axis" x1={x1} y1={0} x2={x2} y2={0} />
          <line className="axis" x1={0} y1={y1} x2={0} y2={y2} />

          {/* scaler out */}
          <path className="scaler" d={`
            M ${outDotX} ${outDotY1}
            L ${outDotX} ${outDotY2}  
            L ${x2 + dimMargin} ${y2}    
            L ${x2 + dimMargin} ${y1}  
          `} />
          <line className="scaler-edge" x1={x2 + dimMargin} y1={y1} x2={outDotX} y2={outDotY1} />
          <line className="scaler-edge" x1={x2 + dimMargin} y1={y2} x2={outDotX} y2={outDotY2} />
          

          <line className="dim" x1={x1 - dimMargin} y1={y1} x2={x1 - dimMargin - dimLength } y2={y1} />
          <text className="dim-text v" x={x1 - dimMargin - dimTextOffset} y={y1}>+1</text>
          
          <line className="dim" x1={x1 - dimMargin} y1={y2} x2={x1 - dimMargin - dimLength } y2={y2} />
          <text className="dim-text v" x={x1 - dimMargin - dimTextOffset} y={y2}>&minus;1</text>

          {/* out flow arrow */}
          <circle className="dot soft" cx={x2 + dimMargin} cy={y1} r={dotRadius} />
          <circle className="dot soft" cx={x2 + dimMargin} cy={y2} r={dotRadius} />


          {/* out flow arrow */}
          <line className="flow" x1={x2 * 2.5} y1={y1 * 0.25} x2={outDotX} y2={y1 * 0.25} />
          <line className="flow" x1={x2 * 2.5} y1={y1 * 0.25} x2={x2 * 2.5 - remAsPx(0.7)} y2={y1 * 0.25 + remAsPx(0.3)} />
          <line className="flow" x1={x2 * 2.5} y1={y1 * 0.25} x2={x2 * 2.5 - remAsPx(0.7)} y2={y1 * 0.25 - remAsPx(0.3)} />

          {/* output bounds */}
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
