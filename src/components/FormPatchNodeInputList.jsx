import './FormPatchNodeInputList.css'
import { asRem } from '../lib/utils.js'
import { getSynthNodeTerminalIntentsById } from '../lib/synth.js'

function FormPatchNodeInputList(props) {

  const { synthNode } = props;
  const { inputs } = synthNode;

  let py = 1; 

  return (
    (inputs || []).map(i => {
      py += 2;
      const classCSS = getSynthNodeTerminalIntentsById(i.intentId).classCSS;

      return (
        <div className="form-input-row" key={i.id}>
          <div>{i.displayName}</div>
        </div>
      )
    })
  )
}

export default FormPatchNodeInputList
