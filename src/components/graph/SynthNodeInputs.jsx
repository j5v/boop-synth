import './SynthNodeInputs.css'
import { asRem, pxAsRem, remAsPx } from '../../lib/utils.js'
import { getSynthNodeTerminalIntentsById } from '../../lib/synth.js'
import { nodeLayout } from '../../lib/nodeLayout.js'
import usePatchStore from '../../store/patchStore.jsx'

function SynthNodeInputs(props) {

  const { synthNode } = props;
  const { inputs } = synthNode;
  const { nodeVSpacing, nodeVOffset, nodeBottomPadding } = nodeLayout;

  const setLinkDragFromInput = usePatchStore((state) => state.setLinkDragFromInput);

  const handleMouseDown = (event, spec) => {
    event.stopPropagation();
    setLinkDragFromInput(spec);
  }

  let py = nodeVOffset;

  return (
    (inputs || []).map(i => {
      if (i.exposed) {
        const classCSS = `terminal ${
          getSynthNodeTerminalIntentsById(i.intentId).classCSS
        }`;
        const classCSSOutline = 'terminal outline';
        py += nodeVSpacing;

        // cache positions for 'new Link dragging'
        i.posY = py;
        i.posX = synthNode.x;

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
              onMouseDown={(e) => handleMouseDown(e, {
                fromNode: synthNode,
                fromInput: i,
                loosePosX: synthNode.x,
                loosePosY: synthNode.y + i.posY,
                prevPageX: pxAsRem(e.pageX),
                prevPageY: pxAsRem(e.pageY),
              })}
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
