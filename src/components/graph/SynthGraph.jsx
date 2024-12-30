import './SynthGraph.css'
import { useState } from 'react'
import usePatchStore from '../../store/patchStore.jsx'
import SynthNodes from './SynthNodes.jsx'
import SynthNodeLinks from './SynthNodeLinks.jsx'
import SynthNodeLinkConnecting from './SynthNodeLinkConnecting.jsx'
import { pxAsRem } from '../../lib/utils.js'

/* SynthGraph:
  - Contains the node graph and Links.
  - Handles mouse events for moving nodes.
  - Handles some of the mouse events for connecting nodes.
*/

function SynthGraph() {

  const selectThisNode = usePatchStore(
    // On the SynthGraph (background), click unselects all nodes.
    // In SynthNodes[<SynthNode>] click on a node to select it.
    (state) => state.selectExclusiveNode
  );

  const [prevDragPosX, setPrevDragPosX] = useState(0);
  const [prevDragPosY, setPrevDragPosY] = useState(0);
  const [draggingNode, setDraggingNode] = useState(false);
  const [showDraggingNode, setShowDraggingNode] = useState(false);


  // Drag new Link
  const setLinkDragFromInput = usePatchStore(
    (state) => state.setLinkDragFromInput
  );
  const endDragLinkFromInput = usePatchStore(
    (state) => state.endDragLinkFromInput
  );
  const dragLinkState = usePatchStore(
    (state) => state.ui.draggingLinkFromInput
  );

  const doDragLinkFromInput = (event) => {
    // event.stopPropagation();

    const newPageX = pxAsRem(event.pageX);
    const newPageY = pxAsRem(event.pageY);

    const xDiffRem = newPageX - dragLinkState.prevPageX;
    const yDiffRem = newPageY - dragLinkState.prevPageY;

    const spec = {
      ...structuredClone(dragLinkState),
      loosePosX: dragLinkState.loosePosX + xDiffRem,  // change when implementing zoom and pan
      loosePosY: dragLinkState.loosePosY + yDiffRem,
      prevPageX: newPageX,
      prevPageY: newPageY,
    }

    setLinkDragFromInput(spec);
  };
  
  const doEndDragLinkFromInput = (event) => {
    endDragLinkFromInput();
    event.stopPropagation();
  };


  // Drag node

  const dragSelectedNodes = usePatchStore((state) => state.dragSelectedNodes)

  const doDragNodeBegin = (event) => {
    setDraggingNode(true);

    setPrevDragPosX(pxAsRem(event.pageX));
    setPrevDragPosY(pxAsRem(event.pageY));
    // console.log('mouseDown', posX, posY);
  };

  const doDragNode = (event) => {
    setShowDraggingNode(true);
    event.stopPropagation();

    const xDiffRem = pxAsRem(event.pageX) - prevDragPosX;
    const yDiffRem = pxAsRem(event.pageY) - prevDragPosY;

    setPrevDragPosX(pxAsRem(event.pageX)); // change when implementing zoom and pan
    setPrevDragPosY(pxAsRem(event.pageY));

    dragSelectedNodes(xDiffRem, yDiffRem);
  };

  const doDragNodeEnd = (event) => {
    setDraggingNode(false);
    setShowDraggingNode(false);
    event.stopPropagation();
  };

  // mouse event handlers
  const handleMouseDown = (event) => doDragNodeBegin(event);
  const handleMouseMove = (event) => {
    if (draggingNode) doDragNode(event);
    if (dragLinkState && dragLinkState.fromNode) doDragLinkFromInput(event);
  }
  const handleMouseUp = (event) => {
    if (draggingNode) doDragNodeEnd(event);
    if (dragLinkState && dragLinkState.fromNode) doEndDragLinkFromInput(event);
  }
  return (
    <svg
      className={'SynthGraph' + (showDraggingNode ? ' dragging' : '')}
      onClick={selectThisNode /* unselects all */}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <SynthNodes />
      <SynthNodeLinks />
      <SynthNodeLinkConnecting />
    </svg>
  )
}

export default SynthGraph
