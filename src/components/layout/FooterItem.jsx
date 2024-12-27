import './FooterItem.css'

function FooterItem(props) {

  return (
    <div className="FooterItem">
      {props.children}
    </div>
  )
}

export default FooterItem
