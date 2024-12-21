import './SynthNode.css'
import SynthNodeTitle from './SynthNodeTitle.jsx'
import SynthNodeBox from './SynthNodeBox.jsx'
import SynthNodeInputs from './SynthNodeInputs.jsx'

function SynthNode(props) {

  const { synthNode } = props;

  return (
    <g>
      <SynthNodeBox synthNode={synthNode} />
      <SynthNodeTitle synthNode={synthNode} />
      <SynthNodeInputs synthNode={synthNode} />
    </g>

  )
}

export default SynthNode
