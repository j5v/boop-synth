import './Header.css'

function Header(props) {

  const className = `Header ${props.context || ''}`

  return (
    <div className={className}>
      {props.children}
    </div>
  )
}

export default Header
