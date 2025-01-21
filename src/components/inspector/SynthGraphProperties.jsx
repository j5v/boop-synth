import './SynthGraphProperties.css'

import Header from '../layout/Header.jsx'
import ParameterGroup from '../generic/ParameterGroup.jsx'
import PerformancePropertiesForm from './PerformancePropertiesForm.jsx'
import SynthGraphNodeList from './SynthGraphNodeList.jsx'
import PatchPersistencePanel from './PatchPersistencePanel.jsx'

import usePatchStore from '../../store/patchStore.jsx'

function SynthGraphProperties() {

  const importFileData = usePatchStore((state) => state.importFileData);
  const importExpanded = usePatchStore((state) => state.ui.importExpanded);
  const setImportExpanded = usePatchStore((state) => state.setImportExpanded);

  const importElementId = 'file-import';

  const handleImportInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      loadFile(file);
    }
  }
  const loadFile = (f) => {
    if (f.name && f.name.slice(-5).toLowerCase() === '.json') {
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        () => {
          importFileData(reader.result, f.name);
          setImportExpanded(false);
        },
        false
      );
    
      reader.readAsText(f);
    }
  }  
  
  const fileInputElement = importExpanded ?
    <ParameterGroup>
      <Header context="property-sheet-subheading">
        <div className="group-title">Import file</div>
      </Header>
      <div className="custom-file-upload">
        <input
          type="file"
          id={importElementId}
          accept=".json"
          title="Import patch"
          onChange={handleImportInputChange}
        />
      </div>
    </ParameterGroup>

  : <></>
  
  return (
    <div className="SynthGraphProperties">
      <Header context="property-sheet">
        <div>Patch</div>
        <PatchPersistencePanel importExpanded={importExpanded}/>
      </Header>

      <div>{fileInputElement}</div>

      <ParameterGroup>
        <Header context="property-sheet-subheading">
          <div className="group-title">Performance</div>
        </Header>
        <PerformancePropertiesForm />
      </ParameterGroup>

      <ParameterGroup>
        <Header context="property-sheet-subheading">
          <div className="group-title">Node processing order</div>
        </Header>
        <SynthGraphNodeList />
      </ParameterGroup>
    </div>
  )
}

export default SynthGraphProperties
