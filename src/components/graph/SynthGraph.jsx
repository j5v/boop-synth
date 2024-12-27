import './SynthGraph.css'
import usePatchStore from '../../store/patchStore.jsx';
import SynthNodes from './SynthNodes.jsx'
import SynthNodeLinks from './SynthNodeLinks.jsx'

function SynthGraph() {

  const selectThisNode = usePatchStore(
    // On the SynthGraph (background), click unselects all nodes.
    // In SynthNodes[<SynthNode>] click on a node to select it.
    (state) => state.selectExclusiveNode
  );

  return (
    <svg
      className="SynthGraph"
      onClick = {selectThisNode}
    >
      <SynthNodes />
      <SynthNodeLinks />
    </svg>
  )
}

export default SynthGraph
