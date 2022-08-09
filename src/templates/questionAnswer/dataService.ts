import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { generalEntityDataService } from 'data/delegators/generalEntityDataService'
import { EntityMetaInfo } from 'data/delegators/entityMetaProvider'
import { NodeQA, NodeResourceType } from '@/types/node'
import { QuestionAnswer } from 'templates/questionAnswer'

export const questionAnswerDataService = function (entity: NodeQA) {
  const resources = {
    title: entity.title,
    answers: entity.field_answer?.field_wysiwyg?.processed,
    tags: generalEntityDataService(entity.field_tags),
    buttons: generalEntityDataService(entity.field_buttons),
    teasers: generalEntityDataService(entity.field_related_information),
    // contact: entity.field_contact_information, component is available to frontend
    //  alert: entity.field_alert_single, || component is available to frontend
    //  benefits: entity.field_related_benefit_hubs, || component is available to frontend
  }

  return {
    ...resources,
  }
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams()
  .addInclude([
    'field_answer',
    'field_buttons',
    'field_related_benefit_hubs',
    'field_related_information',
    'field_tags.field_topics',
    'field_tags.field_audience_beneficiares',
    'field_tags.field_non_beneficiares',
    // 'field_administration',
    // 'field_alert_single',
    // 'field_contact_information',
    // 'field_other_categories',
    // 'field_primary_category'
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
