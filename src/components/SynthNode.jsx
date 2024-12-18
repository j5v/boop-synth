import './SynthNode.css'
 
function SynthNode(props) {

  const { synthNode } = props;

  const asRem = x => x + 'rem';

  return (
    <>
      // todo: refactor as SynthNodeBox
      <rect
        className="SynthNodeBox"
        x={asRem(synthNode.x)}
        y={asRem(synthNode.y)}
        rx="0.6rem"
        width={asRem(synthNode.w)}
        height={asRem(synthNode.h)}
      />

      <text
        className="SynthNodeTitle"
        x={asRem(synthNode.x + 0.6)}
        y={asRem(synthNode.y + 1.4)}
      >{synthNode.displayName}</text>

    </>

  )
}

export default SynthNode
