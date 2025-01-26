import './VisualizationWaveShaper.css'
import { remAsPx, joinItems } from '../../lib/utils.js'
import { valuesOfInputsNoLinks } from '../../lib/synthGraphUtils.js'
import { waveShaperPreviewData } from '../../lib/waveshaperFunctions.js'

// import { useState } from 'react'
import usePatchStore from '../../store/patchStore.jsx'

import { memo } from 'react';
const VisualizationWaveshaper = memo(function VisualizationWaveshaper(props) {

  // boop state: buffers
  const { synthNodeId, w, h } = props;
  
  // state
  
  const state = usePatchStore((state) => state)
  const { nodes, perf } = state;
  const node = nodes.find(n => n.id == synthNodeId)
  // events


  // highlight row
  
  // const [ highlightRow, setHighlightRow ] = useState(-1);

  const handleMouseMove = (event) => {

    const svgElement = document.getElementById('preview-waveshaper');
    if (svgElement) {
      const svgBounds = svgElement.getBoundingClientRect();

      const y = event.clientY - svgBounds.top - svgElement.clientTop;
      // const line = Math.floor((y - graphOriginY) / lineIncY + 0.5);
      // setHighlightRow(line);
    };

  }

  const [ signal, inMin, inMax, outMin, outMax, preAmp, offset, threshold, shaperId, doClipInput, doClipOutput ] = valuesOfInputsNoLinks(node, nodes);


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

  const pipelineItemMargin = remAsPx(0.4); // gap between pipeline steps
  const numPipelineItems = 4;
  const pipelineY1 = inDotY;
  const pipelineSize = (y1 - dimMargin) - pipelineY1;

  const pipelineItemStepSize = (pipelineSize + pipelineItemMargin) / numPipelineItems;
  const pipelineItemSize = pipelineItemStepSize - pipelineItemMargin;

  const signalValue = 0.5; // for WIP only ...


  // Pipeline before waveshaper

  let sig1 = -1;
  let sig2 = 1;
  const pipelineItems = [];
  pipelineItems.push({ inputIds: [11, 12], name: '', x1: sig1, x2: sig2 });

  sig1 *= preAmp;
  sig2 *= preAmp;
  pipelineItems.push({ inputId: 20, name: 'Pre-amp', x1: sig1, x2: sig2 });

  sig1 += offset;
  sig2 += offset;
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
  sig1 = calcThreshold(sig1, threshold);
  sig2 = calcThreshold(sig2, threshold);
  pipelineItems.push({ inputId: 22, name: 'Threshold', x1: sig1, x2: sig2 });
  
  let itemY = pipelineY1;
  let prevX1 = inMin;
  let prevX2 = inMax;
  let id = 0;
  const pipelineItemsSVG = pipelineItems.map(item => {
    // y1: pipelineY1, y2: pipelineY1
    const ItemYBottom = itemY + pipelineItemSize;
    const itemSVG = (
      <g key={id}>
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
    id++;
    return itemSVG
  });

  const arrowInPointY = inDotY + pipelineItemSize + pipelineItemMargin;

  // waveshaper mapping graph
  const wsData = waveShaperPreviewData({ wsId: shaperId, steps: 200, first: -1, last: 1 });
  const shaperPath = joinItems(wsData.map(i => (
    `${i.i == 0 ? 'M' : 'L'} ${x2 * i.x} ${y1 * i.y}  `
  )), '');
  const shaper = <path className="ws function-path" d={shaperPath} />

  return (
    <div
      className="visualization small"
      onMouseMove={handleMouseMove}
    >
      <svg id="preview-waveshaper" className="visualization-svg ws small" width="15.3rem" height="18rem">
        <g transform={`translate( ${wPx * 0.41} ${wPy * 0.77} )`} >

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
          <text className="dim-text h-over signal" x={0} y={inDotY - dimTextOffset * 0.6}>Signal</text>

          <text className="dim-text h-over" x={sAsX(Math.min(-1, Math.max(-1.4, inMin)))} y={inDotY - dimTextOffset * 0.6}>In min</text>
          <circle className="dot" cx={sAsX(inMin)} cy={inDotY} r={dotRadius} />

          <text className="dim-text h-over" x={sAsX(Math.min(2, Math.max(1, inMax)))} y={inDotY - dimTextOffset * 0.6}>In max</text>
          <circle className="dot" cx={sAsX(inMax)} cy={inDotY} r={dotRadius} />

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
            M ${outDotX} ${outMin * y1}
            L ${outDotX} ${outMax * y1}  
            L ${x2 + dimMargin} ${y1}  
            L ${x2 + dimMargin} ${y2}    
          `} />
          <line className="scaler-edge" x1={x2 + dimMargin} y1={y1} x2={outDotX} y2={outMax * y1} />
          <line className="scaler-edge" x1={x2 + dimMargin} y1={y2} x2={outDotX} y2={outMin * y1} />
      

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
          <circle className="dot" cx={outDotX} cy={outMax * y1} r={dotRadius} />
          <text className="dim-text h-over" x={outDotX} y={y1 * (Math.min(3, Math.max(-1.2, outMax))) - remAsPx(0.5)}>Out max</text>

          <circle className="dot" cx={outDotX} cy={outMin * y1} r={dotRadius} />
          <text className="dim-text h-under" x={outDotX} y={y1 * (Math.min(3.2, Math.max(-1.2, outMin))) + remAsPx(0.3)}>Out min</text>

          <text className="dim-text v signal" x={x2 * 2.5} y={y1 * 0.55}>Out</text>

          {shaper}
        </g>
      </svg>
    </div>
  )

})

export default VisualizationWaveshaper
