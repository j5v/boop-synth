import './SynthGraphProperties.css'
import usePatchStore from '../store/patchStore.jsx'

import Header from './Header.jsx'
import ParameterGroup from './ParameterGroup.jsx'
import PerformancePropertiesForm from './PerformancePropertiesForm.jsx'
import SynthGraphNodeList from './SynthGraphNodeList.jsx'

function SynthGraphProperties() {

  const patch = usePatchStore((state) => state.patch);

  return (
    <div className="SynthGraphProperties">
      <Header context="property-sheet">
        <div>Patch</div>
      </Header>

      <ParameterGroup>
        <Header context="property-sheet-subheading">
          <div>Performance</div>
        </Header>
        <PerformancePropertiesForm></PerformancePropertiesForm>
      </ParameterGroup>

      <ParameterGroup>
        <Header context="property-sheet-subheading">
          <div>Node list</div>
        </Header>
        <SynthGraphNodeList />
      </ParameterGroup>
    </div>
  )
}

export default SynthGraphProperties