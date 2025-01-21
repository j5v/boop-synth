import { synthNodeActions, getActionsForSynthNodeTypeId } from '../../lib/synthNodeActions.js'
import ParameterGroup from './ParameterGroup.jsx'

function SynthNodeActionButtons({ nodeTypeId, nodeId }) { 

  const handleAction = (synthNodeActionId) => {
    console.log(synthNodeActionId);
    switch (synthNodeActionId) {
      case synthNodeActions.VIEW_WAVE: // TODO
        break;
      case synthNodeActions.SPECTRUM: // TODO
        break;
    }
  }
  
  const actions = getActionsForSynthNodeTypeId(nodeTypeId);

  return (actions.length == 0) ?
    <></> : 
    <ParameterGroup>
      <div className="button-bar-compact">
        {actions.map(a => (
          <button
            key={`${nodeId}-${a.id}`}
            onClick={() => handleAction(a.id)}
            disabled={a.isPlaceholder}>{a.name}</button>
        ))}
      </div>
    </ParameterGroup>
}

export default SynthNodeActionButtons
