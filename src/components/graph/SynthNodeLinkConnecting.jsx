import './SynthNodeLinks.css'
import usePatchStore from '../../store/patchStore.jsx'
import SynthNodeLink from './SynthNodeLink.jsx'


function SynthNodeLinks() {

  const draggingLinkFromInput = usePatchStore.getState().ui.draggingLinkFromInput;
  const draggingLinkFromOutput = usePatchStore.getState().ui.draggingLinkFromOutput;

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
        <SynthNodeLink
          key={-2}
          outputPos={loosePos}
          inputPos={inputPos}
        />
    );

  } else if (draggingLinkFromOutput &&
      draggingLinkFromOutput.loosePosX &&
      draggingLinkFromOutput.fromOutput) {

    const loosePos = {
      x: draggingLinkFromOutput.loosePosX,
      y: draggingLinkFromOutput.loosePosY
    }
    const outputPos = {
      x: draggingLinkFromOutput.fromOutput.posX + draggingLinkFromOutput.fromNode.w,
      y: draggingLinkFromOutput.fromOutput.posY + draggingLinkFromOutput.fromNode.y
    }
    
    return (
      <SynthNodeLink
        key={-2}
        outputPos={outputPos}
        inputPos={loosePos}
      />
    );

  } else {
    return <></>
  }

}

export default SynthNodeLinks
