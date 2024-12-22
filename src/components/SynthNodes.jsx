import './SynthNodes.css'
import SynthNode from './SynthNode.jsx'

import usePatchStore from '../store/patchStore.jsx';

function SynthNodes() {

  const nodes = usePatchStore(
    (state) => state.nodes
  );

  return (
    nodes.map(node => (
      <SynthNode key={node.id} synthNode={node} />
    ))
  )
}

export default SynthNodes
