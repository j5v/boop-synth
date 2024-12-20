import './SynthNodeBox.css'
import { asRem } from '../lib/utils.js'
import usePatchStore from '../store/patchStore.jsx'

function SynthNodeBox(props) {

  const { synthNode } = props;

  const classes = ['SynthNodeBox'];
  if (synthNode.selected) classes.push('selected');

  // Selection

  const selectThisNode = usePatchStore((state) => state.selectExclusiveNode)

  const handleClick = (event) => {
    // Prevent a click on parent/background from unselecting all nodes
    event.stopPropagation();
    selectThisNode(synthNode.id);
  };

  return (
      <rect
        className={classes.join(' ')}
        x={asRem(synthNode.x)}
        y={asRem(synthNode.y)}
        rx="0.6rem"
        width={asRem(synthNode.w)}
        height={asRem(synthNode.h)}
        onClick={handleClick}
      />
  )
}

export default SynthNodeBox
