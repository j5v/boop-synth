import './SynthNodeProperties.css'
import Header from './Header.jsx'
import { getNodeTypeById } from '../lib/synth.js'
import FormPatchNodeInputList from './FormPatchNodeInputList.jsx'

function SynthNodeProperties(props) {

  const { synthNode } = props;
  const nodeType = getNodeTypeById(synthNode.nodeTypeId);
  const displayTypeName = nodeType ? `(${nodeType.name})` : '';

  return (
    <div className="SynthNodeProperties">
      <Header
        context="property-sheet"
      >
      <div className="node-title">
        {`${synthNode.id}: ${synthNode.displayName} ${displayTypeName}`}
      </div>
      </Header>

      <div className="parameters">
        <FormPatchNodeInputList synthNode={synthNode} />
      </div>

    </div>
  )
}

export default SynthNodeProperties
