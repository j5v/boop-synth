import './SynthGraph.css'
import SynthNode from './SynthNode.jsx'

function SynthGraph() {

  // test data
  const OP_TYPES = {
    MOCK: { id: 0, name: 'Mock' }
  }
  
  const synthNode = { // units: rem
    x: 0,
    y: 0,
    w: 10,
    h: 4,
    nodeTypeId: OP_TYPES.MOCK.id
  }

  return (
    <svg className="SynthGraph">
      <SynthNode synthNode={synthNode} />
    </svg>
  )
}

export default SynthGraph
