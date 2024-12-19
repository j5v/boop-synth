import './SynthNodeTitle.css'
import asRem from '../lib/units.js'
import { getNodeTypeById } from '../lib/synth.js'
 
function SynthNodeTitle(props) {

  const { synthNode } = props;
  const nodeType = getNodeTypeById(synthNode.nodeTypeId);
  console.log('synthNode', synthNode);
  console.log('nodeType', nodeType);
  const displayTypeName = nodeType ? `(${nodeType.name})` : '';

  return (
    <text
      className="SynthNodeTitle"
      x={asRem(synthNode.x + 0.6)}
      y={asRem(synthNode.y + 1.4)}
    >{`${synthNode.id}: ${synthNode.displayName} ${displayTypeName}`}</text>
  )
}

export default SynthNodeTitle
