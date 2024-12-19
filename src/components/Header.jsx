import './Header.css'

function Header(props) {

  const className = `Header ${props.context || ''}`

  return (
    <div className={className}>
      {props.text || ''}
    </div>
  )
}

export default Header
