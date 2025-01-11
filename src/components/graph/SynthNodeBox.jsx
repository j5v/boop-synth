import { useState } from 'react'
import './SynthNodeBox.css'
import usePatchStore from '../../store/patchStore.jsx'
import { asRem } from '../../lib/utils.js'
import { nodeLayout } from '../../lib/nodeLayout.js'

function SynthNodeBox(props) {

  const { synthNode } = props;

  // Calculate box height, based on the number of terminals

  const inputCount = (synthNode.inputs && synthNode.inputs.filter(i => i.exposed).length) || 0;
  const outputCount = (synthNode.outputs && synthNode.outputs.length) || 0;
  const maxTerminals = Math.max(inputCount, outputCount);

  const { nodeVSpacing, nodeVOffset, nodeVPadding } = nodeLayout;
  const nodeHeight = nodeVOffset + maxTerminals * nodeVSpacing + nodeVPadding;

  synthNode.h = nodeHeight; // cache for other components

  // Selection

  const selectExclusiveNode = usePatchStore((state) => state.selectExclusiveNode)
  const toggleSelectNode = usePatchStore((state) => state.toggleSelectNode)
  const highlightExclusiveNode = usePatchStore((state) => state.highlightExclusiveNode);

  const handleMouseDown = (event) => {
    if (event.ctrlKey) {
      toggleSelectNode(synthNode.id);
    } else {
      if (!synthNode.selected) selectExclusiveNode(synthNode.id);
    }
  };
  
  const handleClick = (event) => {
    // Prevent a click on parent/background from unselecting all nodes
    event.stopPropagation();
  };

  const handleMouseEnter = (event) => {
    highlightExclusiveNode(synthNode.id);
  };
  
  const handleMouseLeave = (event) => {
    highlightExclusiveNode();
  };
  
  // Presentation

  const classNames = ['SynthNodeBox'];
  if (synthNode.selected) classNames.push('selected');
  if (synthNode.highlighted) classNames.push('highlighted');

  return (
    <rect
      role="list-item"
      className={classNames.join(' ')}
      x={asRem(synthNode.x)}
      y={asRem(synthNode.y)}
      rx="0.6rem"
      width={asRem(synthNode.w)}
      height={asRem(nodeHeight)}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
  />
  )
}

export default SynthNodeBox
