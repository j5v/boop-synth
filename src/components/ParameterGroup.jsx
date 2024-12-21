import './ParameterGroup.css'

function ParameterGroup(props) {

  const className = 'ParameterGroup';

  return (
    <div className={className}>
      {props.children}
    </div>
  )
}

export default ParameterGroup
