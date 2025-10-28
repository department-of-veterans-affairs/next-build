import {
  VaAccordion,
  VaAccordionItem,
  VaLinkAction,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { placeholders } from './placeholders.temp'

export const FaqPanel = () => {
  return (
    placeholders.fieldClpFaqPanel && (
      <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
              FAQ
            </p>

            {(() => {
              const sectionHeader =
                placeholders.fieldClpReusableQA &&
                placeholders.fieldClpReusableQA.entity.fieldSectionHeader
                  ? placeholders.fieldClpReusableQA.entity.fieldSectionHeader
                  : 'Frequently asked questions'

              return (
                <>
                  <h2 className="vads-u-margin-top--0">{sectionHeader}</h2>

                  {placeholders.fieldClpReusableQA &&
                    placeholders.fieldClpReusableQA.entity.fieldRichWysiwyg
                      .processed && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            placeholders.fieldClpReusableQA.entity
                              .fieldRichWysiwyg.processed,
                        }}
                      />
                    )}

                  <VaAccordion bordered uswds>
                    {placeholders.fieldClpFaqParagraphs.map(
                      (faqParagraph, index) =>
                        faqParagraph.entity && (
                          <VaAccordionItem
                            key={index}
                            bordered
                            header={faqParagraph.entity.fieldQuestion}
                            level="3"
                            data-faq-entity-id={faqParagraph.entity.entityId}
                            id={faqParagraph.entity.fieldQuestion}
                            uswds
                          >
                            {/* TODO: hashReference filter - need helper function for id */}
                            {/* TODO: include statement - render paragraph component based on entityBundle */}
                            {faqParagraph.entity.fieldAnswer &&
                              faqParagraph.entity.fieldAnswer[0] && (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      faqParagraph.entity.fieldAnswer[0].entity
                                        .processed,
                                  }}
                                />
                              )}
                          </VaAccordionItem>
                        )
                    )}

                    {placeholders.fieldClpReusableQA &&
                      (() => {
                        const questions =
                          placeholders.fieldClpReusableQA.entity.queryFieldQAs
                            .entities

                        if (
                          placeholders.fieldClpReusableQA.entity
                            .entityBundle === 'q_a_group'
                        ) {
                          if (
                            placeholders.fieldClpReusableQA.entity
                              .fieldAccordionDisplay
                          ) {
                            return questions.map((item) => {
                              const id = item.entityId
                              return (
                                <VaAccordionItem
                                  key={id}
                                  bordered
                                  className="va-accordion-item"
                                  header={item.entityLabel}
                                  id={item.entityLabel}
                                  level="3"
                                >
                                  {/* TODO: hashReference filter - need helper function for id */}
                                  <div
                                    id={id}
                                    data-entity-id={id}
                                    data-analytics-faq-section={sectionHeader}
                                    data-analytics-faq-text={item.entityLabel}
                                  >
                                    <div id={`${item.entityBundle}-${id}`}>
                                      {/* TODO: include statement - render paragraph component based on entityBundle */}
                                      {item.fieldAnswer &&
                                        item.fieldAnswer.entity && (
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                item.fieldAnswer.entity
                                                  .processed,
                                            }}
                                          />
                                        )}
                                    </div>
                                  </div>
                                </VaAccordionItem>
                              )
                            })
                          } else {
                            const entity =
                              placeholders.fieldClpReusableQA.entity
                            const fieldQAs = entity.queryFieldQAs.entities

                            return fieldQAs.map((fieldQA, index) => (
                              <div key={index}>
                                <h3>{fieldQA.entityLabel}</h3>
                                {fieldQA.fieldAnswer && (
                                  <>
                                    {/* TODO: include statement - render paragraph component based on entityBundle */}
                                    {fieldQA.fieldAnswer.entity && (
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            fieldQA.fieldAnswer.entity
                                              .processed,
                                        }}
                                      />
                                    )}
                                  </>
                                )}
                              </div>
                            ))
                          }
                        }
                        return null
                      })()}
                  </VaAccordion>
                </>
              )
            })()}
          </div>
        </div>

        {placeholders.fieldClpFaqCta.entity.fieldButtonLink.url.path &&
          placeholders.fieldClpFaqCta.entity.fieldButtonLabel && (
            <div className="vads-l-row">
              <div className="vads-u-col--12">
                <VaLinkAction
                  className="vads-u-margin-top--1"
                  href={
                    placeholders.fieldClpFaqCta.entity.fieldButtonLink.url.path
                  }
                  type="secondary"
                  text={placeholders.fieldClpFaqCta.entity.fieldButtonLabel}
                />
              </div>
            </div>
          )}
      </div>
    )
  )
}
