import './SynthNodeProperties.css'

import { getNodeDisplayTitle, getDefaultInput } from '../../lib/synthGraphUtils.js'
import { getNodeTypeById, synthNodeTypes } from '../../lib/synthNodeTypes.js'

import React from 'react' // not needed to build; satisfies a code checker
import Header from '../layout/Header.jsx'
import FormPatchNodeInputList from './FormPatchNodeInputList.jsx'
import Visualizations from './Visualizations.jsx'
import ParameterGroup from '../generic/ParameterGroup.jsx'

import usePatchStore from '../../store/patchStore.jsx'


function SynthNodeProperties(props) {

  const { synthNode } = props;
  const displayName = getNodeDisplayTitle(synthNode);

  const nodeType = getNodeTypeById(synthNode.nodeTypeId);


  // Node description.

  const hideNodeDescription = usePatchStore((state) => state.prefs.hideNodeDescription);
  const toggleHideNodeDescription = usePatchStore((state) => state.toggleHideNodeDescription);
  const runCount = usePatchStore((state) => state.runCount);

  const expanderTitle = hideNodeDescription ? 'Show description' : 'Hide description';
  const expander = 
    <button
      className="expander"
      title={expanderTitle}
      onClick={toggleHideNodeDescription}
    >
      {hideNodeDescription ? <>?</> : <>-?</>}
    </button>

  const nodeTypeDescription = nodeType.description && !hideNodeDescription ? (
    <p>{nodeType.description}.</p>
  ) : <></>;

  // end Node description

  
  const hasConfiguration = (synthNode.inputs || []).filter(
    i => getDefaultInput(synthNode, i).isParam == true
  ).length > 0;


 
  return (
    <div className="SynthNodeProperties">
      <Header context="property-sheet">
        <div className="node-title">
          <div>{expander}{`${synthNode.id}: ${displayName}`}</div>
          {nodeTypeDescription}
        </div>
      </Header>

      {hasConfiguration ? (
      <ParameterGroup>
        <Header context="property-sheet-subheading">
          <div className="group-title">Configuration</div>
        </Header>
        <div className="parameters">
          <FormPatchNodeInputList synthNode={synthNode} isParam={true}/>
        </div>
      </ParameterGroup>
      ) : <></>}

      <ParameterGroup>
        <Header context="property-sheet-subheading">
          <div className="group-title">Inputs</div>
        </Header>
        <div className="parameters">
          <FormPatchNodeInputList synthNode={synthNode} isParam={false}/>
        </div>
      </ParameterGroup>

      <Visualizations
        nodeTypeId={nodeType.id}
        synthNodeId={synthNode.id} 
        // @ts-ignore
        runCount={runCount}
      />

    </div>
  )
}

export default SynthNodeProperties
