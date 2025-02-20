import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodePressRelease } from '@/types/drupal/node'
import { PressReleaseTeaser } from '@/types/formatted/pressRelease'

// Define the query params for fetching node--press_release_teaser.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['field_listing'])
}

export const formatter: QueryFormatter<NodePressRelease, PressReleaseTeaser> = (
  entity: NodePressRelease
) => {
  return {
    id: entity.id,
    type: entity.type,
    published: entity.status,
    headingLevel: 'h2', //@todo fix headingLevel,
    title: entity.title,
    link: entity.path.alias,
    introText: entity.field_intro_text,
    /*
     * Updating this to field_release_date from field_last_saved_by_an_editor
     * to maintain consistency with content-build
     * see https://github.com/department-of-veterans-affairs/next-build/pull/894/files
     */
    lastUpdated: entity.field_release_date || entity.created,
  }
}
