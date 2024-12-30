import './SynthNodeInputs.css' // deliberately Inputs
import { asRem, pxAsRem, remAsPx } from '../../lib/utils.js'
import { getSynthNodeTerminalIntentsById } from '../../lib/synth.js'
import { nodeLayout } from '../../lib/nodeLayout.js'
import usePatchStore from '../../store/patchStore.jsx'

function SynthNodeOutputs(props) {

  const { synthNode } = props;
  const { outputs } = synthNode;
  const { nodeVSpacing, nodeVOffset, nodeBottomPadding } = nodeLayout;

  const setLinkDragFromInput = usePatchStore((state) => state.setLinkDragFromInput);
  const setNewLink = usePatchStore((state) => state.setNewLink);
  const endDragLinkFromInput = usePatchStore((state) => state.endDragLinkFromInput);

  const handleMouseMove = (event, spec) => {
    // event.stopPropagation();
    setLinkDragFromInput(spec);
  }
  const handleMouseUp = (event, spec) => {
    // event.stopPropagation();
    setNewLink(spec);
    endDragLinkFromInput();
  }

  let py = nodeVOffset;

  return (
    (outputs || []).map(i => {
      if (i.exposed) {
        py += nodeVSpacing;

        const classCSS = `terminal ${
          getSynthNodeTerminalIntentsById(i.intentId).classCSS
        }`;

        // highlight node if hovered over
        const classCSSOutline = `terminal outline`;

        const loosePosX = synthNode.x;
        const loosePosY = synthNode.y + i.posY;

        return (
          <g key={i.id}>
            <title>{i.description}</title>
            <circle
              className={classCSSOutline}
              cx={asRem(synthNode.x + synthNode.w)}
              cy={asRem(synthNode.y + py)}
              r={remAsPx(0.4) + 2}
            />
            <circle
              className={classCSS}
              onMouseMove={(e) => handleMouseMove(e, {
                targetNode: synthNode,
                targetOutput: i,
                loosePosX,
                loosePosY,
                prevPageX: pxAsRem(loosePosX),
                prevPageY: pxAsRem(loosePosX),
              })}
              onMouseUp={(e) => handleMouseUp(e, {
                targetNode: synthNode,
                targetOutput: i,
                loosePosX,
                loosePosY,
                prevPageX: pxAsRem(loosePosX),
                prevPageY: pxAsRem(loosePosX),
              })}
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
