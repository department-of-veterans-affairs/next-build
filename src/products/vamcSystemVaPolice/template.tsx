import { VamcSystemVaPolice as FormattedVamcSystemVaPolice } from '@/products/vamcSystemVaPolice/formatted-type'
import { ContentFooter } from '@/templates/common/contentFooter'
import { useEffect } from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { QaSection } from '@/templates/components/qaSection'

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
  system,
  phoneNumber,
  policeReport,
  faqs,
}: FormattedVamcSystemVaPolice) {
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <div className="va-l-detail-page va-facility-page">
      <div className="vads-grid-container">
        {/* Nav data fille in by a separate script from `window.sideNav` */}
        <nav aria-label="secondary" data-widget-type="side-nav" />
        {/* Main page content */}
        <div className="vads-grid-row">
          <div className="vads-grid-col-12">
            <article className="usa-content">
              <h1>{title}</h1>
              {/* Renders field_cc_va_police_overview with its tags inside the <div>  */}
              <div
                className="va-introtext"
                dangerouslySetInnerHTML={{ __html: policeOverview.html }}
              ></div>
              {/* Table of Contents */}
              <va-on-this-page></va-on-this-page>
              {/* How to contact us (field_phone_numbers_paragraph) */}
              <div className="vads-u-margin-bottom--4" id="field-phone-numbers">
                <h2 id="how-to-contact-us-police">How to contact us</h2>
                <p>
                  Use our non-emergency phone number to request more information
                  about VA police at {system}.
                </p>
                <p>
                  You can call us at&nbsp;
                  <va-telephone
                    contact={phoneNumber.number}
                    extension={phoneNumber.extension}
                  ></va-telephone>
                  <span>. We’re here 24/7.</span>
                </p>
              </div>
              {/* How to request a VA police report (field_cc_police_report) */}
              <div
                className="vads-u-margin-bottom--3"
                id="field-va-police-reports"
              >
                <va-summary-box uswds="true">
                  <h3
                    slot="headline"
                    id="how-to-request-a-va-police-rep"
                    className="vads-u-font-size--h3"
                  >
                    {policeReport.title}
                  </h3>
                  {/* Renders field_cc_police_report with its tags inside the <div> */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: policeReport.description,
                    }}
                  />
                  <va-link
                    href={policeReport.link?.url}
                    text={policeReport.link?.label}
                  />
                </va-summary-box>
              </div>
              {/* Other questions you may have about VA police (field_cc_faq) */}
              <div className="vads-u-margin-bottom--3" id="field-cc-faq-police">
                {/* FAQs */}
                {faqs && <QaSection {...faqs} />}
              </div>
              <va-back-to-top></va-back-to-top>
              {/* Footer */}
              <ContentFooter />
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
