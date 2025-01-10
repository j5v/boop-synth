import { versions, names } from '../../lib/appInfo.js'
import saveAs from '../../lib/FileSaver.js'
import usePatchStore from '../../store/patchStore.jsx'

function SynthGraphProperties() {

  const state = usePatchStore.getState();
  const importExpanded = usePatchStore((state) => state.ui.importExpanded);
  const setImportExpanded = usePatchStore((state) => state.setImportExpanded);

  const handleExport = () => {
    const patchName = state.name || 'untitled';

    // clean up state
    delete state.ui.draggingLinkFromOutput;
    delete state.ui.draggingLinkFromInput;

    // add some metadata
    state.appName = names.appName;
    state.appVersion = versions.appVersion;
    state.saveVersion = versions.saveVersion;
    state.comment = 'This format will change in future versions of the app. Some properties will move into in-app types. Some unset properties might be removed.';

    const stream = `data:text/json;charset=utf-8, ${encodeURIComponent(JSON.stringify(state))}`;

    saveAs(stream, patchName + '-boop-patch.json');
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
        Import [{importExpanded ? '-': '+'}]
      </button>
    </div>
  )
}

export default SynthGraphProperties
