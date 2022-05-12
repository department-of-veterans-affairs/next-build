import { DrupalTaxonomyTerm } from 'next-drupal'

export interface TaxonomyTermAudienceBeneficiaries extends DrupalTaxonomyTerm {
  field_audience_rs_homepage: boolean
}

export interface TaxonomyTermAudienceNonBeneficiaries
  extends DrupalTaxonomyTerm {
  field_audience_rs_homepage: boolean
}

// Allow this for consistency, even though no fields are present.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TaxonomyTermTopics extends DrupalTaxonomyTerm {}

// Allow this for consistency, even though no fields are present.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TaxonomyTermLcCategories extends DrupalTaxonomyTerm {}
