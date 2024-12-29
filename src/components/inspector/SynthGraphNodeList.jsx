import './SynthGraphNodeList.css'
import usePatchStore from '../../store/patchStore.jsx'
import { getNodeDisplayTitle } from '../../lib/synth.js'

function ParameterGroup(props) {

  const nodes = usePatchStore((state) => state.nodes);
  const selectThisNode = usePatchStore((state) => state.selectExclusiveNode);

  const swapNodes = usePatchStore((state) => state.swapNodes);
  const highlightExclusiveNode = usePatchStore((state) => state.highlightExclusiveNode);

  let itemIndex = 0;

  return (
    <div className='SynthGraphNodeList'>
      {nodes.map(synthNode => {
        const displayName = getNodeDisplayTitle(synthNode);

        const handleClick = (event) => {
          event.stopPropagation();
          selectThisNode(synthNode.id);
        };
        
        const handleMouseEnter = (event) => {
          highlightExclusiveNode(synthNode.id);
        };
        
        const handleMouseLeave = (event) => {
          highlightExclusiveNode();
        };
        
        // selected state
        const classNames = ['item'];
        if (synthNode.selected) classNames.push('selected');
        if (synthNode.highlighted) classNames.push('highlighted');

        // buttons to change node order
        // TODO: move handlers outside `map()`
        synthNode.index = itemIndex;

        const moveNodeUp = (event) => {
          event.stopPropagation();
          swapNodes(synthNode.index - 1, synthNode.index);
        }
      
        const moveNodeDown = (event) => {
          event.stopPropagation();
          swapNodes(synthNode.index, synthNode.index + 1);
        }
      
        const hideUpOption = itemIndex == 0 ? 'invisible' : '';
        const hideDownOption = itemIndex == (nodes.length - 1) ? 'invisible' : '';
        itemIndex++;

        return (
          <div
            className={classNames.join(' ')}
            key={synthNode.id}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div>{`${synthNode.id}: ${displayName}`}</div>
            <div className="iconGroup">
              <button className={hideUpOption} onClick={moveNodeUp}>Up</button>
              <button className={hideDownOption} onClick={moveNodeDown}>Down</button>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default ParameterGroup
