import './FormPatchNodeInputList.css'
import FormPatchNodeInputItem from './FormPatchNodeInputItem.jsx'

function FormPatchNodeInputList(props) {

  const { synthNode } = props;
  const { inputs } = synthNode;
  
  return (
    (inputs || []).map(i => (
      <FormPatchNodeInputItem key={`${synthNode.id}-${i.id}`} inputItem={i} />
    ))
  )
}

export default FormPatchNodeInputList
