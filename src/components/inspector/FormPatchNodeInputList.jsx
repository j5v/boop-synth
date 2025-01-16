import './FormPatchNodeInputList.css'
import FormPatchNodeInputItem from './FormPatchNodeInputItem.jsx'

function FormPatchNodeInputList(props) {

  const { synthNode, isParam = false } = props;
  const { inputs } = synthNode;
  
  return (
    // filter handles undefined as false.
    (inputs || []).filter(i => (i.isParam == true) == (isParam == true)).map(i => (
      <FormPatchNodeInputItem key={`${synthNode.id}-${i.id}`} inputItem={i} synthNode={synthNode}/>
    ))
  )
}

export default FormPatchNodeInputList
