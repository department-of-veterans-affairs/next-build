import { DrupalTaxonomyTerm } from 'next-drupal'

export interface TaxonomyTermAudienceBeneficiaries extends DrupalTaxonomyTerm {
  field_audience_rs_homepage: boolean
}

export interface TaxonomyTermAudienceNonBeneficiaries
  extends DrupalTaxonomyTerm {
  field_audience_rs_homepage: boolean
}
export interface TaxonomyTermHealthCareServiceTaxonomy
  extends Omit<DrupalTaxonomyTerm, 'description'> {
  field_vet_center_com_conditions: string
  field_commonly_treated_condition?: string
  field_health_service_api_id: string
  field_also_known_as: string
  field_vet_center_friendly_name: string
  field_vet_center_service_descrip: string
  field_vet_center_required_servic: boolean
  field_service_type_of_care: string
  field_vet_center_type_of_care: string
  field_vha_healthservice_stopcode: number

  // Override description with FieldFormattedText
  description: FieldFormattedText
}

// Allow this for consistency, even though no fields are present.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TaxonomyTermLcCategories extends DrupalTaxonomyTerm {}

// Allow this for consistency, even though no fields are present.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TaxonomyTermTopics extends DrupalTaxonomyTerm {}
