import { memo } from 'react';
import React from 'react' // not needed to build; satisfies a code checker

import './SynthNodeInputs.css'
import { asRem, pxAsRem, remAsPx, getItemById } from '../../lib/utils.js'
import { getNodeTypeById } from '../../lib/synthNodeTypes.js'
import { getSynthNodeTerminalIntentsById } from '../../lib/synthNodeIntents';
import { nodeLayout } from '../../lib/nodeLayout.js'
import usePatchStore from '../../store/patchStore.jsx'

const SynthNodeInputs = memo(function SynthNodeInputs(props) {

  // @ts-ignore
  const { synthNode } = props;
  const { inputs } = synthNode;
  const nodeType = getNodeTypeById(synthNode.nodeTypeId);

  const { nodeVSpacing, nodeVOffset, labelPadding, dragLeft, dragRight, dragTop, dragBottom } = nodeLayout;

  const removeLinkFromInput = usePatchStore((state) => state.removeLinkFromInput);
  
  const setLinkDragFromInput = usePatchStore((state) => state.setLinkDragFromInput);
  const setLinkDragFromOutput = usePatchStore((state) => state.setLinkDragFromOutput);
  
  const endDragLinkFromOutput = usePatchStore((state) => state.endDragLinkFromOutput);
  const setNewLinkFromOutput = usePatchStore((state) => state.setNewLinkFromOutput);
  
  const draggingLinkFromInput = usePatchStore((state) => state.ui.draggingLinkFromInput);
  const draggingLinkFromOutput = usePatchStore((state) => state.ui.draggingLinkFromOutput);

  // events
  const LEFT_BUTTON = 0;

  const handleMouseDown = (event, spec) => {
    // Begin dragging a link from this Input to an Output
    if (event.button == LEFT_BUTTON) {
      event.stopPropagation();
      setLinkDragFromInput(spec);
    }
  }

  const handleMouseMove = (event, spec) => {
    // Continue dragging a link from an Output to this Input
    if (draggingLinkFromOutput) {
      setLinkDragFromOutput(spec);
    }
  }

  const handleMouseUp = (event, spec) => {
    // Stop dragging a link from an Output to this Input
    if (draggingLinkFromOutput)  {
      setNewLinkFromOutput(spec);
      endDragLinkFromOutput();
    }
  }

  const handleDoubleClick = (targetInput) => {
    // Remove a node link
    removeLinkFromInput(targetInput);
  }

  let py = nodeVOffset;

  return (
    (inputs || []).map(i => {
      if (i.exposed) {
        const nodeTypeInput = getItemById(nodeType.inputs, i.id); // get matching input in synthNodeTypes

        const classCSS = `terminal ${
          // @ts-ignore
          getSynthNodeTerminalIntentsById(nodeTypeInput.intentId).classCSS
        }`;
        const classCSSOutline = 'terminal outline';

        py += nodeVSpacing;

        // cache positions for 'new Link dragging'
        i.posY = py;
        i.posX = synthNode.x;

        const loosePosX = synthNode.x;
        const loosePosY = synthNode.y + i.posY;

        return (
          <g key={i.id} className="terminal-group">
            <title>{nodeTypeInput.description}</title>
            <rect
              className={`drag-zone${ draggingLinkFromInput ? ' hidden' : ''}`}
              x={asRem(synthNode.x - dragLeft)}
              y={asRem(synthNode.y + py - dragTop)}
              width={asRem(dragLeft + dragRight)}
              height={asRem(dragTop + dragBottom)}
              onDoubleClick={(e) => handleDoubleClick(i)}
              onMouseDown={(e) => handleMouseDown(e, {
                // begin dragging a link from this Input to an Output
                fromNode: synthNode,
                fromInput: i,
                loosePosX: synthNode.x,
                loosePosY: synthNode.y + i.posY,
                prevPageX: pxAsRem(e.pageX),
                prevPageY: pxAsRem(e.pageY),
              })}
              onMouseMove={(e) => handleMouseMove(e, {
                // New
                targetNode: synthNode,
                targetInput: i,
                loosePosX,
                loosePosY,
                prevPageX: pxAsRem(loosePosX),
                prevPageY: pxAsRem(loosePosX),
              })}
              onMouseUp={(e) => handleMouseUp(e, {
                // New
                // stop dragging a link from an Output to this Input
                targetNode: synthNode,
                targetInput: i,
                loosePosX,
                loosePosY,
                prevPageX: pxAsRem(loosePosX),
                prevPageY: pxAsRem(loosePosX),
              })}
            />
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
              x={asRem(synthNode.x + labelPadding)}
              y={asRem(synthNode.y + py + 0.06)}              
            >{nodeTypeInput.displayName}</text>
          </g>
        )
      }
    })
  )
});

export default SynthNodeInputs
