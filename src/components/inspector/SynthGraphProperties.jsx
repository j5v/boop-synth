import './SynthGraphProperties.css'

import Header from '../layout/Header.jsx'
import ParameterGroup from './ParameterGroup.jsx'
import PerformancePropertiesForm from './PerformancePropertiesForm.jsx'
import SynthGraphNodeList from './SynthGraphNodeList.jsx'
import PatchPersistencePanel from './PatchPersistencePanel.jsx'

function SynthGraphProperties() {

  return (
    <div className="SynthGraphProperties">
      <Header context="property-sheet">
        <div>Patch</div>
        <PatchPersistencePanel />
      </Header>

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
