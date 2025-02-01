// @ts-nocheck
import './FormPatchNodeInputItem.css'
import usePatchStore from '../../store/patchStore.jsx'

function FormPatchNodeBypass(props) {

  const { synthNode } = props;

  // bypass
  const setBypassNode = usePatchStore((state) => state.setBypassNode)

  const handleChangeCheckbox = (event) => {
    setBypassNode(synthNode.id, event.target.checked);
  }

  const inputField = <input
      type="checkbox"
      checked={synthNode.bypassed}
      onChange={(e) => handleChangeCheckbox(e)}
    ></input>

  const rowClassNames = ['form-input-row'];

  return (
    <>
      <div className={rowClassNames.join(' ')} key={-1} role='listitem'>
      <div className="exposure"> </div>
      <div className="label" title="">Bypass</div>
        {inputField}
      </div>
    </>
  );

}

export default FormPatchNodeBypass
