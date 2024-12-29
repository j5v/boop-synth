import './SynthNodeLinks.css'
import usePatchStore from '../../store/patchStore.jsx';
import SynthNodeLink from './SynthNodeLink.jsx'
import { nodeLayout } from '../../lib/nodeLayout.js'

function SynthNodeLinks() {

  const { nodeVSpacing, nodeVOffset, nodeVPadding } = nodeLayout;

  const draggingConnectorFromInput = usePatchStore(
    (state) => state.ui.draggingConnectorFromInput
  );

  if (draggingConnectorFromInput && draggingConnectorFromInput.loosePosX) {

    const loosePos = {
      x: draggingConnectorFromInput.loosePosX,
      y: draggingConnectorFromInput.loosePosY
    }
    const inputPos = {
      x: draggingConnectorFromInput.fromInput.posX,
      y: draggingConnectorFromInput.fromInput.posY + draggingConnectorFromInput.fromNode.y
    }
    
    return (
      draggingConnectorFromInput && draggingConnectorFromInput.loosePosX ?
        <SynthNodeLink
          key={-2}
          outputPos={loosePos}
          inputPos={inputPos}
        />
      : <></>
    );
 
  } else {
    return <></>
  }

}

export default SynthNodeLinks
