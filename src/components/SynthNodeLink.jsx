import './SynthNodeLink.css'
import { remAsPx } from '../lib/utils.js'

function SynthNodeLink({ outputPos, inputPos }) {

  const hangOut = 1; // Straight line extent, near terminal.

  const midpointPos = {
    x: inputPos.x * 0.5 + outputPos.x * 0.5,
    y: inputPos.y * 0.5 + outputPos.y * 0.5
  }
  return (
    <path
      className="synth-node-cable"
      d={`M ${remAsPx(outputPos.x)}, ${remAsPx(outputPos.y)}

        L ${remAsPx(outputPos.x + hangOut)}, ${remAsPx(outputPos.y)}

        S ${remAsPx(outputPos.x + hangOut * 4)}, ${remAsPx(outputPos.y)}
          ${remAsPx(midpointPos.x)}, ${remAsPx(midpointPos.y)}
          
        S ${remAsPx(inputPos.x - hangOut)}, ${remAsPx(inputPos.y)}
          ${remAsPx(inputPos.x - hangOut)}, ${remAsPx(inputPos.y)}

        L ${remAsPx(inputPos.x)}, ${remAsPx(inputPos.y)}
      `}
    />
  );

}

export default SynthNodeLink
