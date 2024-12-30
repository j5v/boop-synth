import './App.css'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Content from './components/layout/Content.jsx'
import IconPlay from './components/generic/IconPlay.jsx'
import IconDownload from './components/generic/IconDownload.jsx'
import IconDelete from './components/generic/IconDelete.jsx'

import { generateAndPlay, generateFile, synthNodeTypes } from './lib/synth.js'
import usePatchStore from './store/patchStore.jsx'

function App() {

  const perf = usePatchStore.getState().perf;
  const nodes = usePatchStore.getState().nodes;

  const addNode = usePatchStore((state) => state.addNode)
  const removeSelectedNodes = usePatchStore((state) => state.removeSelectedNodes)
  const reset = usePatchStore((state) => state.reset)

  const handleSelect = (event) => {
    addNode(event.target.value);
    event.target.value = '';
  }

  const noNodesSelected = nodes.filter(n => n.selected).length == 0;

  return (
    <div className="App">
      <Header>
        <div className="title">FMC 2</div>
        <div className="button-bar">
          <button 
            className="icon" 
            onClick={() => generateAndPlay(nodes, perf)} 
            title="Play audio"
          ><IconPlay /></button>
          <button
            className="icon" 
            onClick={() => generateFile(nodes, perf)}
            title="Download audio file"
          ><IconDownload /></button>
        </div>
        <div className="button-bar">
          <select onChange={handleSelect} title="Add node" defaultValue="">
            <option value="" disabled hidden>&nbsp;Add</option>              
            {Object.keys(synthNodeTypes).map(
              (keyName, keyIndex) => <option key={synthNodeTypes[keyName].id} value={synthNodeTypes[keyName].id}>{synthNodeTypes[keyName].name}</option>
            )}
          </select>
          <button
            className="icon" 
            onClick={removeSelectedNodes}
            disabled={noNodesSelected}
            title="Remove selected nodes"
          ><IconDelete /></button>
        </div>
        <a href="http://johnvalentine.co.uk?art=fmc2" target="_blank" title="Help"><button className="text-as-icon">?</button></a>
        <button
            className="" 
            onClick={reset}
            title="Reset all nodes"
          >Reset</button>
      </Header>
      <Content />
      <Footer />
    </div>
  )
}

export default App
