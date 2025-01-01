import './Footer.css'
import FooterItem from './FooterItem.jsx'

function Footer() {

  const build = '0.0.1.001';
  const buildDate = '2025-01-01';

  return (
    <div className="Footer">
      <>
        <FooterItem>
          <a href="http://johnvalentine.co.uk" target="_blank">j5v</a>
        </FooterItem>
        <FooterItem>
          <span class="explained" title="Limited accessibility, no patch saving, no output parameter editing, some bugs known">Early access</span> version {build}, {buildDate}.
        </FooterItem>
      </>
    </div>
  )
}

export default Footer
