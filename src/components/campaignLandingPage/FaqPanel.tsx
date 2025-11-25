import { hashReference } from '@/lib/utils/hashReference'
import { CampaignLandingPageProps } from './template'

export const FaqPanel = ({ faq }: CampaignLandingPageProps) => {
  if (!faq.show) {
    return null
  }

  const sectionHeader = faq.reusable?.header ?? 'Frequently asked questions'

  return (
    <div
      className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0"
      data-testid="faq-panel"
    >
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
            FAQ
          </p>

          <h2 className="vads-u-margin-top--0">{sectionHeader}</h2>

          {faq.reusable?.html && (
            <div
              dangerouslySetInnerHTML={{
                __html: faq.reusable.html,
              }}
            />
          )}

          <va-accordion bordered uswds>
            {faq.faqs?.map((faqParagraph, index) => (
              <va-accordion-item
                key={index}
                bordered
                header={faqParagraph.question}
                level="3"
                data-faq-entity-id={faqParagraph.id}
                id={hashReference(faqParagraph.question, 60)}
                uswds
              >
                {faqParagraph.answers?.[0] &&
                  'html' in faqParagraph.answers[0] && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: faqParagraph.answers[0].html,
                      }}
                    />
                  )}
              </va-accordion-item>
            ))}

            {faq.reusable &&
              (faq.reusable.displayAccordion
                ? (faq.reusable?.questions ?? []).map((item) => (
                    <va-accordion-item
                      key={item.id}
                      bordered
                      className="va-accordion-item"
                      header={item.question}
                      id={hashReference(item.question, 60)}
                      level="3"
                    >
                      <div
                        id={item.id}
                        data-entity-id={item.id}
                        data-analytics-faq-section={sectionHeader}
                        data-analytics-faq-text={item.question}
                      >
                        {item.answers?.[0] && 'html' in item.answers[0] && (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.answers[0].html,
                            }}
                          />
                        )}
                      </div>
                    </va-accordion-item>
                  ))
                : (faq.reusable.questions ?? []).map((fieldQA, index) => (
                    <div key={index}>
                      <h3>{fieldQA.question}</h3>
                      {fieldQA.answers?.[0] && 'html' in fieldQA.answers[0] && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: fieldQA.answers[0].html,
                          }}
                        />
                      )}
                    </div>
                  )))}
          </va-accordion>
        </div>
      </div>

      {faq.cta && (
        <div className="vads-l-row">
          <div className="vads-u-col--12">
            <va-link-action
              className="vads-u-margin-top--1"
              href={faq.cta.url}
              type="secondary"
              text={faq.cta.label}
            />
          </div>
        </div>
      )}
    </div>
  )
}
