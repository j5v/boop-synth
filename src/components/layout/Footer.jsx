import './Footer.css'
import FooterItem from './FooterItem.jsx'

function Footer() {

  const version = '0.0.0';

  return (
    <div className="Footer">
      <>
      <FooterItem>
          <a href="http://johnvalentine.co.uk" target="_blank">j5v</a>
        </FooterItem>
        <FooterItem>
          Early access version {version}, no patch saving, no output paramters, some bugs known.
        </FooterItem>
      </>
    </div>
  )
}

export default Footer
