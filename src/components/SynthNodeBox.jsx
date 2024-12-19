import './SynthNodeBox.css'
import asRem from '../lib/units.js'
 
function SynthNodeBox(props) {

  const { synthNode } = props;

  return (
    <rect
      className="SynthNodeBox"
      x={asRem(synthNode.x)}
      y={asRem(synthNode.y)}
      rx="0.6rem"
      width={asRem(synthNode.w)}
      height={asRem(synthNode.h)}
    />
  )
}

export default SynthNodeBox
