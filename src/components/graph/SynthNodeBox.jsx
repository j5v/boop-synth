import './SynthNodeBox.css'
import usePatchStore from '../../store/patchStore.jsx'
import { asRem } from '../../lib/utils.js'
import { nodeLayout } from '../../lib/nodeLayout.js'

function SynthNodeBox(props) {

  const { synthNode } = props;

  // Calculate box height, based on the number of terminals

  const inputCount = (synthNode.inputs && synthNode.inputs.filter(i => i.exposed).length) || 0;
  const outputCount = (synthNode.outputs && synthNode.outputs.length) || 0;
  const maxTerminals = Math.max(inputCount, outputCount);

  const { nodeVSpacing, nodeVOffset, nodeVPadding } = nodeLayout;
  const nodeHeight = nodeVOffset + maxTerminals * nodeVSpacing + nodeVPadding;

  // Selection: event, state, and CSS classes

  const selectExclusiveNode = usePatchStore((state) => state.selectExclusiveNode)
  const selectNode = usePatchStore((state) => state.selectNode)

  const handleMouseDown = (event) => {
    if (!synthNode.selected) {
      if (event.ctrlKey) {
        selectNode(synthNode.id);
      } else {
        selectExclusiveNode(synthNode.id);
      }
    }
  };

  const handleClick = (event) => {
    // Prevent a click on parent/background from unselecting all nodes
    // console.log('click');
    event.stopPropagation();
    if (!synthNode.selected) {
      if (event.ctrlKey) {
        selectNode(synthNode.id);
      } else {
        selectExclusiveNode(synthNode.id);
      }
    }
  };

  const classes = ['SynthNodeBox'];
  if (synthNode.selected) classes.push('selected');

  return (
    <rect
      className={classes.join(' ')}
      x={asRem(synthNode.x)}
      y={asRem(synthNode.y)}
      rx="0.6rem"
      width={asRem(synthNode.w)}
      height={asRem(nodeHeight)}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    />
  )
}

export default SynthNodeBox