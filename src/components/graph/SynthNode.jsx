import './SynthNode.css'
import SynthNodeTitle from './SynthNodeTitle.jsx'
import SynthNodeBox from './SynthNodeBox.jsx'
import SynthNodeInputs from './SynthNodeInputs.jsx'
import SynthNodeOutputs from './SynthNodeOutputs.jsx'
import SynthNodePeakMeter from './SynthNodePeakMeter.jsx'

function SynthNode(props) {

  const { synthNode } = props;

  return (
    <g>
      <SynthNodeBox synthNode={synthNode} />
      <SynthNodeTitle synthNode={synthNode} />
      <SynthNodeInputs synthNode={synthNode} />
      <SynthNodeOutputs synthNode={synthNode} />
      <SynthNodePeakMeter synthNode={synthNode} />
    </g>

  )
}

export default SynthNode
