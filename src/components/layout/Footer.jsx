import { appInfo } from '../../lib/appInfo.js'
import { memo } from 'react';

import './Footer.css'
import FooterItem from './FooterItem.jsx'

const Footer = memo(function Footer(props) {

  const build = appInfo.appVersion;
  const buildDate = appInfo.appDate;

  return (
    <div className="Footer">
      <>
        <FooterItem>
          <a href={appInfo.authorURL} target="_blank">{appInfo.authorName}</a>
        </FooterItem>
        <FooterItem>
          <span className="explained" title={appInfo.specialVersionAbout}>{appInfo.specialVersionName}</span> version {build}, {buildDate}.
        </FooterItem>
      </>
    </div>
  )
})

export default Footer
