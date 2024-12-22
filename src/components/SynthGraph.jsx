import './SynthGraph.css'
import usePatchStore from '../store/patchStore.jsx';
import SynthNodes from './SynthNodes.jsx'
import SynthNodeLinks from './SynthNodeLinks.jsx'

function SynthGraph() {

  const selectThisNode = usePatchStore(
    (state) => state.selectExclusiveNode
  );

  return (
    <svg
      className="SynthGraph"
      onClick = {() => selectThisNode()}
    >
      <SynthNodes />
      <SynthNodeLinks />
    </svg>
  ) 
}

export default SynthGraph
