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
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

/** These component includes are specific to this component. */
import Container from '@/components/container'
import { BenefitsHubLinks } from '@/components/partials/benefitHubsLinks'
import { Paragraph } from '@/components/paragraph'

/**
 * These components expect NodeQA as their input.
 */
type NodeQaProps = {
  node: NodeQA
}

export const ResourceWrapper = ({
  title,
  fieldAnswer,
  buttons,
  tags,
  linkTeaser,
  benefits,
}) => {
  return (
    <div id="content" className="interior" data-template="node-q_a">
      <Container className="container">
        <main className="va-l-detail-page">
          <div className="usa-grid usa-grid-full">
            <div className="usa-width-three-fourths">
              <div className="usa-content">
                {/** Add Search Widget Here */}
                <article className="vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
                  <h1>{title}</h1>
                  <div dangerouslySetInnerHTML={fieldAnswer} />
                  <ul className="vads-u-margin-top--3 vads-u-margin-bottom--3 usa-unstyled-list">
                    {buttons}
                  </ul>
                  {tags}
                  {/*Section title*/}
                  <h2 className="vads-u-margin-y--0 vads-u-font-size--h3">
                    Related information
                  </h2>
                  {/*Links*/}
                  <ul className="usa-unstyled-list">{linkTeaser}</ul>
                  {benefits}
                </article>
              </div>
            </div>
          </div>
        </main>
      </Container>
    </div>
  )
}

export const Resources = ({ node }: NodeQaProps) => {
  /** Type narrowing; if we've managed to end up here with the wrong data, return. */
  if (node?.type !== NodeResourceType.QuestionAnswer) return

  const resources = {
    benefits: <BenefitsHubLinks nodes={node?.field_related_benefit_hubs} />,
    tags: <Paragraph paragraph={node?.field_tags} />,
    teaser: node?.field_related_information.map((paragraphLinkTeaser) => (
      <Paragraph
        key={paragraphLinkTeaser?.id}
        paragraph={paragraphLinkTeaser}
        componentParams={[{ boldTitle: false }, { sectionHeader: '' }]}
      />
    )),
    buttons: node.field_buttons.map((paragraphButton) => (
      <Paragraph key={paragraphButton.id} paragraph={paragraphButton} />
    )),
  }

  return (
    <ResourceWrapper
      title={node?.title}
      tags={resources?.tags}
      benefits={resources?.benefits}
      buttons={resources?.buttons}
      fieldAnswer={{
        __html: node?.field_answer?.field_wysiwyg?.processed,
      }}
      linkTeaser={resources?.teaser}
    ></ResourceWrapper>
  )
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams().addInclude([
  'field_buttons',
  'field_related_information',
  'field_answer',
  'field_tags, field_tags.field_audience_beneficiares',
  'field_related_benefit_hubs',
  'field_contact_information',
])

/** Export information necessary to identify the component and query it.
 * See {@link NodeMetaInfo}
 */
export const Meta: NodeMetaInfo = {
  resource: NodeResourceType.QuestionAnswer,
  component: Resources,
  params: params,
}
