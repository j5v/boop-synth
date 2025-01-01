import './SynthNodeProperties.css'
import Header from '../layout/Header.jsx'
import { getNodeTypeById, getNodeDisplayTitle } from '../../lib/synth.js'
import FormPatchNodeInputList from './FormPatchNodeInputList.jsx'

function SynthNodeProperties(props) {

  const { synthNode } = props;
  const displayName = getNodeDisplayTitle(synthNode);

  const nodeType = getNodeTypeById(synthNode.nodeTypeId);
  const nodeTypeDescription = nodeType.description ? (
    <p>{nodeType.description}.</p>
  ) : <></>;

  return (
    <div className="SynthNodeProperties">
      <Header context="property-sheet">
        <div className="node-title">
          <div>{`${synthNode.id}: ${displayName}`}</div>
          {nodeTypeDescription}
        </div>
      </Header>

      <div className="parameters">
        <FormPatchNodeInputList synthNode={synthNode} />
      </div>
    </div>
  )
}

export default SynthNodeProperties
