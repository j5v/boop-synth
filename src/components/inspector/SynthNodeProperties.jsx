import './SynthNodeProperties.css'
import Header from '../layout/Header.jsx'
import { getNodeDisplayTitle } from '../../lib/synth.js'
import { getNodeTypeById } from '../../lib/synthNodeTypes.js'
import FormPatchNodeInputList from './FormPatchNodeInputList.jsx'
import ParameterGroup from './ParameterGroup.jsx'
import usePatchStore from '../../store/patchStore.jsx'

function SynthNodeProperties(props) {

  const { synthNode } = props;
  const displayName = getNodeDisplayTitle(synthNode);

  const nodeType = getNodeTypeById(synthNode.nodeTypeId);

  // TODO: componentize Expander
  const hideNodeDescription = usePatchStore((state) => state.prefs.hideNodeDescription);
  const toggleHideNodeDescription = usePatchStore((state) => state.toggleHideNodeDescription);

  const expanderTitle = hideNodeDescription ? 'Show description' : 'Hide description';

  const expander = 
    <button
      className="compact expander"
      title={expanderTitle}
      onClick={toggleHideNodeDescription}
    >
      {hideNodeDescription ? <>?</> : <>-?</>}
    </button>
  // end Expander

  const nodeTypeDescription = nodeType.description && !hideNodeDescription ? (
    <p>{nodeType.description}.</p>
  ) : <></>;


  return (
    <div className="SynthNodeProperties">
      <Header context="property-sheet">
        <div className="node-title">
          <div>{expander}{`${synthNode.id}: ${displayName}`}</div>
          {nodeTypeDescription}
        </div>
      </Header>

      <ParameterGroup>
        <Header context="property-sheet-subheading">
          <div className="group-title">Inputs</div>
        </Header>
        <div className="parameters">
          <FormPatchNodeInputList synthNode={synthNode} />
        </div>
      </ParameterGroup>


    </div>
  )
}

export default SynthNodeProperties
