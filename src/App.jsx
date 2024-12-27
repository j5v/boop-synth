import './App.css'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Content from './components/layout/Content.jsx'
import { generateAndPlay, generateFile } from './lib/synth.js'

function App() {
  return (
    <div className="App">
      <Header>
        <div className="title">FMC 2</div>
        <div className="button-bar">
          <button onClick={generateAndPlay}>Play</button>
          <button onClick={generateFile}>Download</button>
          <a href="http://johnvalentine.co.uk?art=fmc2" target="_blank"><button>?</button></a>
        </div>
      </Header>
      <Content />
      <Footer />
    </div>
  )
}

export default App
