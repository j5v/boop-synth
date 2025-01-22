import './SynthGraph.css'
import { useState } from 'react'
import usePatchStore from '../../store/patchStore.jsx'
import SynthNodes from './SynthNodes.jsx'
import SynthNodeLinks from './SynthNodeLinks.jsx'
import SynthNodeLinkConnecting from './SynthNodeLinkConnecting.jsx'
import NodeSelectionBox from './NodeSelectionBox.jsx'
import { pxAsRem } from '../../lib/utils.js'

/* SynthGraph:
  - Contains the node graph and Links.
  - Handles events for: moving nodes, drag-selecting many nodes.
  - Handles some of the mouse events for connecting nodes.
      See SynthNodeInputs, synthNodeOutputs.
*/

function SynthGraph() {

  const selectThisNode = usePatchStore(
    // On the SynthGraph (background), click unselects all nodes.
    // In SynthNodes[<SynthNode>] click on a node to select it.
    (state) => state.selectExclusiveNode
  );

  const [prevDragPosX, setPrevDragPosX] = useState(0);
  const [prevDragPosY, setPrevDragPosY] = useState(0);
  const [draggingNode, setDraggingNode] = useState(false);
  const [showDraggingNode, setShowDraggingNode] = useState(false);
  
  const [mousePos, setMousePos] = useState({x: 0, y: 0});


  // Pan and zoom

  const [panning, setPanning] = useState(false);
  const view = usePatchStore((state) => state.ui.view) || {
    scale: 1,
    panX: 0,
    panY: 0
  };

  const panView = usePatchStore((state) => state.panView)

  const doPanView = (event) => {
    const xDiffRem = event.clientX - prevDragPosX;
    const yDiffRem = event.clientY - prevDragPosY;

    setPrevDragPosX(event.clientX);
    setPrevDragPosY(event.clientY);

    panView(xDiffRem, yDiffRem);
  }

  const viewAll = usePatchStore((state) => state.viewAll)

  const handleViewAll = () => {
    // Todo: a safer way of getting the SVG dimensions
    const svgElement = document.getElementById('node-graph');

    if (svgElement) {
      viewAll(svgElement.clientWidth, svgElement.clientHeight);
    } else {
      viewAll();
    }
  }



  // Drag Link from Input

  const setLinkDragFromInput = usePatchStore((state) => state.setLinkDragFromInput);
  const endDragLinkFromInput = usePatchStore((state) => state.endDragLinkFromInput);

  const dragLinkFromInputState = usePatchStore((state) => state.ui.draggingLinkFromInput);

  const doDragLinkFromInput = (event) => {
    const newPageX = pxAsRem(event.pageX);
    const newPageY = pxAsRem(event.pageY);

    const xDiffRem = newPageX - dragLinkFromInputState.prevPageX;
    const yDiffRem = newPageY - dragLinkFromInputState.prevPageY;

    const spec = {
      ...structuredClone(dragLinkFromInputState),
      loosePosX: dragLinkFromInputState.loosePosX + xDiffRem / view.scale,  // change when implementing zoom and pan
      loosePosY: dragLinkFromInputState.loosePosY + yDiffRem / view.scale,
      prevPageX: newPageX,
      prevPageY: newPageY,
    }
    setLinkDragFromInput(spec);
  };
  
  const doEndDragLinkFromInput = (event) => {
    // console.log('SynthGraph:doEndDragLinkFromInput()');
    endDragLinkFromInput();
    event.stopPropagation();
  };


  // Drag Link from Output

  const setLinkDragFromOutput = usePatchStore((state) => state.setLinkDragFromOutput);
  const endDragLinkFromOutput = usePatchStore((state) => state.endDragLinkFromOutput);

  const dragLinkFromOutputState = usePatchStore((state) => state.ui.draggingLinkFromOutput);

  const handleOnClick = (event) => {
    // console.log('SynthNodeBpanX:handleClick() to unselect all nodes')
    selectThisNode();
  }

  const doDragLinkFromOutput = (event) => {
    // console.log('SynthGraph:doDragLinkFromOutput()');

    const newPageX = pxAsRem(event.pageX);
    const newPageY = pxAsRem(event.pageY);

    const xDiffRem = newPageX - dragLinkFromOutputState.prevPageX;
    const yDiffRem = newPageY - dragLinkFromOutputState.prevPageY;

    const spec = {
      ...structuredClone(dragLinkFromOutputState),
      loosePosX: dragLinkFromOutputState.loosePosX + xDiffRem / view.scale,  // change when implementing zoom and pan
      loosePosY: dragLinkFromOutputState.loosePosY + yDiffRem / view.scale,
      prevPageX: newPageX,
      prevPageY: newPageY,
    }

    setLinkDragFromOutput(spec);
  };
  
  const doEndDragLinkFromOutput = (event) => {
    endDragLinkFromOutput();
    event.stopPropagation();
  };



  // Drag node

  const dragSelectedNodes = usePatchStore((state) => state.dragSelectedNodes)
  const clearLinkDragging = usePatchStore((state) => state.clearLinkDragging);

  const doDragNodeBegin = (event) => {
    setDraggingNode(true);

    setPrevDragPosX(pxAsRem(event.pageX));
    setPrevDragPosY(pxAsRem(event.pageY));
  };

  const doDragNode = (event) => {
    setShowDraggingNode(true);
    event.stopPropagation();

    const xDiffRem = (pxAsRem(event.pageX) - prevDragPosX) / view.scale;
    const yDiffRem = (pxAsRem(event.pageY) - prevDragPosY) / view.scale;

    setPrevDragPosX(pxAsRem(event.pageX));
    setPrevDragPosY(pxAsRem(event.pageY));

    dragSelectedNodes(xDiffRem, yDiffRem);
  };

  const doDragNodeEnd = (event) => {
    setDraggingNode(false);
    setShowDraggingNode(false);
    event.stopPropagation();
  };


  // Drag selection box

  const selectionBounds = usePatchStore((state) => state.ui.selectionBounds);
  const beginSelectionBox = usePatchStore((state) => state.beginSelectionBox);
  const dragSelectionBox = usePatchStore((state) => state.dragSelectionBox);
  const endSelectionBox = usePatchStore((state) => state.endSelectionBox);


  // Keyboard shortcuts

  const removeSelectedNodes = usePatchStore((state) => state.removeSelectedNodes)
  const duplicateSelectedNodes = usePatchStore((state) => state.duplicateSelectedNodes)
  const selectAllNodes = usePatchStore((state) => state.selectAllNodes)
  const reset = usePatchStore((state) => state.reset)
  const setViewScale = usePatchStore((state) => state.setViewScale)

  const handleKeyDown = (event) => {
    const k = event.key.toLowerCase();
    // console.log(event);

    // TODO: remove unnecessary event blockers.

    if (k == 'delete' || k == 'x') {
      removeSelectedNodes();
      event.stopPropagation();
      event.preventDefault();

    } else if (k == 'v') {
      duplicateSelectedNodes();
      event.stopPropagation();
      event.preventDefault();

    } else if (k == 'a' && event.ctrlKey == true) {
      selectAllNodes();
      event.preventDefault();

    } else if (k == 'insert' || k == 'a') {
      event.preventDefault();
      document.getElementById('addNodeSelect').focus();
      document.getElementById('addNodeSelect').click();

    } else if (k == 'enter') {
      document.getElementById('playAudioButton').click();
      event.stopPropagation();
      event.preventDefault();

    } else if (k == 'r') {
      if (window.confirm('Continue to reset? This will load the default starting patch.')) reset();
      event.stopPropagation();
      event.preventDefault();

    } else if (k == '0' && event.ctrlKey == true) {
      handleViewAll();
      event.preventDefault();

    }
  
  };


  // Mouse event handlers

  const MIDDLE_BUTTON = 1;
  const nodes = usePatchStore((state) => state.nodes);
  
  const handleMouseDown = (event) => {
    if (event.button == MIDDLE_BUTTON) {
      setPrevDragPosX(event.clientX);
      setPrevDragPosY(event.clientY);
      setPanning(true);
    } else {
      if (nodes.filter(n => n.highlighted).length > 0) {
        // any highlighted: means mouse is over a node, so don't so a selection drag; move a node.
        doDragNodeBegin(event);
      } else {
        beginSelectionBox(mousePos.x, mousePos.y);
      }
    }
  }

  const handleMouseMove = (event) => {
    // store SVG mouse position for for handleWheel
    const svgElement = document.getElementById('node-graph');
    if (svgElement) {
      const svgBounds = svgElement.getBoundingClientRect();

      setMousePos({
        x: event.clientX - svgBounds.left - svgElement.clientLeft,
        y: event.clientY - svgBounds.top - svgElement.clientTop
      });
    };

    if (panning) doPanView(event);
    if (draggingNode) doDragNode(event);
    if (selectionBounds) dragSelectionBox(mousePos.x, mousePos.y);
    if (dragLinkFromInputState && dragLinkFromInputState.fromNode) doDragLinkFromInput(event);
    if (dragLinkFromOutputState && dragLinkFromOutputState.fromNode) doDragLinkFromOutput(event);
  }

  const handleMouseUp = (event) => {
    if (event.button == MIDDLE_BUTTON) {
      setPanning(false);
    } else {
      if (draggingNode) doDragNodeEnd(event);
      if (selectionBounds) {
        endSelectionBox();
        event.stopPropagation();
        event.preventDefault();
      }
      if (dragLinkFromInputState && dragLinkFromInputState.fromNode) doEndDragLinkFromInput(event);
      if (dragLinkFromOutputState && dragLinkFromOutputState.fromNode) doEndDragLinkFromOutput(event);
      clearLinkDragging();
    }
  }

  const handleWheel = (event) => {
    setViewScale(
      view.scale * Math.pow(2, -(event.deltaY || 0) * 0.001),
      mousePos || { x:0, y:0 } // This default { x, y } is not ideal.
    );
  }
  
  // debug overlays
  
  const debugText = false ? 
    <text fill="white" fontSize="10" x="2rem" y="1.25rem">
      Debug: mx: {mousePos.x}, my: {mousePos.y}, view.scale:{view.scale.toFixed(3)}, view.panX:{view.panX.toFixed(2)}, view.panY:{view.panY.toFixed(2)}.
    </text>
    : <></>

  const debugCoords = false ? <circle fill="#888" cx="0" cy="0" r="1" /> : <></>;

  // Selection box

  const selectionBox = selectionBounds ? <NodeSelectionBox rectCoords={selectionBounds} view={view}/> : <></>;

  return (
    <svg
      id="node-graph"
      role="list"
      className={'SynthGraph' + (showDraggingNode ? ' dragging' : '')}
      onClick={handleOnClick /* unselects all */}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      tabIndex={0}
    >
      <g transform={`
        translate(${(view.panX || 0)} ${(view.panY || 0)})
        scale(${view.scale || 1})
        `}
      >
        <SynthNodeLinks />
        <SynthNodes />
        <SynthNodeLinkConnecting />
        {selectionBox}
        {debugCoords}  
      </g>
      {debugText}
    </svg>
  )
}

export default SynthGraph
