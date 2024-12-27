import './FormPatchNodeInputItem.css'
import { getSynthNodeTerminalIntentsById } from '../../lib/synth.js'

function FormPatchNodeInputItem(props) {

  const { inputItem } = props;
  const intent = getSynthNodeTerminalIntentsById(inputItem.intentId);
  const { classCSS, name } = intent;

  const inputField = (!inputItem.exposed) ? (
    <input
      className="number"
      value={inputItem.value || inputItem.defaultValue}
      readOnly
    ></input>
  ) : <></>
  const exposureField = (intent.modulatable) ? (
    <input
      type="checkbox"
      checked={inputItem.exposed}
      title="Show terminal"
      readOnly></input>
  ) : <></>
  
  return (
    <div className="form-input-row" key={inputItem.id}>
      <div className="exposure">{exposureField}</div>
      <div className="label" title={name}>{inputItem.displayName}</div>
      {inputField}
    </div>
  )
}

export default FormPatchNodeInputItem
