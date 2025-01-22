import './OutputPreviewPanel.css'

import Header from '../layout/Header.jsx'
import ParameterGroup from '../generic/ParameterGroup.jsx'
import VisualizationWaveform from './VisualizationWaveform.jsx'
import VisualizationSpectrum from './VisualizationSpectrum.jsx'

import { useState } from 'react'


function OutputPreviewPanel({ label, vis, buffer }) {

  if (!buffer) {
    return <></>;
  }

  const previewSizes = {
    COLLAPSED: 0,
    SMALL: 1,
    LARGE: 2
  }

  const [previewSize, setPreviewSize] = useState(previewSizes.COLLAPSED);


  const handleToggleExpand = () => {
    setPreviewSize(previewSize == previewSizes.COLLAPSED ? previewSizes.SMALL : previewSizes.COLLAPSED);
  }

  let previewContent = <></>;
  if (previewSize !== previewSizes.COLLAPSED) {


    previewContent = (
      <div className="visualization small">
        <svg className="visualization-svg small" width="20rem" height="16rem">
          {vis == 1 ?
            <VisualizationWaveform buffer={buffer} w={20} h={16} /> :
            <VisualizationSpectrum buffer={buffer} w={20} h={16} />
            }
        </svg>
      </div>
    )
  }

  return (
    <ParameterGroup>
      <div className="expandable">
        <button
          className="icon-button-small"
          title={label}
          onClick={handleToggleExpand}
        >
          {previewSize ? <>[&minus;]</> : <>[+]</>}
        </button>
        <div className="expander-label">{label}</div>
      </div>
      {previewContent}
    </ParameterGroup>
  );

}

export default OutputPreviewPanel
