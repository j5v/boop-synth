import './SynthGraph.css'
import SynthNode from './SynthNode.jsx'

import usePatchStore from '../store/patchStore.jsx';

function SynthGraph() {

  const nodes = usePatchStore((state) => state.nodes);

  return (
    <svg className="SynthGraph">
      {nodes.map(node => (
        <SynthNode key={node.id} synthNode={node} />
      ))}
    </svg>
  )
}

export default SynthGraph
