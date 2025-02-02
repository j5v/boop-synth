import React from 'react' // not needed to build; satisfies a code checker

import usePatchStore from '../../store/patchStore.jsx'

import { exportPatch } from '../../lib/synthGraphIO.js'

const SynthGraphProperties = () => {

  const state = usePatchStore.getState();

  const importExpanded = usePatchStore((state) => state.ui.importExpanded);
  const setImportExpanded = usePatchStore((state) => state.setImportExpanded);

  const handleExport = () => {
    exportPatch(state);
  }

  const handleToggleImportExpand = () => {
    setImportExpanded(!importExpanded);
    // document.getElementById('file-upload').click();
  }

  return (
    <div className="button-bar-compact">
      <button 
        className="" 
        onClick={handleExport} 
        title="Export patch"
      >Export</button>
      <button
        className="custom-file-upload"
        onClick={handleToggleImportExpand}
        title="Show importer, as the next control"
      >
        Import [{importExpanded ? '−': '+'}]
      </button>
    </div>
  )
}

export default SynthGraphProperties
