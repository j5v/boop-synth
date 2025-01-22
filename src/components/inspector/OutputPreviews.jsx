import { useContext } from 'react';
import { BoopContext } from '../../store/AppContext.js';

import OutputPreviewPanel from './OutputPreviewPanel.jsx'

function OutputPreviews({ nodeTypeId, synthNodeId }) {

  const { boop, setBoop } = useContext(BoopContext);

  const buffers = boop.defaultBoopState.outputBuffers;
  const buffer = buffers.find(b => b.nodeId == synthNodeId);
  
  return (
    <>
      <OutputPreviewPanel
        label="Preview"
        vis={1}
        buffer={buffer}
      />
      <OutputPreviewPanel
        label="Spectrum"
        vis={2}
        buffer={buffer}
      />
    </>
  );

}

export default OutputPreviews
