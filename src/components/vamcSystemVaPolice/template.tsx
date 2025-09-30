import { VamcSystemVaPolice as FormattedVamcSystemVaPolice } from './formatted-type'
import { ContentFooter } from '@/components/contentFooter/template'
import { QaSection } from '@/components/qaSection/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'

type VamcSystemVaPoliceProps = {
  title: string
}

export function VamcSystemVaPolice({
  title,
  menu,
  policeOverview,
  system,
  phoneNumber,
  policeReport,
  faqs,
}: FormattedVamcSystemVaPolice) {
  return (
    <div className="va-l-detail-page va-facility-page">
      <SideNavLayout menu={menu}>
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
          <div className="vads-u-margin-bottom--3" id="field-va-police-reports">
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
      </SideNavLayout>
    </div>
  )
}
