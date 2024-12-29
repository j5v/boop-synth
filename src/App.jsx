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

  return (
    <div className="App">
      <Header>
        <div className="title">FMC 2</div>
        <div className="button-bar">
          <button onClick={() => generateAndPlay(nodes, perf)}>Play</button>
          <button onClick={() => generateFile(nodes, perf)}>Download</button>
          <button onClick={removeSelectedNodes}>&times;</button>
          <a href="http://johnvalentine.co.uk?art=fmc2" target="_blank"><button>?</button></a>
          <div>
            <select onChange={handleSelect}>
              <option value="" disabled selected hidden>Add Node</option>              
              {Object.keys(synthNodeTypes).map(
                (keyName, keyIndex) => <option key={synthNodeTypes[keyName].id} value={synthNodeTypes[keyName].id}>{synthNodeTypes[keyName].name}</option>
              )}
            </select>
          </div>
        </div>
      </Header>
      <Content />
      <Footer />
    </div>
  )
}

export default App
