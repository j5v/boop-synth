import './SynthNodeLink.css'
import { remAsPx } from '../../lib/utils.js'

function SynthNodeLink({
  outputPos, inputPos,
  isFeedback,
  outputIndex, inputIndex,
  outputBox, inputBox
}) {

  // get 8-point compass zone, of direction of Out, from In.

  const midpointPos = {
    x: inputPos.x * 0.5 + outputPos.x * 0.5,
    y: inputPos.y * 0.5 + outputPos.y * 0.5
  }

  const hangOut = Math.min(1.4,
    Math.min(
      Math.abs(inputPos.x - outputPos.x - 6) * 0.25,
      Math.abs(inputPos.y - outputPos.y) * 0.25,
      2
    )
  ); // Straight line extent, near terminals.

  if (!outputBox) { // dragging a new connection
    const path = `
      M ${remAsPx(outputPos.x)}, ${remAsPx(outputPos.y)}

      L ${remAsPx(outputPos.x + hangOut)}, ${remAsPx(outputPos.y)}

      S ${remAsPx(outputPos.x + hangOut * 4)}, ${remAsPx(outputPos.y)}
        ${remAsPx(midpointPos.x)}, ${remAsPx(midpointPos.y)}
        
      S ${remAsPx(inputPos.x - hangOut)}, ${remAsPx(inputPos.y)}
        ${remAsPx(inputPos.x - hangOut)}, ${remAsPx(inputPos.y)}

      L ${remAsPx(inputPos.x)}, ${remAsPx(inputPos.y)}
    `;
    return (
      <>
        <path
          className="synth-node-cable-outline"
          d={path}
        />
        <path
          className={`synth-node-cable${isFeedback ? ' feedback' : ''}`}
          d={path}
        />
      </>
    );
  }

  const conduitSpaceH = 2;
  const conduitSpaceV = 1;
  const outboundOffset = 1;
  const gangGap = 0.5; // for parallel cables near terminals.

  const iG = (inputIndex - 1) * gangGap;
  const oG = (outputIndex - 1) * gangGap;


  const outT = outputBox.y - conduitSpaceV;
  const outR = outputBox.x + outputBox.w + conduitSpaceH;
  const outB = outputBox.y + outputBox.h + conduitSpaceV;
  const outL = outputBox.x - conduitSpaceH;

  const inT = inputBox.y - conduitSpaceV;
  const inR = inputBox.x + inputBox.w + conduitSpaceH;
  const inB = inputBox.y + inputBox.h + conduitSpaceV;
  const inL = inputBox.x - conduitSpaceH;


  const outIsWestern = (outputBox.x + outputBox.w) < (inputBox.x)
  const outIsEastern = (inputBox.x + inputBox.w) < (outputBox.x)
  
  const outIsNorthern = (outputBox.y + outputBox.h + conduitSpaceV * 2) < (inputBox.y)
  const outIsSouthern = (inputBox.y + conduitSpaceV) < (outputBox.y)
  
  // console.log({ outIsWestern });


  const routes = {
    LEGACY: {
      id: 1, d: 'legacy'
    },
    AROUND_TOP_OF_OUT_AND_OVER_IN: {
      id: 2, d: 'around top of Out, over In' // keep left ASAP
    },
    AROUND_BOTTOM_OF_OUT_AND_OVER_IN: {
      id: 3, d: 'around bottom of Out, over In'  // keep left ASAP
    },
    AROUND_BOTTOM_OF_OUT_AND_UNDER_IN: {
      id: 4, d: 'around bottom of Out, under In'  // keep left ASAP
    },
    AROUND_TOP_OF_OUT_AND_STAY_LEFT_OF_IN: {
      id: 5, d: 'around top of Out, stay left of In'
    },
    SWEEP_BETWEEN: {
      id: 6, d: 'sweep between' // refine, especially at centre/overlap
    },
  }

  const lowerDiag = {
    x: (outputBox.x + outputBox.w) - (inputBox.x),
    y: (outputBox.y) - (inputBox.y + inputBox.h)
  }
  const upperDiag = {
    x: (outputBox.x + outputBox.w) - (inputBox.x),
    y: (outputBox.y + outputBox.h) - (inputBox.y)
  }


  const routeId = outIsWestern ? routes.LEGACY.id : (
    outIsEastern ? (
      outIsNorthern ?
        routes.AROUND_BOTTOM_OF_OUT_AND_OVER_IN.id :
        outIsSouthern ? 
          routes.AROUND_BOTTOM_OF_OUT_AND_UNDER_IN.id :
          routes.AROUND_TOP_OF_OUT_AND_OVER_IN.id
    ) : (
      outIsSouthern ? (
        lowerDiag.x > lowerDiag.y && outT < inB + conduitSpaceV ?
          routes.AROUND_BOTTOM_OF_OUT_AND_UNDER_IN.id :
          outL < inL ?
            routes.AROUND_TOP_OF_OUT_AND_STAY_LEFT_OF_IN.id :
            routes.AROUND_TOP_OF_OUT_AND_STAY_LEFT_OF_IN.id
      ) : ( 
        upperDiag.x > -upperDiag.y ? (
          outB > inT - conduitSpaceV * 2 ?
            routes.AROUND_TOP_OF_OUT_AND_STAY_LEFT_OF_IN.id :
            routes.AROUND_BOTTOM_OF_OUT_AND_UNDER_IN.id
        ) :
        routes.LEGACY.id
      )
    )
  );


  let path;

  switch(routeId) {
    case routes.LEGACY.id:
      path = `
        M ${remAsPx(outputPos.x)}, ${remAsPx(outputPos.y)}

        L ${remAsPx(outputPos.x + hangOut)}, ${remAsPx(outputPos.y)}

        S ${remAsPx(outputPos.x + hangOut * 4)}, ${remAsPx(outputPos.y)}
          ${remAsPx(midpointPos.x)}, ${remAsPx(midpointPos.y)}
          
        S ${remAsPx(inputPos.x - hangOut)}, ${remAsPx(inputPos.y)}
          ${remAsPx(inputPos.x - hangOut)}, ${remAsPx(inputPos.y)}

        L ${remAsPx(inputPos.x)}, ${remAsPx(inputPos.y)}
      `;
      break;
    case routes.AROUND_TOP_OF_OUT_AND_OVER_IN.id: 
      path = `
        M ${remAsPx(outputPos.x)}, ${remAsPx(outputPos.y)}
        L ${remAsPx(outR)}, ${remAsPx(outputPos.y)}
        
        L ${remAsPx(outR)}, ${remAsPx(outT)}
        L ${remAsPx(outR)}, ${remAsPx(outT)}
        L ${remAsPx(inL)}, ${remAsPx(outT)}
        L ${remAsPx(inL)}, ${remAsPx(inputPos.y)}

        L ${remAsPx(inputPos.x)}, ${remAsPx(inputPos.y)}
      `;
      break;
    case routes.AROUND_BOTTOM_OF_OUT_AND_OVER_IN.id: // ./
      path = `
        M ${remAsPx(outputPos.x)}, ${remAsPx(outputPos.y)}
        S ${remAsPx(outR + hangOut + oG - iG)}, ${remAsPx(outputPos.y)}
          ${remAsPx(outR + hangOut + oG - iG)}, ${remAsPx(lerp(Math.max(inT, outB), outputPos.y), 0.3)}

        S ${remAsPx(outR + oG - iG)}, ${remAsPx(Math.max(inT, outB) - iG)}
          ${remAsPx(Math.max(outR - hangOut * 2, lerp(outR, inL, 0.5)) + oG - iG)}, ${remAsPx(Math.max(inT, outB) - iG)}

        ${outL < inL ? `
            L ${remAsPx(outL)}, ${remAsPx(outT)}
            S ${remAsPx(inL - iG)}, ${remAsPx(inT - iG)}
          `: `
            L ${remAsPx(lerp(outR, inL, 0.1))}, ${remAsPx(inT - iG)}
            S ${remAsPx(inL - iG)}, ${remAsPx(inT - iG)}
          `}
        
          ${remAsPx(inL - iG)}, ${remAsPx(lerp(inT - iG, inputPos.y))}
          
        Q ${remAsPx(inL - iG)}, ${remAsPx(inputPos.y)}
          ${remAsPx(lerp(inL - iG, inputPos.x, 0.2))}, ${remAsPx(inputPos.y)}
        L ${remAsPx(inputPos.x)}, ${remAsPx(inputPos.y)}
      `;
      break;
    case routes.AROUND_BOTTOM_OF_OUT_AND_UNDER_IN.id: // ./
      path = `
        M ${remAsPx(outputPos.x)}, ${remAsPx(outputPos.y)}
        S ${remAsPx(outR + hangOut + oG - iG)}, ${remAsPx(outputPos.y)}
          ${remAsPx(outR + hangOut + oG - iG)}, ${remAsPx(lerp(Math.max(inT, outB), outputPos.y), 0.5)}

        S ${remAsPx(outR + oG - iG)}, ${remAsPx(Math.max(inT - iG, outB + iG))}
          ${remAsPx(Math.max(outR - hangOut * 2, lerp(outR, inL, 0.5)) - iG)}, ${remAsPx(Math.max(inT - iG, outB + iG))}
        ${outIsSouthern ? `
            L ${remAsPx(lerp(outL, outR, 0.9))}, ${remAsPx(Math.max(inT - iG, outB + iG))}
            S ${remAsPx(Math.min(inputPos.x - hangOut, outL) - iG)}, ${remAsPx(Math.max(inT - iG, outB + iG))}
              ${remAsPx(Math.min(inputPos.x - hangOut, outL) - iG)}, ${remAsPx(lerp(Math.max(inT - iG, outB + iG), inputPos.y))}
            S ${remAsPx(Math.min(inputPos.x - hangOut, outL) - iG)}, ${remAsPx(inputPos.y)}
              ${remAsPx(inputPos.x)}, ${remAsPx(inputPos.y)}
          `: `
            L ${remAsPx(lerp(inL, outR, 0.9))}, ${remAsPx(Math.max(inT - iG, outB + iG))}
            S ${remAsPx(Math.min(inputPos.x - hangOut, inL) - iG)}, ${remAsPx(Math.max(inT - iG, outB + iG))}
              ${remAsPx(Math.min(inputPos.x - hangOut, inL) - iG)}, ${remAsPx(lerp(Math.max(inT - iG, outB + iG), inputPos.y))}
            S ${remAsPx(Math.min(inputPos.x - hangOut, inL) - iG)}, ${remAsPx(inputPos.y)}
              ${remAsPx(inputPos.x)}, ${remAsPx(inputPos.y)}
          `}
        

        L ${remAsPx(inputPos.x)}, ${remAsPx(inputPos.y)}
      `;
      break;
    case routes.AROUND_TOP_OF_OUT_AND_STAY_LEFT_OF_IN.id: 
      path = `
        M ${remAsPx(outputPos.x)}, ${remAsPx(outputPos.y)}
        L ${remAsPx(outR)}, ${remAsPx(outputPos.y)}

        L ${remAsPx(outR)}, ${remAsPx(outT - outboundOffset)}

        ${outIsSouthern && outL < inL ? `
          L ${remAsPx(Math.max(outL, inL))}, ${remAsPx(outT - outboundOffset)}
          L ${remAsPx(Math.max(outL, inL))}, ${remAsPx(inputPos.y)}
        `: `
          L ${remAsPx(Math.min(outL - outboundOffset, inL))}, ${remAsPx(outT - outboundOffset)}
          L ${remAsPx(Math.min(outL - outboundOffset, inL))}, ${remAsPx(inputPos.y)}
        `}        
        
        L ${remAsPx(inputPos.x)}, ${remAsPx(inputPos.y)}
      `;
      break;
    case routes.SWEEP_BETWEEN.id: 
      path = `
        M ${remAsPx(outputPos.x)} ${remAsPx(outputPos.y)}  
        L ${remAsPx(outR)} ${remAsPx(outputPos.y)}  

        L ${remAsPx(outR)} ${remAsPx(outB)}  
        L ${remAsPx(inL)} ${remAsPx(inT)}  

        L ${remAsPx(inL)} ${remAsPx(inputPos.y)}
        L ${remAsPx(inputPos.x)} ${remAsPx(inputPos.y)}
      `;
      break;
    default: path = '';
  }
  
  const routeDesc = Object.entries(routes).find(i => i[1].id == routeId)[1].d;

  return (
    <>
      <path
        className="synth-node-cable-outline"
        d={path}
      />
      <path
        className={`synth-node-cable${isFeedback ? ' feedback' : ''}`}
        d={path}
      />
      {/* <text x={remAsPx(midpointPos.x)} y={remAsPx(midpointPos.y - 1)} fill="white">Western: {outIsWestern ? 'Y':'N'}</text>
      <text x={remAsPx(midpointPos.x)} y={remAsPx(midpointPos.y + 0)} fill="white">Eastern: {outIsEastern ? 'Y':'N'}</text>
      <text x={remAsPx(midpointPos.x)} y={remAsPx(midpointPos.y + 1)} fill="white">Southern: {outIsSouthern ? 'Y':'N'}</text>
      <text x={remAsPx(midpointPos.x)} y={remAsPx(midpointPos.y + 2)} fill="white">Northern: {outIsNorthern ? 'Y':'N'}</text> */}
      {/* <text x={remAsPx(outputPos.x + 1)} y={remAsPx(outputPos.y + 0.3)} fill="white">Route: {routeDesc}</text> */}
      </>
  );

  function lerp(a, b, f = 0.5) { return a * f + b * (1 - f) };

}

export default SynthNodeLink
