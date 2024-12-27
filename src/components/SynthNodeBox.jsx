import './SynthNodeBox.css'
import usePatchStore from '../store/patchStore.jsx'
import { useRef } from 'react'
import { asRem } from '../lib/utils.js'

function SynthNodeBox(props) {

  const { synthNode } = props;

  // Calculate box height, based on the number of terminals

  const inputCount = (synthNode.inputs && synthNode.inputs.filter(i => i.exposed).length) || 0;
  const outputCount = (synthNode.outputs && synthNode.outputs.length) || 0;
  const maxTerminals = Math.max(inputCount, outputCount);
  const nodeHeight = 2 + maxTerminals * 2.25;

  // Selection: event, state, and CSS classes

  const selectThisNode = usePatchStore((state) => state.selectExclusiveNode)

  const handleClick = (event) => {
    // Prevent a click on parent/background from unselecting all nodes
    event.stopPropagation();
    selectThisNode(synthNode.id);
  };

  const classes = ['SynthNodeBox'];
  if (synthNode.selected) classes.push('selected');

  // DRAG
  // begin drag

  const handleMouseMove = useRef(e => {
    setPosition(position => {
      const xDiff = position.coords.x - e.pageX;
      const yDiff = position.coords.y - e.pageY;
      return {
        x: position.x - xDiff,
        y: position.y - yDiff,
        coords: {
          x: e.pageX,
          y: e.pageY,
        },
      };
    });
  });

  // end drag

  return (
    <rect
      className={classes.join(' ')}
      x={asRem(synthNode.x)}
      y={asRem(synthNode.y)}
      rx="0.6rem"
      width={asRem(synthNode.w)}
      height={asRem(nodeHeight)}
      onClick={handleClick}
    />
  )
}

export default SynthNodeBox
