import './SynthNodeLinks.css'
import usePatchStore from '../store/patchStore.jsx';
import SynthNodeLink from './SynthNodeLink.jsx'

function SynthNodeLinks() {

  const nodes = usePatchStore(
    (state) => state.nodes
  );


  return (
    nodes.map(node => {
      let py = 1;

      return (node.inputs.map(i => {
        const key=`${node.id}-${i.id}`;

        if (i.exposed) py += 2;

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
            if (outputItem.exposed) py += 2;
          }
        
          const outputPos = {
            x: outputNode.x + outputNode.w,
            y: outputNode.x + outputIndex * 2
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
