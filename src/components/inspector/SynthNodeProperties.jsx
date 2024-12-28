import './SynthNodeProperties.css'
import Header from '../layout/Header.jsx'
import { getNodeTypeById, getNodeDisplayTitle } from '../../lib/synth.js'
import FormPatchNodeInputList from './FormPatchNodeInputList.jsx'

function SynthNodeProperties(props) {

  const { synthNode } = props;
  const displayName = getNodeDisplayTitle(synthNode);

  return (
    <div className="SynthNodeProperties">
      <Header
        context="property-sheet"
      >
      <div className="node-title">
      {`${synthNode.id}: ${displayName}`}
      </div>
      </Header>

      <div className="parameters">
        <FormPatchNodeInputList synthNode={synthNode} />
      </div>

    </div>
  )
}

export default SynthNodeProperties
