import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { queries } from '@/lib/drupal/queries'
import { NodeVetCenterOutstation } from '@/types/drupal/node'
import { VetCenterOutstation as FormattedVetCenterOutstation } from './formatted-type'
import {
  PARAGRAPH_RESOURCE_TYPES,
  RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { fetchSingleEntityOrPreview } from '@/lib/drupal/query'
import { getNestedIncludes } from '@/lib/utils/queries'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'
import { getHtmlFromDrupalContent } from '@/lib/utils/getHtmlFromDrupalContent'
import { QaSection as FormattedQaSection } from '@/components/qaSection/formatted-type'
import { FeaturedContent } from '@/components/featuredContent/formatted-type'
import { Button } from '@/components/button/formatted-type'
import { Wysiwyg } from '@/components/wysiwyg/formatted-type'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes('field_media', 'media--image'),
    'field_administration',
    'field_prepare_for_visit',
    ...getNestedIncludes(
      'field_vet_center_feature_content',
      PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT
    ),
    ...getNestedIncludes(
      'field_health_services',
      RESOURCE_TYPES.VET_CENTER_HEALTH_SERVICES
    ),
  ])
}

// Define the option types for the data loader.
export type VetCenterOutstationDataOpts = {
  id: string
  context?: ExpandedStaticPropsContext
}

// Implement the data loader.
export const data: QueryData<
  VetCenterOutstationDataOpts,
  NodeVetCenterOutstation
> = async (opts): Promise<NodeVetCenterOutstation> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.VET_CENTER_OUTSTATION,
    params
  )) as NodeVetCenterOutstation
  return entity
}

const buildFeaturedContentArray = (
  ccFeaturedContent,
  vetCenterFeatureContentArray
): FeaturedContent[] | null => {
  if (
    !ccFeaturedContent?.fetched &&
    (!vetCenterFeatureContentArray || vetCenterFeatureContentArray.length === 0)
  ) {
    return null
  }

  const formattedLocalContent = (vetCenterFeatureContentArray || []).map(
    (item) =>
      queries.formatData(PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT, item)
  )

  if (!ccFeaturedContent?.fetched) {
    return formattedLocalContent.length > 0 ? formattedLocalContent : null
  }

  const { field_description, field_section_header, field_cta } =
    ccFeaturedContent.fetched

  const featuredContentObject = {
    field_description: field_description[0],
    field_section_header: field_section_header[0].value,
    type: PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT as FeaturedContent['type'],
    id: ccFeaturedContent.target_id || '',
    field_cta: {
      id: field_cta[0].target_id || null,
      field_button_label: field_cta[0].field_button_label[0].value || null,
      field_button_link: field_cta[0].field_button_link[0] || null,
      type: PARAGRAPH_RESOURCE_TYPES.BUTTON as Button['type'],
      drupal_internal__id: field_cta[0].target_id,
    },
  }

  const combinedArray = [featuredContentObject, ...formattedLocalContent]
  return combinedArray.map((item) =>
    queries.formatData(PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT, item)
  )
}

const buildFaqs = (faqs): FormattedQaSection | null => {
  if (!faqs?.fetched) return null

  const buildQuestionArray = (questions) => {
    if (!questions) return []
    return questions.map((question) => ({
      id: question.target_id || null,
      question: question.field_question[0]?.value || null,
      answers: [
        {
          html: question.field_answer[0]?.field_wysiwyg[0]?.value || null,
        },
      ],
      header: question.label || null,
    }))
  }

  return {
    type: PARAGRAPH_RESOURCE_TYPES.QA_SECTION as FormattedQaSection['type'],
    id: faqs.target_id,
    header: faqs.fetched.field_section_header[0]?.value || null,
    intro: faqs.fetched.field_section_intro[0]?.value || null,
    displayAccordion:
      Boolean(faqs.fetched.field_accordion_display[0]?.value) || false,
    questions: buildQuestionArray(faqs.fetched.field_questions),
  }
}

const buildCCWysiwyg = (ccField, entityId: string): Wysiwyg | null => {
  if (!ccField?.fetched?.field_wysiwyg?.[0]?.processed) return null
  return {
    type: PARAGRAPH_RESOURCE_TYPES.WYSIWYG as Wysiwyg['type'],
    id: entityId,
    html: ccField.fetched.field_wysiwyg[0].processed,
  }
}

export const formatter: QueryFormatter<
  NodeVetCenterOutstation,
  FormattedVetCenterOutstation
> = (entity: NodeVetCenterOutstation) => {
  const healthServicesArray = queries.formatData(
    RESOURCE_TYPES.VET_CENTER_HEALTH_SERVICES,
    entity.field_health_services ?? []
  )
  const counselingServicesArray = healthServicesArray.filter(
    (h) => h?.vetCenterTypeOfCare === 'counseling'
  )
  const referralServicesArray = healthServicesArray.filter(
    (h) => h?.vetCenterTypeOfCare === 'referral'
  )
  const otherServicesArray = healthServicesArray.filter(
    (h) =>
      h?.vetCenterTypeOfCare !== 'counseling' &&
      h?.vetCenterTypeOfCare !== 'referral'
  )

  const outstationPath = entity.path?.alias ?? ''

  const prepareForVisitItems = entity.field_prepare_for_visit?.map((item) =>
    queries.formatData(PARAGRAPH_RESOURCE_TYPES.ACCORDION_ITEM, item)
  )

  return {
    ...entityBaseFields(entity),
    address: entity.field_address,
    geolocation: entity.field_geolocation,
    introText: entity.field_intro_text ?? null,
    lastSavedByAnEditor: entity.field_last_saved_by_an_editor ?? null,
    officeHours: entity.field_office_hours ?? null,
    officialName: entity.field_official_name ?? null,
    operatingStatusFacility: entity.field_operating_status_facility ?? null,
    operatingStatusMoreInfo: entity.field_operating_status_more_info
      ? getHtmlFromDrupalContent(entity.field_operating_status_more_info, {
          convertNewlines: true,
        })
      : null,
    phoneNumber: entity.field_phone_number ?? '',
    timezone: entity.field_timezone ?? null,
    administration: entity.field_administration ?? null,

    healthServices: healthServicesArray,
    counselingHealthServices: counselingServicesArray,
    referralHealthServices: referralServicesArray,
    otherHealthServices: otherServicesArray,
    image: entity.field_media
      ? queries.formatData('media--image', entity.field_media)
      : null,
    fieldFacilityLocatorApiId: entity.field_facility_locator_api_id ?? '',
    path: outstationPath,

    prepareForVisit: prepareForVisitItems?.length ? prepareForVisitItems : null,
    featuredContent: buildFeaturedContentArray(
      entity.field_cc_vet_center_featured_con,
      entity.field_vet_center_feature_content
    ),
    ccNonTraditionalHours: buildCCWysiwyg(
      entity.field_cc_non_traditional_hours,
      entity.id
    ),
    ccVetCenterCallCenter: buildCCWysiwyg(
      entity.field_cc_vet_center_call_center,
      entity.id
    ),
    ccVetCenterFaqs: buildFaqs(entity.field_cc_vet_center_faqs),
  }
}
