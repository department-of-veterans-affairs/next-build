import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { generalEntityDataService } from '@/lib/delegators/generalEntityDataService'
import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import { NodeQA, NodeResourceType } from '@/types/node'
import { QuestionAnswer } from '@/components/questionAnswer'

export const questionAnswerDataService = function (entity: NodeQA) {
  const resources = {
    title: entity.title,
    answers: entity.field_answer?.field_wysiwyg?.processed,
    alert: entity.field_alert_single,
    benefits: entity.field_related_benefit_hubs,
    tags: generalEntityDataService(entity.field_tags),
    buttons: generalEntityDataService(entity.field_buttons),
    contact: entity.field_contact_information,
    teasers: generalEntityDataService(entity.field_related_information),
  }
  return {
    ...resources,
  }
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams()
  .addInclude([
    'field_administration',
    'field_alert_single',
    'field_answer',
    'field_buttons',
    'field_contact_information',
    'field_other_categories',
    'field_primary_category',
    'field_related_benefit_hubs',
    'field_related_information',
    'field_tags.field_topics',
    'field_tags.field_audience_beneficiares',
    'field_tags.field_non_beneficiares',
  ])
  .addPageLimit(10)

/** Export information necessary to identify the component and query it.
 * See {@link EntityMetaInfo}
 */
export const Meta: EntityMetaInfo = {
  resource: NodeResourceType.QuestionAnswer,
  component: QuestionAnswer,
  dataService: questionAnswerDataService,
  params: params,
}
