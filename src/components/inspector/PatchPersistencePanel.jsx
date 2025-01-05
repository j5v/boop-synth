import saveAs from '../../lib/FileSaver.js'
import usePatchStore from '../../store/patchStore.jsx'

function SynthGraphProperties() {

  const handleExport = () => {
    const state = usePatchStore.getState();
    const patchName = state.name || 'untitled';

    const stream = `data:text/json;charset=utf-8, ${encodeURIComponent(JSON.stringify(state))}`;

    saveAs(stream, patchName + '-boop-patch.json');
  }

  const handleImport = () => {
  }

  return (
    <div className="button-bar">
      <button 
        className="" 
        onClick={handleExport} 
        title="Export patch"
      >Export</button>
      <button
        className="" 
        onClick={handleImport}
        title="Import patch"
      >Import</button>
    </div>
  )
}

export default SynthGraphProperties
