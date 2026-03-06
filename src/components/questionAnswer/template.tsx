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
import map from 'lodash/map'
import { Button } from '@/components/button/template'
import { QuestionAnswer as FormattedQuestionAnswer } from './formatted-type'
import { AudienceTopics } from '@/components/audienceTopics/template'
import { LinkTeaser } from '@/components/linkTeaser/template'
import AlertSingle from '@/components/alertSingle/template'
import { BenefitsHubLinks } from '@/components/benefitsHubLinks/template'
import { ContactInfo } from '@/components/contactInfo/template'
import { RateYourExperience } from '@/components/rateYourExperience/template'
import { ContentFooter } from '@/components/contentFooter/template'

export interface HtmlProps {
  __html: string
}

export const QuestionAnswer = ({
  title,
  answers,
  buttons,
  tags,
  teasers,
  alert,
  contactInformation,
  benefitsHubLinks,
  lastUpdated,
}: FormattedQuestionAnswer) => {
  const tag = tags ? <AudienceTopics {...tags} /> : null

  const button = map(buttons ?? [], (data) =>
    data ? <Button key={data.id} {...data} /> : null
  )
  const teaser = map(teasers ?? [], (data) =>
    data ? <LinkTeaser key={data.id} {...data} /> : null
  )
  const createAnswersMarkup = (): HtmlProps => ({
    __html: answers ?? '',
  })

  return (
    <div className="interior" data-template="node-q_a">
      <main className="va-l-detail-page">
        <div className="vads-grid-container">
          <article className="usa-content vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0">
            <h1>{title ?? ''}</h1>
            {answers && <div dangerouslySetInnerHTML={createAnswersMarkup()} />}
            {alert && <AlertSingle {...alert} />}
            {buttons && buttons.length > 0 && (
              <ul className="vads-u-margin-top--3 vads-u-margin-bottom--3 usa-unstyled-list">
                {button}
              </ul>
            )}
          </article>

          <RateYourExperience />

          {(teasers ?? []).length > 0 && (
            <>
              <h2 className="vads-u-margin-y--3 vads-u-font-size--h3">
                Related information
              </h2>
              <ul className="usa-unstyled-list">{teaser}</ul>
            </>
          )}

          {benefitsHubLinks && benefitsHubLinks.length > 0 && (
            <BenefitsHubLinks title="VA benefits" links={benefitsHubLinks} />
          )}
        </div>

        {tag}

        {contactInformation && (
          <div className="vads-grid-container">
            <ContactInfo {...contactInformation} />
          </div>
        )}

        <div className="vads-grid-container">
          <va-back-to-top></va-back-to-top>
          <ContentFooter lastUpdated={lastUpdated} />
        </div>
      </main>
    </div>
  )
}
