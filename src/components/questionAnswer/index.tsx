/**
 * ### Overview
 * Resource QA is a node that displays a question and answer section.
 *
 * Resources QA expects nodes of type {@link NodeQA}.
 *
 * ### View modes
 * Full page: {@link NodeQAFull}
 *
 * ### Examples
 * @see https://va.gov/resources/how-are-pension-benefits-and-disability-compensation-different
 *
 */

/** These types/packages will import into all node components. */
import { NodeQA, NodeResourceType, NodeMetaInfo } from '@/types/node'
import map from 'lodash/map'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

/** These component includes are specific to this component. */
import Container from '@/components/container'
import { Button } from '@/components/button'
import { AudienceTopics } from '@/components/audience_topics'
import { LinkTeaser } from '@/components/link_teaser'
import { BenefitsHubLinks } from '@/components/partials/benefitHubsLinks'
import { Paragraph } from '@/lib/delegators/Paragraph'

/**
 * These components expect NodeQA as their input.
 */

export interface HtmlProps {
  __html: string
}

export interface QuestionAnswerProps {
  id: number
  title: string
  answers: any
  buttons: any
  tags: any
  teasers: any
  className?: string
}

export const QuestionAnswer = ({
  title,
  answers,
  buttons,
  tags,
  teasers,
}: QuestionAnswerProps) => {
  const button = map(buttons, (data) => (data ? <Button {...data} /> : null))
  function createMarkup(): HtmlProps {
    return {
      __html: answers,
    }
  }

  return (
    <div id="content" className="interior" data-template="node-q_a">
      <main className="va-l-detail-page">
        <div className="usa-grid usa-grid-full">
          <div className="usa-width-three-fourths">
            <div className="usa-content">
              <article className="vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
                <h1>{title}</h1>
                {answers && <div dangerouslySetInnerHTML={createMarkup()} />}
                <ul className="vads-u-margin-top--3 vads-u-margin-bottom--3 usa-unstyled-list">
                  {button}
                </ul>
                <AudienceTopics {...tags} />
                <h2 className="vads-u-margin-y--3 vads-u-font-size--h3">
                  Related information
                </h2>
                <ul className="usa-unstyled-list">
                  {teasers
                    ? teasers.map((LinkTeaserProps) => (
                        <LinkTeaser
                          key={LinkTeaserProps.id}
                          {...LinkTeaserProps}
                          componentParams
                        />
                      ))
                    : null}
                </ul>
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
