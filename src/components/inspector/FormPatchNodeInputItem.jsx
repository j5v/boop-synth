import './FormPatchNodeInputItem.css'
import { joinItems } from '../../lib/utils.js'
import { getSynthNodeTerminalIntentsById } from '../../lib/synth.js'
import usePatchStore from '../../store/patchStore.jsx'

function FormPatchNodeInputItem(props) {

  const setInputField = usePatchStore((state) => state.setInputField);

  const { inputItem } = props;
  const intent = getSynthNodeTerminalIntentsById(inputItem.intentId);
  const { name } = intent;

  setInputField

  const changeInput = (event) => {
    console.log('changeInput()', inputItem, event.target.value);
    setInputField(inputItem, event.target.value);
  }

  const displayUnits = (inputItem.displayUnits) ? (
    // not using this yet
    <div className="units">{inputItem.displayUnits}</div>
  ) : <></>

  const inputField = (!inputItem.exposed || inputItem.isOffset) ? (
    <input
      className="number"
      onBlur={changeInput}
      defaultValue={inputItem.value || inputItem.defaultValue}
      title={name}      
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
      <div className="label" title={inputItem.description}>{inputItem.displayName}</div>
      {inputField}
    </div>
  )
}

export default FormPatchNodeInputItem
