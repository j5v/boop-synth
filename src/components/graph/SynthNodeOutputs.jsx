import './SynthNodeInputs.css' // deliberately Inputs
import { memo } from 'react';
import { asRem, pxAsRem, remAsPx } from '../../lib/utils.js'
import { getSynthNodeTerminalIntentsById } from '../../lib/synth.js'
import { nodeLayout } from '../../lib/nodeLayout.js'
import usePatchStore from '../../store/patchStore.jsx'

const SynthNodeOutputs = memo(function SynthNodeOutputs(props) {

  const { synthNode } = props;
  const { outputs } = synthNode;
  const { nodeVSpacing, nodeVOffset, labelPadding, dragLeft, dragRight, dragTop, dragBottom } = nodeLayout;

  const removeLinksFromOutput = usePatchStore((state) => state.removeLinksFromOutput);

  const setLinkDragFromOutput = usePatchStore((state) => state.setLinkDragFromOutput);
  const setLinkDragFromInput = usePatchStore((state) => state.setLinkDragFromInput);
  
  const endDragLinkFromInput = usePatchStore((state) => state.endDragLinkFromInput);
  const setNewLinkFromInput = usePatchStore((state) => state.setNewLinkFromInput);
  
  const draggingLinkFromOutput = usePatchStore((state) => state.ui.draggingLinkFromOutput);
  const draggingLinkFromInput = usePatchStore((state) => state.ui.draggingLinkFromInput);
  
  const clearLinkDragging = usePatchStore((state) => state.clearLinkDragging);

  // events
  const LEFT_BUTTON = 0;

  const handleMouseDown = (event, spec) => {
    // Begin dragging a link from this Output to an Input
    if (event.button == LEFT_BUTTON) {
      event.stopPropagation();
      setLinkDragFromOutput(spec);
    }
  }

  const handleMouseMove = (event, spec) => {
    // Continue dragging a link from an Input to this Output
    // TODO: check logic - is this needed? Snaps to node?
    if (draggingLinkFromInput) {
      setLinkDragFromInput(spec);
    }
  }
  const handleMouseUp = (event, spec) => {
    // Stop dragging a link from an Input to this Output
    if (draggingLinkFromInput) {
      setNewLinkFromInput(spec);
      endDragLinkFromInput();
    }
  }
  
  const handleDoubleClick = (outputNodeId, outputId) => {
    // Remove a node link
    removeLinksFromOutput(outputNodeId, outputId);
  }

  let py = nodeVOffset;

  return (
    (outputs || []).map(i => {
      if (i.exposed) {
        const classCSS = `terminal ${
          getSynthNodeTerminalIntentsById(i.intentId).classCSS
        }`;
        const classCSSOutline = `terminal outline`;

        py += nodeVSpacing;

        // cache positions for 'new Link dragging'
        i.posY = py;
        i.posX = synthNode.x;

        const loosePosX = synthNode.x;
        const loosePosY = synthNode.y + i.posY;

        return (
          <g key={i.id} className="terminal-group">
            <title>{i.description}</title>
            <rect
              className={`drag-zone${ draggingLinkFromOutput ? ' hidden' : ''}`}
              x={asRem(synthNode.x + synthNode.w - dragLeft)}
              y={asRem(synthNode.y + py - dragTop)}
              width={asRem(dragLeft + dragRight)}
              height={asRem(dragTop + dragBottom)}
              onDoubleClick={(e) => handleDoubleClick(synthNode.id, i.id)}
              onMouseMove={(e) => handleMouseMove(e, {
                targetNode: synthNode,
                targetOutput: i,
                loosePosX,
                loosePosY,
                prevPageX: pxAsRem(loosePosX),
                prevPageY: pxAsRem(loosePosX),
              })}
              onMouseUp={(e) => handleMouseUp(e, {
                // stop dragging a link from an Input to this Output
                targetNode: synthNode,
                targetOutput: i,
                loosePosX,
                loosePosY,
                prevPageX: pxAsRem(loosePosX),
                prevPageY: pxAsRem(loosePosX),
              })}
              onMouseDown={(e) => handleMouseDown(e, {
                // New: begin dragging a link from this Output to an Input
                fromNode: synthNode,
                fromOutput: i,
                loosePosX: synthNode.x + synthNode.w,
                loosePosY: synthNode.y + i.posY,
                prevPageX: pxAsRem(e.pageX),
                prevPageY: pxAsRem(e.pageY),
              })}
            />
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
              x={asRem(synthNode.x + synthNode.w - labelPadding)}
              y={asRem(synthNode.y + py + 0.06)}
            >{i.displayName}</text>
          </g>
        );

      }
    })
  )
});

export default SynthNodeOutputs
