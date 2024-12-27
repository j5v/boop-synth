import './SynthGraphEditor.css'
import SynthNodeProperties from '../inspector/SynthNodeProperties.jsx'
import SynthGraphProperties from '../inspector/SynthGraphProperties.jsx'
import SynthGraph from './SynthGraph.jsx'

import usePatchStore from '../../store/patchStore.jsx';

function SynthGraphEditor() {

  const nodes = usePatchStore((state) => state.nodes);
  const selectedNode = nodes.find(n => n.selected);

  return (
    <div className="SynthGraphEditor">
      <SynthGraph />
      {selectedNode ?
        <SynthNodeProperties synthNode={selectedNode}/> :
        <SynthGraphProperties />
      }
    </div>
  )
}

export default SynthGraphEditor
