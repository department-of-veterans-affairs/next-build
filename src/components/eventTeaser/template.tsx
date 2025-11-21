import { truncateWordsOrChar } from '@/lib/utils/helpers'
import { FeaturedEventTeaser } from '@/components/eventTeaser/formatted-type'
import { formatEventDateTime } from '@/lib/utils/date'
import clsx from 'clsx'

export type EventTeaserProps = FeaturedEventTeaser

/**
 * The other way to render a teaser is through the events widget from vets-website. This
 * one takes a specific, stripped-down FeaturedEventTeaser object from the custom
 * featured-events endpoint.
 */
export const EventTeaser = ({
  title,
  entityUrl,
  description,
  datetimeRangeTimezone,
  facilityLocation,
  locationHumanReadable,
  featured,
}: EventTeaserProps) => {
  const formattedDateTime = formatEventDateTime(datetimeRangeTimezone)

  const rowClass = 'vads-grid-row vads-grid-gap-1'
  const col1Class = 'vads-grid-col-auto'
  const col2Class = 'vads-grid-col-fill'

  return (
    <div
      data-template="teasers/event"
      data-featured={featured}
      className="vads-u-margin-bottom--3 tablet:vads-u-margin-bottom--4"
    >
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom-1 vads-u-font-size--md tablet:vads-u-font-size--lg">
        <va-link text={title} href={entityUrl} />
      </h3>
      <p className="vads-u-margin-bottom--1p5 vads-u-margin-top--0">
        {truncateWordsOrChar(description ?? '', 60, true)}
      </p>
      <div className={clsx(rowClass, 'vads-u-margin-bottom--1')}>
        <div className={col1Class}>
          <p className="vads-u-margin-y--0">
            <strong>When</strong>
          </p>
        </div>
        <div className={col2Class}>
          <p className="vads-u-margin-y--0">{formattedDateTime}</p>
        </div>
      </div>
      {facilityLocation && (
        <div className={rowClass}>
          <div className={col1Class}>
            <p className="vads-u-margin-y--0">
              <strong>Where</strong>
            </p>
          </div>
          <div className={col2Class}>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
              <va-link
                href={facilityLocation.entityUrl}
                text={facilityLocation.title}
              />
            </p>
            <p className="vads-u-margin-y--0">
              {locationHumanReadable && locationHumanReadable}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
