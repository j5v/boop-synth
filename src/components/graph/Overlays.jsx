import './Overlays.css'
import { remAsPx } from '../../lib/utils.js'

function Overlays() {

  const testUI = <rect x={remAsPx(10)} y={remAsPx(10)} width={remAsPx(30)} height={remAsPx(20)} fill="hsla(200,50%,10%,0.8);" stroke="white"></rect>

  return <></>; //testUI;

}

export default Overlays
