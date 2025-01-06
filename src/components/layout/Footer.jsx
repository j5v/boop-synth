import { memo } from 'react';

import './Footer.css'
import FooterItem from './FooterItem.jsx'

const Footer = memo(function Footer(props) {

  const build = '0.0.1.010';
  const buildDate = '2025-01-06';

  return (
    <div className="Footer">
      <>
        <FooterItem>
          <a href="http://johnvalentine.co.uk" target="_blank">j5v</a>
        </FooterItem>
        <FooterItem>
          <span className="explained" title="Limited accessibility, no patch loading, no output parameter editing, some bugs known">Early access</span> version {build}, {buildDate}.
        </FooterItem>
      </>
    </div>
  )
})

export default Footer
