import './SynthNodeInputs.css' // deliberately Inputs
import { asRem, remAsPx } from '../../lib/utils.js'
import { getSynthNodeTerminalIntentsById } from '../../lib/synth.js'
import { nodeLayout } from '../../lib/nodeLayout.js'

function SynthNodeOutputs(props) {

  const { synthNode } = props;
  const { outputs } = synthNode;
  const { nodeVSpacing, nodeVOffset, nodeBottomPadding } = nodeLayout;

  let py = nodeVOffset;

  return (
    (outputs || []).map(i => {
      if (i.exposed) {
        py += nodeVSpacing;
        const classCSS = getSynthNodeTerminalIntentsById(i.intentId).classCSS;
        const classCSSOutline = 'terminal-outline';

        return (
          <g key={i.id}>
            <circle
              className={classCSSOutline}
              cx={asRem(synthNode.x + synthNode.w)}
              cy={asRem(synthNode.y + py)}
              r={remAsPx(0.4) + 2}
            />
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
        );

      }
    })
  )
}

export default SynthNodeOutputs
