import './SynthGraph.css'
import SynthNode from './SynthNode.jsx'

import usePatchStore from '../store/patchStore.jsx';

function SynthGraph() {

  const nodes = usePatchStore((state) => state.nodes);
  const selectThisNode = usePatchStore((state) => state.selectExclusiveNode);

  return (
    <svg
      className="SynthGraph"
      onClick = {() => selectThisNode()}
    >
      {nodes.map(node => (
        <SynthNode key={node.id} synthNode={node} />
      ))}
    </svg>
  )
}

export default SynthGraph
