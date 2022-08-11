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
import { NodeQA } from '@/types/dataTypes/drupal/node'
import map from 'lodash/map'

/** These component includes are specific to this component. */
import { Button, ButtonProps } from '@/templates/common/button'
import { AudienceTopics, AudienceTopicProp } from '@/templates/components/audience_topics'
import { LinkTeaser, LinkTeaserProps } from '@/templates/components/linkTeaser'

/**
 * These components expect NodeQA as their input.
 */

export interface HtmlProps {
  __html: string
}

export interface QuestionAnswerProps {
  id: number
  title: string
  answers: string
  buttons: ButtonProps[]
  tags: AudienceTopicProp
  teasers: LinkTeaserProps[]
  className?: string
}

export const QuestionAnswer = ({
  title,
  answers,
  buttons,
  tags,
  teasers,
}: QuestionAnswerProps) => {
  const tag = tags ? <AudienceTopics {...tags} /> : null

  const button = map(buttons, (data) =>
    data ? <Button key={data.id} {...data} /> : null
  )
  const teaser = map(teasers, (data) =>
    data ? <LinkTeaser key={data.id} {...data} /> : null
  )
  const createAnswersMarkup = (): HtmlProps => {
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
                {answers && (
                  <div dangerouslySetInnerHTML={createAnswersMarkup()} />
                )}
                <ul className="vads-u-margin-top--3 vads-u-margin-bottom--3 usa-unstyled-list">
                  {button}
                </ul>
                {tag}
                <h2 className="vads-u-margin-y--3 vads-u-font-size--h3">
                  Related information
                </h2>
                <ul className="usa-unstyled-list">{teaser}</ul>
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
