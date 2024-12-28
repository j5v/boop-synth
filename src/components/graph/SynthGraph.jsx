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

  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [showDragging, setShowDragging] = useState(false);


  // begin drag

  const selectNode = usePatchStore((state) => state.selectNode)

  const handleMouseDown = (event) => {
    setDragging(true);

    setPosX(pxAsRem(event.pageX));
    setPosY(pxAsRem(event.pageY));
    // console.log('mouseDown', posX, posY);
  };

  // drag move

  const dragSelectedNodes = usePatchStore((state) => state.dragSelectedNodes)
  
  const handleMouseMove = (event) => {
    if (dragging) {
      setShowDragging(true);
      event.stopPropagation();

      const xDiffRem = pxAsRem(event.pageX) - posX;
      const yDiffRem = pxAsRem(event.pageY) - posY;

      // console.log('mouseMove', { dragging, posX, posY, pageX: event.pageX, pageY: event.pageY, xDiffRem, yDiffRem } );

      setPosX(pxAsRem(event.pageX));
      setPosY(pxAsRem(event.pageY));

      dragSelectedNodes(xDiffRem, yDiffRem);
    }
  };

  // end drag
  
  const handleMouseUp = (event) => {
    setDragging(false);
    setShowDragging(false);
    // console.log('mouseUp', { dragging });

    event.stopPropagation();
  };

  return (
    <svg
      className={'SynthGraph' + (showDragging ? ' dragging' : '')}
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
