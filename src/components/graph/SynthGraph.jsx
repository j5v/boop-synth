import './SynthGraph.css'
import { useState } from 'react'
import usePatchStore from '../../store/patchStore.jsx'
import SynthNodes from './SynthNodes.jsx'
import SynthNodeLinks from './SynthNodeLinks.jsx'
import SynthNodeLinkConnecting from './SynthNodeLinkConnecting.jsx'
import { pxAsRem } from '../../lib/utils.js'

/* SynthGraph:
  - Contains the node graph and connectors.
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


  // Drag new connector
  const setConnectorDragFromInput = usePatchStore(
    (state) => state.setConnectorDragFromInput
  );
  const endDragConnectorFromInput = usePatchStore(
    (state) => state.endDragConnectorFromInput
  );
  const dragConnectorState = usePatchStore(
    (state) => state.ui.draggingConnectorFromInput
  );

  const doDragConnectorFromInput = (event) => {
    // event.stopPropagation();

    const newPageX = pxAsRem(event.pageX);
    const newPageY = pxAsRem(event.pageY);

    const xDiffRem = newPageX - dragConnectorState.prevPageX;
    const yDiffRem = newPageY - dragConnectorState.prevPageY;

    const spec = {
      ...dragConnectorState,
      loosePosX: dragConnectorState.loosePosX + xDiffRem,  // change when implementing zoom and pan
      loosePosY: dragConnectorState.loosePosY + yDiffRem,
      prevPageX: newPageX,
      prevPageY: newPageY,
    }
    console.log('SynthGraph: doDragConnectorFromInput()', { spec } );

    setConnectorDragFromInput(spec);
  };
  
  const doEndDragConnectorFromInput = (event) => {
    // TODO: if on an output node, make the connection
    endDragConnectorFromInput();
    console.log('endDragConnectorFromInput()');

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

    // console.log('mouseMove', { dragging, posX, posY, pageX: event.pageX, pageY: event.pageY, xDiffRem, yDiffRem } );

    setPrevDragPosX(pxAsRem(event.pageX)); // change when implementing zoom and pan
    setPrevDragPosY(pxAsRem(event.pageY));

    dragSelectedNodes(xDiffRem, yDiffRem);
  };

  const doDragNodeEnd = (event) => {
    setDraggingNode(false);
    setShowDraggingNode(false);
    // console.log('mouseUp', { dragging });

    event.stopPropagation();
  };

  // mouse event handlers
  const handleMouseDown = (event) => doDragNodeBegin(event);
  const handleMouseMove = (event) => {
    if (draggingNode) doDragNode(event);
    if (dragConnectorState && dragConnectorState.fromNode) doDragConnectorFromInput(event);
  }
  const handleMouseUp = (event) => {
    if (draggingNode) doDragNodeEnd(event);
    if (dragConnectorState && dragConnectorState.fromNode) doEndDragConnectorFromInput(event);
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
