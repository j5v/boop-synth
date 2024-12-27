import './SynthNodeInputs.css'
import { asRem, remAsPx } from '../lib/utils.js'
import { getSynthNodeTerminalIntentsById } from '../lib/synth.js'

function SynthNodeInputs(props) {

  const { synthNode } = props;
  const { inputs } = synthNode;

  let py = 1;

  return (
    (inputs || []).map(i => {
      if (i.exposed) {
        const classCSS = getSynthNodeTerminalIntentsById(i.intentId).classCSS;
        const classCSSOutline = 'terminal-outline';
        py += 2;

        return (
          <g key={i.id}>
            <circle
              className={classCSSOutline}
              cx={asRem(synthNode.x)}
              cy={asRem(synthNode.y + py)}
              r={remAsPx(0.4) + 2}
            />
            <circle
              className={classCSS}
              cx={asRem(synthNode.x)}
              cy={asRem(synthNode.y + py)}
              r={asRem(0.4)}
            />
            <text
              className="terminal-input-label"
              x={asRem(synthNode.x + 1)}
              y={asRem(synthNode.y + py + 0.06)}
            >{i.displayName}</text>
          </g>
        )
      }
    })
  )
}

export default SynthNodeInputs
