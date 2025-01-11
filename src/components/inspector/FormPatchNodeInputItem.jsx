import './FormPatchNodeInputItem.css'
import { joinItems } from '../../lib/utils.js'
import usePatchStore from '../../store/patchStore.jsx'
import { getSynthNodeTerminalIntentsById } from '../../lib/synthNodeIntents';

function FormPatchNodeInputItem(props) {

  const setInputValue = usePatchStore((state) => state.setInputValue);
  const setInputExposed = usePatchStore((state) => state.setInputExposed);

  const { inputItem } = props;
  const intent = getSynthNodeTerminalIntentsById(inputItem.intentId);
  const { name, description } = intent;
  const hint = joinItems([name, description], ': ');;

  const handleChangeValue = (event) => {
    setInputValue(inputItem, event.target.value);
  }

  const handleChangeExposure = (event) => {
    setInputExposed(inputItem, event.target.checked);
  }

  const displayUnits = (inputItem.displayUnits) ? (
    // not using this yet
    <div className="units">{inputItem.displayUnits}</div>
  ) : <></>

  const inputFieldVisible = (!inputItem.exposed || inputItem.isOffset)
  const inputField = <input
      className={`number ${inputFieldVisible ? '' : ' invisible'}`}
      onBlur={handleChangeValue}
      defaultValue={
        (inputItem.userValue !== undefined) ? inputItem.userValue :
        (inputItem.value !== undefined) ? inputItem.value :
        inputItem.defaultValue
      }
      title={hint}
    ></input>
  
  const exposureField = (intent.modulatable) ? (
    <input
      type="checkbox"
      checked={inputItem.exposed}
      onChange={handleChangeExposure}
      title="Show terminal"
    ></input>
  ) : <></>

  const rowClassNames = ['form-input-row'];
  if (inputItem.placeholder) rowClassNames.push('placeholder');

  const effectiveStateValue = inputItem.value !== undefined ? inputItem.value : inputItem.defaultValue;
  const trueValue = (
    inputItem.userValue &&    
    (inputItem.value || inputItem.defaultValue) &&
    (parseFloat(inputItem.userValue) != effectiveStateValue))
  ? <div className="true-value">{effectiveStateValue.toFixed(4)}</div>
  : <></>
  
  return (
    <>
      <div className={rowClassNames.join(' ')} key={inputItem.id} role='listitem'>
        <div className="exposure">{exposureField}</div>
        <div className="label" title={inputItem.description}>{inputItem.displayName}</div>
        {inputField}
      </div>
      {trueValue}
    </>
  )
}

export default FormPatchNodeInputItem
