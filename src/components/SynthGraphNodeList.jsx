import './SynthGraphNodeList.css'
import usePatchStore from '../store/patchStore.jsx'
import { getNodeTypeById } from '../lib/synth.js'

function ParameterGroup(props) {

  const nodes = usePatchStore((state) => state.nodes);
  const selectThisNode = usePatchStore((state) => state.selectExclusiveNode);

  return (
    <div className='SynthGraphNodeList'>
      {nodes.map(synthNode => {
        const nodeType = getNodeTypeById(synthNode.nodeTypeId);
        const displayTypeName = nodeType ? `(${nodeType.name})` : '';

        const handleClick = (event) => {
          event.stopPropagation();
          selectThisNode(synthNode.id);
        };                

        // selected state
        const classNames = ['item'];
        if (synthNode.selected) classNames.push('selected');

        return (
          <div
            className={classNames.join(' ')}
            key={synthNode.id}
            onClick={handleClick}
          >
            <div>{`${synthNode.id}: ${synthNode.displayName} ${displayTypeName}`}</div>
            <svg
              className="grab-handle-icon" 
              viewBox="-0.3 -0.3 1.3 1.3" 
              height="1.5rem" 
              width="1.5rem">
                <path d="M 0,0.1 L 0.8,0.1 M 0,0.5 L 0.8,0.5 M 0,0.9 L 0.8,0.9"/>
            </svg>
          </div>
        );
      })}
    </div>
  )
}

export default ParameterGroup
