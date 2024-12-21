import './PerformancePropertiesForm.css'

function PerformancePropertiesForm(props) {

  const className = 'PerformancePropertiesForm';

  return (
    <div className={className}>
      {props.children}
    </div>
  )
}

export default PerformancePropertiesForm
