import './SynthNodeInputs.css'
import { asRem } from '../lib/utils.js'
import { getSynthNodeTerminalIntentsById } from '../lib/synth.js'

function SynthNodeOutputs(props) {

  const { synthNode } = props;
  const { outputs } = synthNode;

  let py = 1;

  return (
    (outputs || []).map(i => {
      py += 2;
      const classCSS = getSynthNodeTerminalIntentsById(i.intentId).classCSS;

      return (
        <g key={i.id}>
          <circle
            
            className={classCSS}
            cx={asRem(synthNode.x + synthNode.w)}
            cy={asRem(synthNode.y + py)}
            r={asRem(0.4)}
          />
          <text
            className="terminal-output-label"
            x={asRem(synthNode.x + synthNode.w - 1)}
            y={asRem(synthNode.y + py + 0.06)}
          >{i.displayName}</text>
        </g>
      )
    })
  )
}

export default SynthNodeOutputs
