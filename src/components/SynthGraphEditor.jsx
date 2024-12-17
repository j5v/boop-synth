import './SynthGraphEditor.css'
import SynthNodeProperties from './SynthNodeProperties.jsx'
import SynthGraph from './SynthGraph.jsx'

function SynthGraphEditor() {

  return (
    <div className="SynthGraphEditor">
      <SynthGraph />
      <SynthNodeProperties />
    </div>
  )
}

export default SynthGraphEditor
