import { recordEvent } from '@/lib/analytics/recordEvent'
import { AudienceTopics as FormattedAudienceTopics } from '@/components/audienceTopics/formatted-type'

/**
 * Browse by topic component - ported from content-build tags.drupal.liquid.
 * Renders an unstyled list of topic links with "Browse by topic" heading,
 * used on pages like Question Answer and Resources Support.
 */
export function BrowseByTopic({ tags }: FormattedAudienceTopics) {
  return (
    <div
      className="vads-u-padding-y--3 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light"
      data-template="includes/tags"
    >
      <h2 className="vads-u-margin-y--0 vads-u-font-size--h3">
        Browse by topic
      </h2>
      <ul className="usa-unstyled-list" role="list">
        {tags.map(({ id, href, name, categoryLabel }) => (
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
