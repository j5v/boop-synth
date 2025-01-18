import './FormPatchNodeInputItem.css'
import { joinItems, getItemById } from '../../lib/utils.js'
import { getNodeTypeById } from '../../lib/synthNodeTypes.js'
import usePatchStore from '../../store/patchStore.jsx'
import { getSynthNodeTerminalIntentsById, synthNodeTerminalIntents } from '../../lib/synthNodeIntents';

function FormPatchNodeInputItem(props) {

  const setInputValue = usePatchStore((state) => state.setInputValue);
  const setInputExposed = usePatchStore((state) => state.setInputExposed);

  const { inputItem, synthNode } = props;

  const nodeType = getNodeTypeById(synthNode.nodeTypeId);
  const nodeTypeInput = getItemById(nodeType.inputs, inputItem.id); // get matching input in synthNodeTypes

  const intent = getSynthNodeTerminalIntentsById(nodeTypeInput.intentId);
  const { name, description } = intent;
  const hint = joinItems([name, description], ': ');;

  const handleChangeValue = (event) => {
    setInputValue(inputItem, event.target.value, nodeTypeInput);
  }

  const handleChangeCheckbox = (event) => {
    setInputValue(inputItem, event.target.checked, nodeTypeInput);
  }

  const handleChangeExposure = (event) => {
    setInputExposed(inputItem, event.target.checked);
  }

  const displayUnits = (nodeTypeInput.displayUnits) ? (
    // not using this yet
    <div className="units">{nodeTypeInput.displayUnits}</div>
  ) : <></>

  const inputFieldVisible = (!inputItem.exposed || nodeTypeInput.isOffset)
  let inputField
  
  if (intent == synthNodeTerminalIntents.CHECK_BOOL) {

    // For compatibility with olf patches; remove in future.
    if (inputItem.value === 'false') inputItem.value = false;
    if (inputItem.value === 'true') inputItem.value = true;

    inputField = <input
    type="checkbox"
    checked={
      (inputItem.userValue !== undefined) ? inputItem.userValue :
      (inputItem.value !== undefined) ? inputItem.value :
      nodeTypeInput.defaultValue
    }
    onChange={(e) => handleChangeCheckbox(e, inputItem.id)}
    title=""
  ></input>

  } else {
   
    inputField = <input
      className={`number ${inputFieldVisible ? '' : ' invisible'}`}
      onBlur={handleChangeValue}
      defaultValue={
        (inputItem.userValue !== undefined) ? inputItem.userValue :
        (inputItem.value !== undefined) ? inputItem.value :
        nodeTypeInput.defaultValue
      }
      title={hint}
    ></input>
  }

  const exposureField = (intent.modulatable) ? (
    <input
      type="checkbox"
      checked={inputItem.exposed}
      onChange={handleChangeExposure}
      title="Show terminal"
    ></input>
  ) : <></>

  const rowClassNames = ['form-input-row'];
  if (nodeTypeInput.isPlaceholder) rowClassNames.push('placeholder');

  const effectiveStateValue = (inputItem.value !== undefined && inputItem.value !== null) ?
    inputItem.value :
    nodeTypeInput.defaultValue;

  const trueValue = (
    inputItem.userValue &&    
    (inputItem.value || nodeTypeInput.defaultValue) &&
    (inputItem.userValue != effectiveStateValue) // was parseFloat(inputItem.userValue)
  )
  ? <div className="true-value">{effectiveStateValue.toFixed(4)}</div>
  : <></>
  
  return (
    <>
      <div className={rowClassNames.join(' ')} key={inputItem.id} role='listitem'>
        <div className="exposure">{exposureField}</div>
        <div className="label" title={nodeTypeInput.description}>{nodeTypeInput.displayName}</div>
        {inputField}
      </div>
      {trueValue}
    </>
  )
}

export default FormPatchNodeInputItem
