import './SynthNodeBox.css'
import { asRem } from '../lib/utils.js'
import usePatchStore from '../store/patchStore.jsx'

function SynthNodeBox(props) {

  const { synthNode } = props;

  const classes = ['SynthNodeBox'];
  if (synthNode.selected) classes.push('selected');

  const inputCount = (synthNode.inputs && synthNode.inputs.length) || 0;
  const outputCount = (synthNode.outputs && synthNode.outputs.length) || 0;
  const maxTerminals = Math.max(inputCount, outputCount);
  const nodeHeight = 2 + maxTerminals * 2.25;

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
        height={asRem(nodeHeight)}
        onClick={handleClick}
      />
  )
}

export default SynthNodeBox
