import './OutputPreviews.css'

import { useContext } from 'react';
import { BoopContext } from '../../store/AppContext.js';

import ParameterGroup from '../generic/ParameterGroup.jsx'
import VisualizationWaveform from './VisualizationWaveform.jsx'

import usePatchStore from '../../store/patchStore.jsx'


function OutputPreviews({ nodeTypeId, synthNodeId }) {

  // boop state: buffers
  const { boop, setBoop } = useContext(BoopContext);

  const buffers = boop.defaultBoopState.outputBuffers;
  const buffer = buffers.find(b => b.nodeId == synthNodeId);

  // if (!buffer) return <button onClick={console.log('')}>Generate previews</button>

  // UI state
  const isExpanded = usePatchStore((state) => state.ui.expandPreviewWaveform);

  // console.log('OutputPreviews', isExpanded); 

  // render (don't render if not displayed/expanded)
  const waveformVisualization = isExpanded ? 
    <VisualizationWaveform buffer={buffer} w={20} h={16} />
    : <></>;


  // event handlers
  const toggleHandler = usePatchStore((state) => state.togglePreviewWaveformExpanded);

  const handleToggleExpand = () => {
    // console.log('+-');
    toggleHandler();
  }


  return (
    <>
      <ParameterGroup>
        <div className="expandable">
          <button
            className="icon-button-small"
            onClick={handleToggleExpand}
            title={isExpanded ? 'Hide' : 'Expand'}
          >
            {isExpanded ? <>[&minus;]</> : <>[+]</>}
          </button>
          <div className="expander-label">Waveform</div>
        </div>
        {waveformVisualization}
      </ParameterGroup>
    </>
  );

}

export default OutputPreviews
