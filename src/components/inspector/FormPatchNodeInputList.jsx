import './FormPatchNodeInputList.css'
import FormPatchNodeInputItem from './FormPatchNodeInputItem.jsx'

function FormPatchNodeInputList(props) {

  const { synthNode, isParam = false } = props;
  const { inputs } = synthNode;
  
  const displayInputs = (inputs || [])
    // filter handles undefined as false.
    .filter(i => (i.isParam == true) == (isParam == true))
    .sort((a, b) => a.order - b.order);

  if (displayInputs && displayInputs.length == 0) return (<p className="no-items-text">(none)</p>)

  return (
    displayInputs.map(i => (
      <FormPatchNodeInputItem
        key={`${synthNode.id}-${i.id}`}
        inputItem={i}
        synthNode={synthNode}
      />
    ))
  )
}

export default FormPatchNodeInputList
