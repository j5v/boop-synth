import './FormPatchNodeInputList.css'

import { getDefaultInput } from '../../lib/synthGraphUtils.js'

import FormPatchNodeInputItem from './FormPatchNodeInputItem.jsx'
import React from 'react' // not needed to build; satisfies a code checker

function FormPatchNodeInputList(props) {

  const { synthNode, isParam = false } = props;
  const { inputs } = synthNode;
  
  const displayInputs = (inputs || [])
    // filter handles undefined as false.
    .filter(i => (getDefaultInput(synthNode, i).isParam == true) == (isParam == true))
    .sort((a, b) => getDefaultInput(synthNode, a).order - getDefaultInput(synthNode, b).order);

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
