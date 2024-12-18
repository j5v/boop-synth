import './SynthNode.css'
 
function SynthNode(props) {

  const { synthNode } = props;

  const asRem = x => x + 'rem';

  return (
    <rect
      className="SynthNodeBox"
      x={asRem(synthNode.x)}
      y={asRem(synthNode.y)}
      width={asRem(synthNode.w)}
      height={asRem(synthNode.h)}
    />
  )
}

export default SynthNode
