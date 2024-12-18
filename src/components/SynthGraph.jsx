import './SynthGraph.css'
import SynthNode from './SynthNode.jsx'

function SynthGraph() {

  // test data
  const OP_TYPES = {
    MOCK: { id: 0, name: 'Mock synth node' }
  }
  
  const synthNode = { // units: rem
    x: 2,
    y: 1,
    w: 10,
    h: 7,
    nodeTypeId: OP_TYPES.MOCK.id,
    displayName: OP_TYPES.MOCK.name
  }

  return (
    <svg className="SynthGraph">
      <SynthNode synthNode={synthNode} />
    </svg>
  )
}

export default SynthGraph
