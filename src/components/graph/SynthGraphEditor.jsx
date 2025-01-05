import './SynthGraphEditor.css'
import SynthNodeProperties from '../inspector/SynthNodeProperties.jsx'
import SynthGraphProperties from '../inspector/SynthGraphProperties.jsx'
import SynthGraph from './SynthGraph.jsx'

import usePatchStore from '../../store/patchStore.jsx';

function SynthGraphEditor() {

  const nodes = usePatchStore((state) => state.nodes);
  const selectedNodeCount = nodes.filter(n => n.selected).length;
  const selectedNode = nodes.find(n => n.selected);

  return (
    <div className="SynthGraphEditor">
      <SynthGraph />
      {selectedNodeCount == 1 ?
        <SynthNodeProperties synthNode={selectedNode}/> :
        <SynthGraphProperties />
      }
    </div>
  )
}

export default SynthGraphEditor
