import './SynthNode.css'
import SynthNodeTitle from './SynthNodeTitle.jsx'
import SynthNodeBox from './SynthNodeBox.jsx'
import asRem from '../lib/units.js'
 
function SynthNode(props) {

  const { synthNode } = props;

  return (
    <>
      <SynthNodeBox synthNode={synthNode} />
      <SynthNodeTitle synthNode={synthNode} />

    </>

  )
}

export default SynthNode
