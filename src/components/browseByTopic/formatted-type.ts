import { AudienceTopic } from '@/components/audienceTopics/formatted-type'

/**
 * Props for the BrowseByTopic component.
 * Matches content-build tags.drupal.liquid: tags from field_audience_beneficiares
 * (via field_tags paragraph), categories from field_other_categories.
 */
export type BrowseByTopicData = {
  tags: AudienceTopic[]
  categories: AudienceTopic[]
}
