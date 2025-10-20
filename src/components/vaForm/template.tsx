import { VaForm as VaFormType } from './formatted-type'

type VaFormProps = VaFormType

export function VaForm({
  title,
  formName,
  formNumber,
  revisionDate,
  issueDate,
  formType,
  benefitCategories,
  administration,
  formUrl,
  toolUrl,
  toolIntro,
  usage,
  linkTeasers,
  relatedForms,
}: VaFormProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }

  return (
    <main className="va-l-detail-page">
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-three-fourths">
          <article className="usa-content">
            <h1 className="vads-u-margin-bottom--0">{title}</h1>

            <dl>
              <div className="vads-u-margin-bottom--4">
                <dt className="va-introtext">
                  <dfn className="vads-u-visibility--screen-reader">
                    Form name:
                  </dfn>
                  {formName}
                </dt>
              </div>

              {(revisionDate || issueDate) && (
                <div>
                  <dd>
                    <dfn className="vads-u-font-weight--bold vads-u-display--inline">
                      Form revision date:
                    </dfn>
                    {` ${formatDate(revisionDate || issueDate!)}`}
                  </dd>
                </div>
              )}

              <div className="vads-u-margin-y--1">
                <dd>
                  <dfn className="vads-u-font-weight--bold vads-u-display--inline">
                    Related to:
                  </dfn>
                  {formType === 'employment' && ` Employment or jobs at VA`}
                  {formType === 'non-va' && (
                    <>
                      {` A non-VA form. For other government agency forms, go to the `}
                      <a href="https://www.gsa.gov/reference/forms">
                        GSA forms library
                      </a>
                      .
                    </>
                  )}
                  {(!formType || formType === 'benefit') && (
                    <>
                      {benefitCategories && benefitCategories.length > 0
                        ? ` ${benefitCategories.join(', ')}`
                        : ` ${administration || 'VA benefits and services'}`}
                    </>
                  )}
                </dd>
              </div>
            </dl>

            {usage && (
              <>
                <h2 className="vads-u-margin-top--4">When to use this form</h2>
                <div dangerouslySetInnerHTML={{ __html: usage }} />
                <h3 className="vads-u-margin-bottom--2">Downloadable PDF</h3>
              </>
            )}

            {!usage && (
              <h2 className="vads-u-margin-bottom--2">Downloadable PDF</h2>
            )}

            <div id="main-download-container">
              {formUrl && (
                <button
                  className="va-button-link vads-u-display--flex vads-u-align-items--center"
                  data-widget-type="find-va-forms-pdf-download-helper"
                  data-href={formUrl.uri}
                  data-form-number={formNumber}
                  id="main-download-button"
                  onClick={() => window.open(formUrl.uri, '_blank')}
                >
                  <va-icon
                    className="vads-u-margin-right--0p5"
                    icon="file_download"
                    size="3"
                  />
                  Download VA Form {formNumber} (PDF)
                </button>
              )}
            </div>

            {toolUrl && (
              <>
                <h3>Online tool</h3>
                <p>{toolIntro}</p>
                <va-link-action
                  href={toolUrl.uri}
                  text="Go to the online tool"
                  type="secondary"
                />
              </>
            )}

            {relatedForms && relatedForms.length > 0 && (
              <section>
                <h2>Related forms and instructions</h2>
                <ul className="usa-unstyled-list" role="list">
                  {relatedForms.map((vaForm) => (
                    <li key={vaForm.id}>
                      <h3>
                        <a
                          href={`/find-forms/about-form-${vaForm.formNumber?.toLowerCase() ?? ''}`}
                        >
                          VA Form {vaForm.formNumber}
                        </a>
                      </h3>
                      <p>{vaForm.formName}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <div className="vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-y--2p5 vads-u-margin-y--4">
                <h2 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-padding-bottom--1 vads-u-border-bottom--1px vads-u-border-color--gray-light">
                  {linkTeasers && linkTeasers.length > 0
                    ? `Helpful links related to VA Form ${formNumber}`
                    : 'Helpful links'}
                </h2>
                <ul className="usa-unstyled-list" role="list">
                  {linkTeasers && linkTeasers.length > 0 ? (
                    linkTeasers.map((linkTeaser, index) => (
                      <li key={index}>
                        <h3 className="vads-u-font-size--h4">
                          <va-link
                            href={linkTeaser.link.url}
                            text={linkTeaser.link.title || linkTeaser.link.uri}
                          />
                        </h3>
                        {linkTeaser.summary && (
                          <p className="vads-u-margin--0">
                            {linkTeaser.summary}
                          </p>
                        )}
                      </li>
                    ))
                  ) : (
                    <>
                      <li>
                        <h3 className="vads-u-font-size--h4">
                          <va-link
                            href="/change-direct-deposit"
                            text="Change your direct deposit information"
                          />
                        </h3>
                        <p className="vads-u-margin--0">
                          Find out how to update your direct deposit information
                          online for disability compensation, pension, or
                          education benefits.
                        </p>
                      </li>
                      <li>
                        <h3 className="vads-u-font-size--h4">
                          <va-link
                            href="/change-address"
                            text="Change your address"
                          />
                        </h3>
                        <p className="vads-u-margin--0">
                          Find out how to change your address and other
                          information in your VA.gov profile for disability
                          compensation, claims and appeals, VA health care, and
                          other benefits.
                        </p>
                      </li>
                      <li>
                        <h3 className="vads-u-font-size--h4">
                          <va-link
                            href="/records/get-military-service-records/"
                            text="Request your military records, including DD214"
                          />
                        </h3>
                        <p className="vads-u-margin--0">
                          Submit an online request to get your DD214 or other
                          military service records through the milConnect
                          website.
                        </p>
                      </li>
                      <li>
                        <h3 className="vads-u-font-size--h4">
                          <va-link
                            href="/records/"
                            text="Get your VA records and documents online"
                          />
                        </h3>
                        <p className="vads-u-margin--0">
                          Learn how to access your VA records, benefit letters,
                          and documents online.
                        </p>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </section>
          </article>
        </div>
      </div>
    </main>
  )
}
