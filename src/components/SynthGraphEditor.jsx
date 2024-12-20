import './SynthGraphEditor.css'
import SynthNodeProperties from './SynthNodeProperties.jsx'
import SynthGraph from './SynthGraph.jsx'
import { useRef, useState } from 'react'

import usePatchStore from '../store/patchStore.jsx';

function SynthGraphEditor() {

  // begin drag

  const handleMouseMove = useRef(e => {
    setPosition(position => {
      const xDiff = position.coords.x - e.pageX;
      const yDiff = position.coords.y - e.pageY;
      return {
        x: position.x - xDiff,
        y: position.y - yDiff,
        coords: {
          x: e.pageX,
          y: e.pageY,
        },
      };
    });
  });


  // end drag


  const nodes = usePatchStore((state) => state.nodes);
  const selectedNode = nodes.find(n => n.selected);

  return (
    <div className="SynthGraphEditor">
      <SynthGraph />
      {selectedNode ? <SynthNodeProperties synthNode={selectedNode}/> : <></>}
    </div>
  )
}

export default SynthGraphEditor
