import usePatchStore from '../store/patchStore.jsx'

import { appInfo } from '../lib/appInfo.js'
import { synthNodeTypes } from '../lib/synthNodeTypes.js'
import { generate, generateAndPlay, generateFile } from '../lib/synth.js'

import Header from './layout/Header.jsx'
import IconPlay from './generic/IconPlay.jsx'
import IconDownload from './generic/IconDownload.jsx'
import IconRefresh from './generic/IconRefresh.jsx'
import IconDelete from './generic/IconDelete.jsx'
import IconDuplicate from './generic/IconDuplicate.jsx'

import { useContext } from 'react';
import { BoopContext } from '../store/AppContext.js';
import React from 'react' // not needed to build; satisfies a code checker


function AppHeader() {

  const perf = usePatchStore.getState().perf;
  const nodes = usePatchStore((state) => state.nodes)
  
  const addNode = usePatchStore((state) => state.addNode)
  const removeSelectedNodes = usePatchStore((state) => state.removeSelectedNodes)
  const duplicateSelectedNodes = usePatchStore((state) => state.duplicateSelectedNodes)
  const viewAll = usePatchStore((state) => state.viewAll)
  const selectAllNodes = usePatchStore((state) => state.selectAllNodes)
  const reset = usePatchStore((state) => state.reset)
  const tidyInputs = usePatchStore((state) => state.tidyInputs)
  const stateDirty = usePatchStore((state) => state.stateDirty)

  const handleGenerateAndPlay = (params) => {
    generateAndPlay(params);
    stateDirty();
  }

  const handleGenerateFile = (params) => {
    generateFile(params);
    stateDirty();
  }

  const handleGenerateOnly = (params) => {
    generate(params);
    stateDirty();
  }

  const handleReset = () => {
    if (window.confirm('Continue to reset? This will load the default starting patch.')) reset();
  }

  const handleSelect = (event) => {
    addNode(event.target.value);
    event.target.value = '';
  }

  const handleSelectAction = (event) => {
    const selectedItemIndex = event.target.value;
    switch(selectedItemIndex) {
      case "zoom all":
        handleZoomAll();
        break;
    
      case "select all":
        selectAllNodes();
        break;
      
        case "reset":
        handleReset();
        break;
      
      case "tidy inputs":
        tidyInputs();
        break;
      
      case "order nodes":
        break;
      
      case "tidy nodes":
        break;
      
    }
    event.target.value = "";
    // console.log(selectedItemIndex)
  }

  const handleZoomAll = () => {
    // Todo: a safer way of getting the SVG dimensions
    const svgElement = document.getElementById('node-graph');

    if (svgElement) {
      viewAll(svgElement.clientWidth, svgElement.clientHeight);
    } else {
      viewAll();
    }
  }

  const noNodesSelected = nodes.filter(n => n.selected).length == 0;

  const { boop, setBoop } = useContext(BoopContext);

  return (
    <Header context="button-bar">

      <div className="title">{appInfo.appName}</div>

      <div className="button-separator" />   

      <button
        id="playAudioButton"
        className="icon" 
        onClick={() => handleGenerateAndPlay({ nodes, perf, boop })} 
        title="Play audio"
      ><IconPlay /></button>

      <button
        className="icon" 
        onClick={() => handleGenerateFile({ nodes, perf, boop })}
        title="Download audio file"
      ><IconDownload /></button>

      <button
        className="icon" 
        onClick={() => handleGenerateOnly({ nodes, perf, boop })}
        title="Refresh previews"
      ><IconRefresh /></button>

      <div className="button-separator" />

      <select id="addNodeSelect"
        onChange={handleSelect}
        title="Add node"
        defaultValue=""
      >
        <option value="" disabled hidden>Add node</option>              
        {Object.keys(synthNodeTypes).map( (keyName, keyIndex) =>
          <option
            key={synthNodeTypes[keyName].id}
            value={synthNodeTypes[keyName].id}
            title={synthNodeTypes[keyName].description || ''}
          >{synthNodeTypes[keyName].name}{synthNodeTypes[keyName].isPlaceholder ? ' [WIP]' : ''}</option>
        )}
      </select>

      <button
        className="icon" 
        onClick={duplicateSelectedNodes}
        disabled={noNodesSelected}
        title="Duplicate selected nodes [V]"
      ><IconDuplicate /></button>

      <button
        className="icon" 
        onClick={removeSelectedNodes}
        disabled={noNodesSelected}
        title="Remove selected nodes [X], [Del]"
      ><IconDelete /></button>

      <div className="button-separator" />      

      <select id="actionsMenu"
        onChange={handleSelectAction}
        title="Actions"
        defaultValue=""
      >
        <option value="" disabled hidden>Actions</option>              
        <option value="zoom all" title="Zoom to view all nodes. [Ctrl]+[Alt]+[0]"> Zoom all</option>
        <option value="select all" title="Select all nodes [Ctrl]+[A]"> Select all</option>
        <option value="reset" title="Reset the patch [R]"> Reset</option>
        <option value="tidy inputs" title="Unexpose unconnected inputs"> Tidy inputs</option>
        <option value="order nodes" title="" disabled> Order nodes</option>
        <option value="tidy graph" title="" disabled> Tidy graph</option>
        <option value="normalize" title="" disabled> Normalize outputs</option>
      </select>

      <div className="button-separator" />      

      <a href={appInfo.helpURL} target="_blank" title="Help"><button tabIndex={-1} className="text-as-icon link-cursor">?</button></a>

    </Header>
  )
}

export default AppHeader
