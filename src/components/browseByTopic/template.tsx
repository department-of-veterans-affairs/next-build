import { recordEvent } from '@/lib/analytics/recordEvent'
import { BrowseByTopicData } from './formatted-type'

/**
 * Browse by topic component - ported from content-build tags.drupal.liquid.
 * Renders an unstyled list of topic links with "Browse by topic" heading,
 * combining tags (from field_tags/field_audience_beneficiares) and categories
 * (from field_other_categories). Used on pages like Question Answer and Resources Support.
 */
export function BrowseByTopic({ tags, categories }: BrowseByTopicData) {
  const items = [...tags, ...categories]
  if (items.length === 0) return null

  return (
    <div
      className="vads-u-padding-y--3 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light"
      data-template="includes/tags"
    >
      <h2 className="vads-u-margin-y--0 vads-u-font-size--h3">
        Browse by topic
      </h2>
      <ul className="usa-unstyled-list" role="list">
        {items.map(({ id, href, name, categoryLabel }) => (
          <li key={id} className="vads-u-margin-y--2">
            <va-link
              className="vads-u-font-weight--bold"
              href={href}
              text={name}
              onClick={() =>
                recordEvent({
                  event: 'nav-page-tag-click',
                  'page-tag-click-label': name,
                  'page-tag-category-label': categoryLabel,
                })
              }
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
