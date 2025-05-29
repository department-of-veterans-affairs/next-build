import { VamcSystemVaPolice as FormattedVamcSystemVaPolice } from '@/types/formatted/vamcSystemVaPolice'
import { ContentFooter } from '@/templates/common/contentFooter'
import { useEffect } from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'

type VamcSystemVaPoliceProps = {
  title: string
}

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function VamcSystemVaPolice({
  title,
  menu,
  policeOverview,
}: FormattedVamcSystemVaPolice) {
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <div className="va-l-detail-page va-facility-page">
      <div className="usa-grid usa-grid-full">
        {/* Nav data fille in by a separate script from `window.sideNav` */}
        <nav aria-label="secondary" data-widget-type="side-nav" />
        {/* Main page content */}
        <div className="usa-width-three-fourths">
          <article className="usa-content">
            <h1>{title}</h1>
            {/* Intro text (field_cc_va_police_overview)} */}
            <div
              className="va-introtext vads-u-font-size--lg vads-u-font-family--serif"
              dangerouslySetInnerHTML={{ __html: policeOverview.html }}
            ></div>
            {/* Table of Contents */}
            <va-on-this-page></va-on-this-page>
            {/* How to contact us (field_phone_numbers_paragraph) */}
            <div className="vads-u-margin-bottom--4" id="field-phone-numbers">
              <h2 id="how-to-contact-us-police">How to contact us</h2>
              <p>
                Use our non-emergency phone number to request more information
                about VA police at PLACEHOLDER FIELD OFFICE ENTITY TITLE.
              </p>
              <p>
                You can call us at{' '}
                <va-telephone
                  contact="PLACEHOLDER phoneNumber.contact"
                  extension="PLACEHOLDER phoneNumber.extension"
                ></va-telephone>
                <span>000-000-00000</span>
              </p>
            </div>
            {/* How to request a VA police report (field_cc_police_report) */}
            <div
              className="vads-u-margin-bottom--3"
              id="field-va-police-reports"
            >
              PLACEHOLDER VA POLICE REPORTS
            </div>
            {/* Other questions you may have about VA police (field_cc_faq) */}
            <div className="vads-u-margin-bottom--3" id="field-cc-faq-police">
              PLACEHOLDER FAQ
            </div>
          </article>
          <va-back-to-top></va-back-to-top>
          {/* Footer */}
          <ContentFooter />
        </div>
      </div>
    </div>
  )
}
