/**
 * This is the structure of an individual tag in AudienceTopics.
 */
export type AudienceTopic = {
  id: string
  href: string
  name: string
  categoryLabel: string
}

/**
 * This is for a collection of tags.
 */
export type AudienceTopics = {
  tags: AudienceTopic[]
}
