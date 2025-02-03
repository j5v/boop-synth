import './SynthNodeTitle.css'
import { asRem, remAsPx } from '../../lib/utils.js'
import { getNodeDisplayTitle } from '../../lib/synthGraphUtils.js'
 
function SynthNodeTitle(props) {

  const { synthNode } = props;
  const displayName = getNodeDisplayTitle(synthNode);

  return (
    <>
      <defs>
        <clipPath id={`${synthNode.id}-text-clip`}>
          <rect
            x={remAsPx(synthNode.x)}
            y={remAsPx(synthNode.y)}
            width={remAsPx(synthNode.w - 0.5)}
            height={remAsPx(2)}
            fill="none"
          />
        </clipPath>
      </defs>
      <text
        className="SynthNodeTitle"
        x={asRem(synthNode.x + 0.6)}
        y={asRem(synthNode.y + 1.4)}
        clipPath={`url(#${synthNode.id}-text-clip)`}
        title={displayName}
      >{`${synthNode.id}: ${displayName}`}</text>
    </>
  )
}

export default SynthNodeTitle
