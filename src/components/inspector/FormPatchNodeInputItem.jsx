import './FormPatchNodeInputItem.css'
import { getSynthNodeTerminalIntentsById } from '../../lib/synth.js'

function FormPatchNodeInputItem(props) {

  const { inputItem } = props;
  const intent = getSynthNodeTerminalIntentsById(inputItem.intentId);
  const { classCSS, name } = intent;

  const displayUnits = (inputItem.displayUnits) ? (
    // not using this yet
    <div className="units">{inputItem.displayUnits}</div>
  ) : <></>

  const inputField = (!inputItem.exposed || inputItem.isOffset) ? (
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

  const rowClassNames = ['form-input-row'];
  if (inputItem.placeholder) rowClassNames.push('placeholder');

  
  return (
    <div className={rowClassNames.join(' ')} key={inputItem.id} role='listitem'>
      <div className="exposure">{exposureField}</div>
      <div className="label" title={name}>{inputItem.displayName}</div>
      {inputField}
    </div>
  )
}

export default FormPatchNodeInputItem
