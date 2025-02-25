import './OutputPreviewPanel.css'

import ParameterGroup from '../generic/ParameterGroup.jsx'

function OutputPreviewPanel({ label, isExpanded, onToggleExpand, children }) {

  // Wraps a preview in a header+expander UI.
  // Was fully working; this is reverted to an earlier WIP version.

  // console.log('OutputPreviewPanel', isExpanded); 

  return (
    <ParameterGroup>
      <div className="expandable">
        <button
          className="icon-button-small"
          title={label}
          onClick={onToggleExpand()}
        >
          {isExpanded ? <>[&minus;]</> : <>[+]</>}
        </button>
        <div className="expander-label">{label}</div>
      </div>
      {isExpanded ? children : <></> }
    </ParameterGroup>
  );

}

export default OutputPreviewPanel
