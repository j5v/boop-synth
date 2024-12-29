import './SynthGraph.css'
import { useState } from 'react'
import usePatchStore from '../../store/patchStore.jsx'
import SynthNodes from './SynthNodes.jsx'
import SynthNodeLinks from './SynthNodeLinks.jsx'
import { pxAsRem } from '../../lib/utils.js'

function SynthGraph() {

  const selectThisNode = usePatchStore(
    // On the SynthGraph (background), click unselects all nodes.
    // In SynthNodes[<SynthNode>] click on a node to select it.
    (state) => state.selectExclusiveNode
  );

  const [nodePosX, setNodePosX] = useState(0);
  const [nodePosY, setNodePosY] = useState(0);
  const [draggingNode, setDraggingNode] = useState(false);
  const [showDraggingNode, setShowDraggingNode] = useState(false);


  // Drag new connector

  // ...


  // Drag node

  const dragSelectedNodes = usePatchStore((state) => state.dragSelectedNodes)

  const doDragNodeBegin = (event) => {
    setDraggingNode(true);

    setNodePosX(pxAsRem(event.pageX));
    setNodePosY(pxAsRem(event.pageY));
    // console.log('mouseDown', posX, posY);
  };

  const doDragNode = (event) => {
    if (draggingNode) {
      setShowDraggingNode(true);
      event.stopPropagation();

      const xDiffRem = pxAsRem(event.pageX) - nodePosX;
      const yDiffRem = pxAsRem(event.pageY) - nodePosY;

      // console.log('mouseMove', { dragging, posX, posY, pageX: event.pageX, pageY: event.pageY, xDiffRem, yDiffRem } );

      setNodePosX(pxAsRem(event.pageX));
      setNodePosY(pxAsRem(event.pageY));

      dragSelectedNodes(xDiffRem, yDiffRem);
    }
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
    // if (draggingNode) doDragNode(event);
  }
  const handleMouseUp = (event) => doDragNodeEnd(event);
  
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
    </svg>
  )
}

export default SynthGraph
