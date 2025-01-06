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

  // Drag Link from Input

  const setLinkDragFromInput = usePatchStore(
    (state) => state.setLinkDragFromInput
  );
  const endDragLinkFromInput = usePatchStore(
    (state) => state.endDragLinkFromInput
  );
  const dragLinkFromInputState = usePatchStore(
    (state) => state.ui.draggingLinkFromInput
  );

  const doDragLinkFromInput = (event) => {
    // event.stopPropagation();

    const newPageX = pxAsRem(event.pageX);
    const newPageY = pxAsRem(event.pageY);

    const xDiffRem = newPageX - dragLinkFromInputState.prevPageX;
    const yDiffRem = newPageY - dragLinkFromInputState.prevPageY;

    const spec = {
      ...structuredClone(dragLinkFromInputState),
      loosePosX: dragLinkFromInputState.loosePosX + xDiffRem,  // change when implementing zoom and pan
      loosePosY: dragLinkFromInputState.loosePosY + yDiffRem,
      prevPageX: newPageX,
      prevPageY: newPageY,
    }

    setLinkDragFromInput(spec);
  };
  
  const doEndDragLinkFromInput = (event) => {
    endDragLinkFromInput();
    event.stopPropagation();
  };


  // Drag Link from Output

  const setLinkDragFromOutput = usePatchStore(
    (state) => state.setLinkDragFromOutput
  );
  const endDragLinkFromOutput = usePatchStore(
    (state) => state.endDragLinkFromOutput
  );
  const dragLinkFromOutputState = usePatchStore(
    (state) => state.ui.draggingLinkFromOutput
  );

  const handleOnClick = (event) => {
    // console.log('SynthNodeBox:handleClick() to unselect all nodes')
    selectThisNode();
  }

  const doDragLinkFromOutput = (event) => {
    // event.stopPropagation();

    const newPageX = pxAsRem(event.pageX);
    const newPageY = pxAsRem(event.pageY);

    const xDiffRem = newPageX - dragLinkFromOutputState.prevPageX;
    const yDiffRem = newPageY - dragLinkFromOutputState.prevPageY;

    const spec = {
      ...structuredClone(dragLinkFromOutputState),
      loosePosX: dragLinkFromOutputState.loosePosX + xDiffRem,  // change when implementing zoom and pan
      loosePosY: dragLinkFromOutputState.loosePosY + yDiffRem,
      prevPageX: newPageX,
      prevPageY: newPageY,
    }

    setLinkDragFromOutput(spec);
  };
  
  const doEndDragLinkFromOutput = (event) => {
    endDragLinkFromOutput();
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


  // Keyboard shortcuts

  const removeSelectedNodes = usePatchStore((state) => state.removeSelectedNodes)
  const duplicateSelectedNodes = usePatchStore((state) => state.duplicateSelectedNodes)
  const selectAllNodes = usePatchStore((state) => state.selectAllNodes)

  const handleKeyDown = (event) => {
    const k = event.key.toLowerCase();
    // console.log(event);

    // TODO: remove unnecessary event blockers.

    if (k == 'delete' || k == 'x') {
      removeSelectedNodes();
      event.stopPropagation();
      event.preventDefault();

    } else if (k == 'v') {
      duplicateSelectedNodes();
      event.stopPropagation();
      event.preventDefault();

    } else if (k == 'a' && event.ctrlKey == true) {
      selectAllNodes();
      event.preventDefault();

    } else if (k == 'insert' || k == 'a') {
      event.preventDefault();
      document.getElementById('addNodeSelect').focus();
      document.getElementById('addNodeSelect').click();

    } else if (k == 'enter') {
      document.getElementById('playAudioButton').click();
      event.stopPropagation();
      event.preventDefault();

    }
    
  };


  // mouse event handlers

  const handleMouseDown = (event) => doDragNodeBegin(event);
  const handleMouseMove = (event) => {
    if (draggingNode) doDragNode(event);
    if (dragLinkFromInputState && dragLinkFromInputState.fromNode) doDragLinkFromInput(event);
    if (dragLinkFromOutputState && dragLinkFromOutputState.fromNode) doDragLinkFromOutput(event);
  }
  const handleMouseUp = (event) => {
    if (draggingNode) doDragNodeEnd(event);
    if (dragLinkFromInputState && dragLinkFromInputState.fromNode) doEndDragLinkFromInput(event);
    if (dragLinkFromOutputState && dragLinkFromOutputState.fromNode) doEndDragLinkFromOutput(event);
  }
  return (
    <svg
      role="list"
      className={'SynthGraph' + (showDraggingNode ? ' dragging' : '')}
      onClick={handleOnClick /* unselects all */}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}      
    >
      <SynthNodes />
      <SynthNodeLinks />
      <SynthNodeLinkConnecting />
    </svg>
  )
}

export default SynthGraph
