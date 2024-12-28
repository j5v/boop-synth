import './SynthNodeLinks.css'
import usePatchStore from '../../store/patchStore.jsx';
import SynthNodeLink from './SynthNodeLink.jsx'
import { nodeLayout } from '../../lib/nodeLayout.js'

function SynthNodeLinks() {

  const { nodeVSpacing, nodeVOffset, nodeVPadding } = nodeLayout;

  const nodes = usePatchStore(
    (state) => state.nodes
  );


  return (
    nodes.map(node => {
      let py = nodeVOffset;

      return (node.inputs.map(i => {
        const key=`${node.id}-${i.id}`;

        if (i.exposed) py += nodeVSpacing;

        const inputPos = {
          x: node.x, 
          y: node.y + py
        };

        const outputNode = i.link && nodes.find(n => n.id == i.link.synthNodeId);
        
        if (outputNode) {
          const outputOutput = outputNode.outputs.find(n => n.id == i.link.outputId);

          let outputIndex = 0;
          for (let outputItem in outputNode.outputs) {
            if (outputItem == outputOutput) {
              break;
            }
            outputIndex++;
            if (outputItem.exposed) py += nodeVSpacing;
          }
        
          const outputPos = {
            x: outputNode.x + outputNode.w,
            y: outputNode.y + outputIndex * nodeVSpacing + nodeVOffset
          };

          return (
            <SynthNodeLink
              key={key}
              outputPos={outputPos}
              inputPos={inputPos}
            />
          );
        }

      }))
    })
  );

}

export default SynthNodeLinks
