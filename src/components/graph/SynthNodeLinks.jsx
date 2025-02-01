import './SynthNodeLinks.css'
import usePatchStore from '../../store/patchStore.jsx';
import SynthNodeLink from './SynthNodeLink.jsx'
import { getNodeTypeById } from '../../lib/synthNodeTypes';
import { nodeLayout } from '../../lib/nodeLayout.js'
import { remAsPx } from '../../lib/utils.js'

function SynthNodeLinks() {

  const { nodeVSpacing, nodeVOffset, nodeVPadding } = nodeLayout;

  const nodes = usePatchStore.getState().nodes;

  return (
    nodes.map(node => {
      let py = nodeVOffset;

      if (!node.inputs || node.inputs.length == 0) return;
      let inputIndex = 0;

      const synthNodeType = getNodeTypeById(node.nodeTypeId);

      return linksForInputs();
      
      function linksForInputs() {
        return node.inputs.map(i => {
          const key=`${node.id}-${i.id}`;

          if (i.exposed) {
            py += nodeVSpacing;
            inputIndex++;
          }

          const inputPos = {
            x: node.x, 
            y: node.y + py
          };

          // If appropriate, draw a link from the bypass input to the output.
          const bypassLink = (node.bypassed && synthNodeType.inputIdForBypass == i.id) ?
          // Assume node output is the first output. This might be wrong in future.
          <path
          key={`${node.id}-bp`}  
          className="synth-node-cable"
            d={`
              M ${remAsPx(inputPos.x)} ${remAsPx(inputPos.y)}
              L ${remAsPx(inputPos.x + node.w)} ${remAsPx(node.y + nodeVOffset + nodeVSpacing)}
            `}
          /> : <></>
  

          const outputNode = i.link && nodes.find(n => n.id == i.link.synthNodeId);
          
          if (outputNode) {
            const isFeedback = nodes.indexOf(node) <= nodes.indexOf(outputNode);

            const outputOutput = outputNode.outputs.find(n => n.id == i.link.outputId);

            let outputIndex = 0;
            for (let outputItem in outputNode.outputs) {
              if (outputItem == outputOutput) {
                break;
              }
              if (outputItem.exposed) {
                py += nodeVSpacing;
                outputIndex++;
              }
            }
          
            const outputPos = {
              x: outputNode.x + outputNode.w,
              y: outputNode.y + (1 + outputIndex) * nodeVSpacing + nodeVOffset
            };

            return (
              <g key={key}>
                <SynthNodeLink
                  k={key}
                  outputPos={outputPos}
                  inputPos={i.exposed ? inputPos : { x: inputPos.x, y: node.y + nodeVOffset }}
                  isFeedback={isFeedback}
                  outputBox={{ x: outputNode.x, y: outputNode.y, w: outputNode.w, h: outputNode.h }}
                  inputBox={{ x: node.x, y: node.y, w: node.w, h: node.h}}
                  outputIndex={outputIndex}
                  inputIndex={inputIndex}
                />
                {bypassLink}
              </g>
            );
          }

        })}
    })
  );

}

export default SynthNodeLinks
