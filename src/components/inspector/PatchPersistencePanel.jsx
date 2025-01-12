import { appInfo } from '../../lib/appInfo.js'
import saveAs from '../../lib/FileSaver.js'
import usePatchStore from '../../store/patchStore.jsx'
import { getNodeTypeById } from '../../lib/synthNodeTypes.js'
import { getItemById } from '../../lib/utils.js'

const SynthGraphProperties = () => {

  const state = usePatchStore.getState();

  const importExpanded = usePatchStore((state) => state.ui.importExpanded);
  const setImportExpanded = usePatchStore((state) => state.setImportExpanded);

  const handleExport = () => {
    const patchName = state.name || 'untitled';

    // clean up state
    delete state.ui.draggingLinkFromOutput;
    delete state.ui.draggingLinkFromInput;

    state.nodes.forEach(node => {
      delete node.highlighted;
      delete node.selected;

      // Remove excess decimal places (units: rem; pixel at 100% is near 0.06)
      node.x = Number(node.x.toFixed(4));
      node.y = Number(node.y.toFixed(4));
      node.w = Number(node.w.toFixed(4));
      node.h = Number(node.h.toFixed(4));

      node.inputs.forEach(input => {
        // clear up old properties not used now - remove at v1.0
        delete input.displayName;
        delete input.displayNameShort;
        delete input.description;
        delete input.defaultValue;
        delete input.placeholder;
        delete input.isPlaceholder;
        delete input.intentId;
        delete input.displayUnits;
        delete input.isOffset;
        delete input.posX;
        delete input.posY;
        if (input.link == {}) delete input.link;

        // userValues are only useful if different (parseable format) from value.
        if (input.userValue == input.value) delete input.userValue;

        // delete values identical to default (consider removing if defaults are likely to change)
        const nodeType = getNodeTypeById(node.nodeTypeId);
        const nodeTypeInput = getItemById(nodeType.inputs, input.id); // get matching input in synthNodeTypes
        if (input.value == nodeTypeInput.defaultValue) delete input.value;

      })

      node.outputs.forEach(output => {
        // clear up old properties not used now - remove at v1.0
        delete output.displayName;
        delete output.displayNameShort;
        delete output.description;
        delete output.intentId;
        delete output.displayUnits;
        delete output.isOffset;
        delete output.signal;
        delete output.posX;
        delete output.posY;
      })
    })
  

    // add some metadata
    state.appName = appInfo.appName;
    state.appVersion = appInfo.appVersion;
    state.saveVersion = appInfo.saveVersion;

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
