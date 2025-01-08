import { versions, names } from '../../lib/appInfo.js'
import saveAs from '../../lib/FileSaver.js'
import usePatchStore from '../../store/patchStore.jsx'
import Header from '../layout/Header.jsx'

function SynthGraphProperties() {

  const handleExport = () => {
    const state = usePatchStore.getState();
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

  const handleImport = () => {
  }

  return (
    <div className="button-bar-compact">
      <button 
        className="" 
        onClick={handleExport} 
        title="Export patch"
      >Export</button>
      <button
        className="" 
        onClick={handleImport}
        title="Import patch"
        disabled
      >Import</button>
    </div>
  )
}

export default SynthGraphProperties
