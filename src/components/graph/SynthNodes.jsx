import './SynthNodes.css'
import SynthNode from './SynthNode.jsx'

import usePatchStore from '../../store/patchStore.jsx';

function SynthNodes({ runCount }) {

  const nodes = usePatchStore.getState().nodes;

  return (
    nodes.toReversed().map(node => (
        // toReversed() means we draw the last node first, good for new nodes at the start of the list.
        <SynthNode key={node.id} synthNode={node} runCount={runCount} />
    ))
  )
}

export default SynthNodes
