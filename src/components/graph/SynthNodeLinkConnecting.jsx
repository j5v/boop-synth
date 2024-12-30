import './SynthNodeLinks.css'
import usePatchStore from '../../store/patchStore.jsx';
import SynthNodeLink from './SynthNodeLink.jsx'
import { nodeLayout } from '../../lib/nodeLayout.js'

function SynthNodeLinks() {

  const { nodeVSpacing, nodeVOffset, nodeVPadding } = nodeLayout;

  const draggingLinkFromInput = usePatchStore(
    (state) => state.ui.draggingLinkFromInput
  );

  if (draggingLinkFromInput &&
      draggingLinkFromInput.loosePosX &&
      draggingLinkFromInput.fromInput) {

    const loosePos = {
      x: draggingLinkFromInput.loosePosX,
      y: draggingLinkFromInput.loosePosY
    }
    const inputPos = {
      x: draggingLinkFromInput.fromInput.posX,
      y: draggingLinkFromInput.fromInput.posY + draggingLinkFromInput.fromNode.y
    }
    
    return (
      draggingLinkFromInput && draggingLinkFromInput.loosePosX ?
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