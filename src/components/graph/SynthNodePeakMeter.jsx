import './SynthNodePeakMeter.css'
import { signalToDecibelsFS, asRem, joinItems } from '../../lib/utils.js'
import { nodeLayout } from '../../lib/nodeLayout.js'

function SynthNodePeakMeter(props) {

  const { synthNode } = props;
  const { nodeBottomPadding } = nodeLayout;

  const classes = ['peakMeter-text'];

  let dBText = '';
  if (synthNode.peakMeter) {
    const dB = signalToDecibelsFS(synthNode.peakMeter);
    dBText = `${dB < 0 ? '−' : '+'}${Math.abs(dB).toFixed(2)} dBFS`;
    if (dB > 0) { 
      classes.push('clipped');
    } else if (dB > -3.01) {
      classes.push('warn');
    }
  }

  return (
    <g>
      <text
        className={joinItems(classes, ' ')}
        x={asRem(synthNode.x + synthNode.w - 1)}
        y={asRem(synthNode.y + synthNode.h - nodeBottomPadding)}
      >{dBText}</text>
    </g>
  );
}

export default SynthNodePeakMeter
