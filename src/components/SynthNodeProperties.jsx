import './SynthNodeProperties.css'
import Header from './Header.jsx'
import { getNodeTypeById } from '../lib/synth.js'

function SynthNodeProperties(props) {

  const { synthNode } = props;
  const nodeType = getNodeTypeById(synthNode.nodeTypeId);
  const displayTypeName = nodeType ? `(${nodeType.name})` : '';

  return (
    <div className="SynthNodeProperties">
      <Header
        context="property-sheet"
      >
        <div>{`${synthNode.id}: ${synthNode.displayName} ${displayTypeName}`}</div>
      </Header>

      <div className="parameters">
      <div className="parameter-row">
          <div className="modulatable">[ ]</div>
          <div className="parameter-edit">Mock Param 1</div>
        </div>
        <div className="parameter-row">
          <div className="modulatable">[ ]</div>
          <div className="parameter-edit">Mock Param 2</div>
        </div>
      </div>

    </div>
  )
}

export default SynthNodeProperties
