import { hashReference } from '@/lib/utils/hashReference'
import { CampaignLandingPageProps } from './template'
import { QaParagraph } from '../qaParagraph/template'
import { Wysiwyg } from '../wysiwyg/template'

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

          <Wysiwyg {...faq.reusable} />

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
                <QaParagraph {...faqParagraph} currentHeadingLevel="h2" />
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
                        <QaParagraph {...item} currentHeadingLevel="h2" />
                      </div>
                    </va-accordion-item>
                  ))
                : (faq.reusable.questions ?? []).map((fieldQA, index) => (
                    <QaParagraph
                      key={fieldQA.id}
                      {...fieldQA}
                      currentHeadingLevel="h2"
                    />
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
