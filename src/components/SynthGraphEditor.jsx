import './SynthGraphEditor.css'
import SynthNodeProperties from './SynthNodeProperties.jsx'
import SynthGraphProperties from './SynthGraphProperties.jsx'
import SynthGraph from './SynthGraph.jsx'

import usePatchStore from '../store/patchStore.jsx';

function SynthGraphEditor() {

  const nodes = usePatchStore((state) => state.nodes);
  const selectedNode = nodes.find(n => n.selected);

  return (
    <div className="SynthGraphEditor">
      <SynthGraph />{selectedNode ?
        <SynthNodeProperties synthNode={selectedNode}/> :
        <SynthGraphProperties />
      }
    </div>
  )
}

export default SynthGraphEditor
