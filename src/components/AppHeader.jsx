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


function AppHeader() {

  const perf = usePatchStore.getState().perf;
  const nodes = usePatchStore((state) => state.nodes)
  
  const addNode = usePatchStore((state) => state.addNode)
  const removeSelectedNodes = usePatchStore((state) => state.removeSelectedNodes)
  const duplicateSelectedNodes = usePatchStore((state) => state.duplicateSelectedNodes)
  const viewAll = usePatchStore((state) => state.viewAll)
  const reset = usePatchStore((state) => state.reset)
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

  const handleReset = (event) => {
    if (window.confirm('Continue to reset? This will load the default starting patch.')) reset();
  }

  const handleSelect = (event) => {
    addNode(event.target.value);
    event.target.value = '';
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
        <option value="" disabled hidden>&nbsp;Add node</option>              
        {Object.keys(synthNodeTypes).map(
          (keyName, keyIndex) => <option key={synthNodeTypes[keyName].id} value={synthNodeTypes[keyName].id} title={synthNodeTypes[keyName].description || ''}>{synthNodeTypes[keyName].name}</option>
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

      <button
          onClick={handleZoomAll}
          title="Zoom to view all nodes [Ctrl]+[0]"
        >Zoom all</button>

      <div className="button-separator" />      

      <a href={appInfo.helpURL} target="_blank" title="Help"><button tabIndex={-1} className="text-as-icon link-cursor">?</button></a>
      <button
          onClick={handleReset}
          title="Reset all nodes [R]"
        >Reset</button>
    </Header>
  )
}

export default AppHeader
