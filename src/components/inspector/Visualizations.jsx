import './Visualizations.css'

import ParameterGroup from '../generic/ParameterGroup.jsx'
import VisualizationWaveform from './VisualizationWaveform.jsx'
import VisualizationWaveshaper from './VisualizationWaveshaper.jsx'
import { synthNodeTypes, getNodeTypeById } from '../../lib/synthNodeTypes.js'
import { synthNodeVisualizationTypes, getSynthNodeVisualizationTypeById } from '../../lib/synthNodeVisualizationTypes.js'

import usePatchStore from '../../store/patchStore.jsx'


function Visualizations({ nodeTypeId, synthNodeId }) {

  // Event handlers
  const toggleVisualizationExpanded = usePatchStore((state) => state.toggleVisualizationExpanded);
  const visualizationsState = usePatchStore((state) => state.ui.visualizationsState) || [];

  // Get appropraite visualizations for the node type
  const synthNodeType = getNodeTypeById(nodeTypeId);
  const visualizationIds = synthNodeType.visualizations;

  if (visualizationIds == undefined || visualizationIds.length == 0) 
    return <></>;

  const handleToggleExpand = (spec) => {
    toggleVisualizationExpanded(spec);
  }

  const visualizationComponents = visualizationIds.map(visualizationId => {

    const key = `${synthNodeId}-${visualizationId}`;


    // is the visualization expanded?

    const vState = visualizationsState.find(vs => vs.id == key);
    const isExpanded = (vState !== undefined) && vState.isExpanded;
    

    // Choose component to show, but only compute/render if expanded.
    
    let visualizationComponent;

    if (!isExpanded) {
      visualizationComponent = <></>;
    } else {
      if (visualizationId == synthNodeVisualizationTypes.WAVEFORM.id) {
        visualizationComponent = <VisualizationWaveform synthNodeId={synthNodeId} w={20} h={16} />
      } if (visualizationId == synthNodeVisualizationTypes.WAVESHAPER.id) {
        visualizationComponent = <VisualizationWaveshaper synthNodeId={synthNodeId} w={16} h={17} />
      }
    }


    const visualization = getSynthNodeVisualizationTypeById(visualizationId);

    return (
      <ParameterGroup key={key}>
        <div className="expandable">
          <button
            className="icon-button-small"
            onClick={() => handleToggleExpand({ synthNodeId, visualizationId })}
            title={isExpanded ? 'Hide' : 'Expand'}
          >
            {isExpanded ? <>[&minus;]</> : <>[+]</>}
          </button>
          <div className="expander-label">{visualization.name}</div>
        </div>
        {visualizationComponent}
      </ParameterGroup>
    );
  

  });

  return visualizationComponents;

}

export default Visualizations
