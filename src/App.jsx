import './App.css'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Content from './components/layout/Content.jsx'
import { generateAndPlay, generateFile, synthNodeTypes } from './lib/synth.js'
import usePatchStore from './store/patchStore.jsx'

function App() {

  const perf = usePatchStore((state) => state.perf);
  const nodes = usePatchStore((state) => state.nodes);

  const addNode = usePatchStore((state) => state.addNode)
  const removeSelectedNodes = usePatchStore((state) => state.removeSelectedNodes)

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
          <button onClick={() => generateAndPlay(nodes, perf)}>Play</button>
          <button onClick={() => generateFile(nodes, perf)}>Download</button>
        </div>
        <div className="button-bar">
          <select onChange={handleSelect} title="Add node" defaultValue="">
            <option value="" disabled hidden>&nbsp;Add</option>              
            {Object.keys(synthNodeTypes).map(
              (keyName, keyIndex) => <option key={synthNodeTypes[keyName].id} value={synthNodeTypes[keyName].id}>{synthNodeTypes[keyName].name}</option>
            )}
          </select>
          <button onClick={removeSelectedNodes} disabled={noNodesSelected} title="Remove selected nodes">&times;</button>
        </div>
        <a href="http://johnvalentine.co.uk?art=fmc2" target="_blank" title="Help"><button>?</button></a>
      </Header>
      <Content />
      <Footer />
    </div>
  )
}

export default App
