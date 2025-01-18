import './SynthNodeLink.css'
import { remAsPx } from '../../lib/utils.js'

function SynthNodeLink({ outputPos, inputPos, isFeedback }) {

  const midpointPos = {
    x: inputPos.x * 0.5 + outputPos.x * 0.5,
    y: inputPos.y * 0.5 + outputPos.y * 0.5
  }

  const hangOut = Math.min(1.4,
    Math.abs(inputPos.x - outputPos.x - 6) * 0.5 *
    Math.min(0.3, Math.abs(inputPos.y - outputPos.y) * 0.05)
  ); // Straight line extent, near terminals.

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

export default SynthNodeLink
