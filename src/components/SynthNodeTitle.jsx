import './SynthNodeTitle.css'
import asRem from '../lib/units.js'
 
function SynthNodeTitle(props) {

  const { synthNode } = props;

  return (
    <text
      className="SynthNodeTitle"
      x={asRem(synthNode.x + 0.6)}
      y={asRem(synthNode.y + 1.4)}
    >{synthNode.displayName}</text>
  )
}

export default SynthNodeTitle
