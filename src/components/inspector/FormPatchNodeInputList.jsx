import './FormPatchNodeInputList.css'
import { getSynthNodeTerminalIntentsById } from '../../lib/synth.js'
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
