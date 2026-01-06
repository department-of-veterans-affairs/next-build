import { AlertBlock } from '../alertBlock/template'
import { ListOfLinkTeasers } from '../listOfLinkTeasers/template'
import { defaultHelpfulLinks } from './default-helpful-links'
import { VaForm as VaFormType } from './formatted-type'

type VaFormProps = VaFormType

const getDownloadButtonText = (lang: string, formNumber: string) => {
  if (lang === 'es') {
    return `Descargar el formulario VA ${formNumber}`
  }
  return `Download VA Form ${formNumber}`
}

export function VaForm({
  title,
  formName,
  formNumber,
  formLanguage,
  revisionDate,
  issueDate,
  formType,
  benefitCategories,
  administration,
  alertBlock,
  formUrl,
  toolUrl,
  toolIntro,
  usage,
  linkTeasers,
  relatedForms,
  formUpload,
}: VaFormProps) {
  const formatDate = (dateString: string) => {
    // Avoid UTC-to-local-timezone conversion by not using the `dateString`
    // directly. Instead, parse out the year and month to create the new Date.
    // This will remove any timezone conversion issues, so 2024-10-01 will show
    // up as October instead of rolling the month back to September because of
    // the timezone difference between UTC and the local time.
    const [year, month] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', {
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
                <dt className="va-introtext" lang={formLanguage}>
                  <dfn className="vads-u-visibility--screen-reader">
                    {formLanguage === 'es'
                      ? 'Nombre del formulario:'
                      : 'Form name:'}
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
                <div
                  {...(formLanguage && { lang: formLanguage })}
                  dangerouslySetInnerHTML={{ __html: usage }}
                />

                {formUpload ? (
                  <>
                    <h3 className="vads-u-margin-bottom--2">Download form</h3>
                    <p className="vads-u-margin-bottom--2">
                      Download this PDF form and fill it out. Then submit your
                      completed form on this page. Or you can print the form and
                      mail it to the address listed on the form.
                    </p>
                  </>
                ) : (
                  <h3 className="vads-u-margin-bottom--2">Downloadable PDF</h3>
                )}
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
                  {...(formLanguage && { lang: formLanguage })}
                  onClick={() => window.open(formUrl.uri, '_blank')}
                >
                  <va-icon
                    className="vads-u-margin-right--0p5"
                    icon="file_download"
                    size="3"
                  />
                  {getDownloadButtonText(formLanguage, formNumber)} (PDF)
                </button>
              )}
            </div>

            {formUpload && (
              <div
                aria-label="Form Upload"
                data-widget-type="form-upload"
                data-has-online-tool={toolUrl ? 'true' : 'false'}
                data-form-number={formNumber}
                role="region"
              />
            )}

            <AlertBlock {...alertBlock} />

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
                {relatedForms.map((vaForm) => (
                  <div key={vaForm.id}>
                    {vaForm.entityPath && vaForm.published ? (
                      <a href={vaForm.entityPath}>
                        <h3 className="vads-u-display--inline-block vads-u-text-decoration--underline">
                          VA Form {vaForm.formNumber}
                        </h3>
                      </a>
                    ) : (
                      <h3 className="vads-u-display--inline-block">
                        VA Form {vaForm.formNumber}
                      </h3>
                    )}
                    <p className="vads-u-margin-top--0 vads-u-font-size--h4 vads-u-font-weight--bold">
                      <dfn className="vads-u-visibility--screen-reader">
                        Form name:
                      </dfn>{' '}
                      {vaForm.formName}
                    </p>
                    {vaForm.usage && (
                      <div dangerouslySetInnerHTML={{ __html: vaForm.usage }} />
                    )}
                    {vaForm.formUrl && (
                      <div
                        id={`${vaForm.formNumber}-download-button-${vaForm.formLanguage}-parent`}
                      >
                        <button
                          className="va-button-link vads-u-display--flex vads-u-align-items--center"
                          data-widget-type="find-va-forms-pdf-download-helper"
                          data-href={vaForm.formUrl.uri}
                          data-form-number={vaForm.formNumber}
                          id={`${vaForm.formNumber}-download-button-${vaForm.formLanguage}`}
                          lang={vaForm.formLanguage ?? 'en'}
                        >
                          <va-icon
                            className="vads-u-margin-right--0p5"
                            icon="file_download"
                            size="3"
                          />
                          {getDownloadButtonText(
                            vaForm.formLanguage,
                            vaForm.formNumber
                          )}{' '}
                          (PDF)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            <div className="va-nav-linkslist va-nav-linkslist--related">
              {linkTeasers?.length > 0 ? (
                <ListOfLinkTeasers
                  id="helpful-links-related"
                  title={`Helpful links related to VA Form ${formNumber}`}
                  linkTeasers={linkTeasers}
                  isHubPage={false}
                />
              ) : (
                <ListOfLinkTeasers
                  id="helpful-links"
                  title="Helpful links"
                  linkTeasers={defaultHelpfulLinks}
                  isHubPage={false}
                />
              )}
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}
