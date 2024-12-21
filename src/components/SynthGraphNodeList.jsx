import './SynthGraphNodeList.css'
import usePatchStore from '../store/patchStore.jsx'
import { getNodeTypeById } from '../lib/synth.js'
import IconGrab from './IconGrab.jsx'

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
            <IconGrab />
          </div>
        );
      })}
    </div>
  )
}

export default ParameterGroup
