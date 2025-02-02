import './SynthNodeProperties.css'

import { getNodeDisplayTitle, getDefaultInput } from '../../lib/synthGraphUtils.js'
import { getNodeTypeById, synthNodeTypes } from '../../lib/synthNodeTypes.js'

import React from 'react' // not needed to build; satisfies a code checker
import Header from '../layout/Header.jsx'
import FormPatchNodeInputList from './FormPatchNodeInputList.jsx'
import FormPatchNodeBypass from './FormPatchNodeBypass.jsx'
import Visualizations from './Visualizations.jsx'
import ParameterGroup from '../generic/ParameterGroup.jsx'
import { nodeLayout } from '../../lib/nodeLayout.js'

import usePatchStore from '../../store/patchStore.jsx'
import { useState } from 'react'


function SynthNodeProperties(props) {

  const { synthNode } = props;
  const displayName = getNodeDisplayTitle(synthNode);
  const clippedDisplayName = displayName.slice(0, nodeLayout.displayNameMaxLength);
  const displayNameEllipsis = displayName.length > nodeLayout.displayNameMaxLength ? '…' : '';

  const nodeType = getNodeTypeById(synthNode.nodeTypeId);
  const runCount = usePatchStore((state) => state.runCount);
  

  // edit name
  
  const setNodeDisplayName = usePatchStore((state) => state.setNodeDisplayName);
  const [ editingTitle, setEditingTitle ] = useState(false);

  const handleEditTitle = (e) => {
    setEditingTitle(true);
    e.target.focus();
  }
  const changeDisplayName = (e) => {
    setNodeDisplayName(synthNode.id, e.target.value);
  }
  const endEditDisplayName = () => {
    setEditingTitle(false);
  }
  function handleKeypress(e) {
    if (e.keyCode == 13) {
      setEditingTitle(false);
    }
}

  // Node description

  const hideNodeDescription = usePatchStore((state) => state.prefs.hideNodeDescription);
  const toggleHideNodeDescription = usePatchStore((state) => state.toggleHideNodeDescription);

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
          <div>
            {expander}{`${synthNode.id}: `}
            {editingTitle ?
              <input
                id="displayNameInput"
                type="text"
                maxLength="60"
                value={synthNode.displayName}
                onChange={changeDisplayName}
                onKeyDown={handleKeypress}
                onBlur={endEditDisplayName}
              ></input> :
              <><span
                onClick={handleEditTitle}
                title={`${synthNode.id}: ${displayName}`}
              >{clippedDisplayName}{displayNameEllipsis}</span></>
            }           
            
            {nodeType.isPlaceholder ? <span className="tag-warn">WIP</span> : ''}
            </div>
          {nodeTypeDescription}
        </div>
      </Header>

      <ParameterGroup>
        <div className="parameters">
          <FormPatchNodeBypass synthNode={synthNode}/>
        </div>
      </ParameterGroup>

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
