import './App.css'
import Footer from './components/layout/Footer.jsx'
import Content from './components/layout/Content.jsx'
import AppHeader from './components/AppHeader.jsx'

import usePatchStore from './store/patchStore.jsx'
import { BoopContext, defaultBoopState } from './store/BoopContext.js';

import { useState } from 'react'

function App() {

  const [boop, setBoop] = useState({defaultBoopState});

  // drag and drop

  const importFileData = usePatchStore((state) => state.importFileData);

  const handleDragOver = (event) => {
    event.preventDefault();
  }
  
  const handleDrop = (event) => {
    event.preventDefault();
  
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...event.dataTransfer.items].forEach((item, i) => {
        // only process files
        if (item.kind === "file") {
          loadDroppedFiles(item.getAsFile());
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...event.dataTransfer.files].forEach((item, i) => {
        loadDroppedFiles(item.getAsFile());
      });
    }
  }

  const loadDroppedFiles = (f) => {
    if (f.name && f.name.slice(-5).toLowerCase() === '.json') {
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        () => { importFileData(reader.result, f.name); },
        false
      );
    
      reader.readAsText(f);
    }
  }

  // end: drag and drop.

  return (
    <BoopContext.Provider value={{ boop, setBoop }}>
      <div
        className="App"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <AppHeader />
        <Content />
        <Footer />
      </div>
    </BoopContext.Provider>
  )
}

export default App
