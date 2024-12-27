import './SynthNodeBox.css'
import usePatchStore from '../../store/patchStore.jsx'
import { useRef, useState } from 'react'
import { asRem, remAsPx, pxAsRem } from '../../lib/utils.js'

function SynthNodeBox(props) {

  const { synthNode } = props;

  // Calculate box height, based on the number of terminals

  const inputCount = (synthNode.inputs && synthNode.inputs.filter(i => i.exposed).length) || 0;
  const outputCount = (synthNode.outputs && synthNode.outputs.length) || 0;
  const maxTerminals = Math.max(inputCount, outputCount);
  const nodeHeight = 2 + maxTerminals * 2.25;

  // Selection: event, state, and CSS classes

  const selectExclusiveNode = usePatchStore((state) => state.selectExclusiveNode)

  const handleClick = (event) => {
    // Prevent a click on parent/background from unselecting all nodes
    console.log('click');
    event.stopPropagation();
    selectExclusiveNode(synthNode.id);
  };

  const classes = ['SynthNodeBox'];
  if (synthNode.selected) classes.push('selected');

  // DRAG

  const [posX, setPosX] = useState(synthNode.x);
  const [posY, setPosY] = useState(synthNode.y);
  const [dragging, setDragging] = useState(false);

  // begin drag

  const selectNode = usePatchStore((state) => state.selectNode)
  const startDragSelectedNodes = usePatchStore((state) => state.startDragSelectedNodes)

  const handleMouseDown = (event) => {
    event.stopPropagation();

    setPosX(pxAsRem(event.pageX));
    setPosY(pxAsRem(event.pageY));
    console.log('mouseDown', posX, posY);

    selectNode(synthNode.id);
    startDragSelectedNodes();

    return;

  };

  // drag move
  const dragSelectedNodes = usePatchStore((state) => state.dragSelectedNodes)
  
  const handleMouseMove = (event) => {
    event.stopPropagation();

    const xDiffRem = pxAsRem(event.pageX) - posX;
    const yDiffRem = pxAsRem(event.pageY) - posY;

    console.log('mouseMove', { posX, posY, pageX: event.pageX, pageY: event.pageY, xDiffRem, yDiffRem } );
    setPosX(pxAsRem(event.pageX));
    setPosY(pxAsRem(event.pageY));

    dragSelectedNodes(xDiffRem, yDiffRem); // dx, dy
  };

  // end drag
  const endDragSelectedNodes = usePatchStore((state) => state.endDragSelectedNodes)

  const handleMouseUp = (event) => {
    console.log('mouseUp');
    event.stopPropagation();

    endDragSelectedNodes();
  };


  return (
    <rect
      className={classes.join(' ')}
      x={asRem(synthNode.x)}
      y={asRem(synthNode.y)}
      rx="0.6rem"
      width={asRem(synthNode.w)}
      height={asRem(nodeHeight)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    />
  )
}

export default SynthNodeBox
