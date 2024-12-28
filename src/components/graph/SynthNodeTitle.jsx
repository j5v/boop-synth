import './SynthNodeTitle.css'
import { asRem } from '../../lib/utils.js'
import { getNodeDisplayTitle } from '../../lib/synth.js'
 
function SynthNodeTitle(props) {

  const { synthNode } = props;
  const displayName = getNodeDisplayTitle(synthNode);

  return (
    <text
      className="SynthNodeTitle"
      x={asRem(synthNode.x + 0.6)}
      y={asRem(synthNode.y + 1.4)}
    >{`${synthNode.id}: ${displayName}`}</text>
  )
}

export default SynthNodeTitle
