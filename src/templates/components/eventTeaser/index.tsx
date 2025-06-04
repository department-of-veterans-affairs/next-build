import { truncateWordsOrChar } from '@/lib/utils/helpers'
import { EventWidgetTeaser } from '@/products/event/formatted-type'
import { deriveMostRecentDate, formatEventDateTime } from '@/lib/utils/date'
import clsx from 'clsx'

/** Teaser event. */
export const EventTeaser = ({
  title,
  entityUrl,
  fieldDescription,
  fieldDatetimeRangeTimezone,
  fieldFacilityLocation,
  fieldLocationHumanreadable,
}: EventWidgetTeaser) => {
  // Use the exact same pattern as the event template
  const mostRecentDate = deriveMostRecentDate(fieldDatetimeRangeTimezone)
  const formattedDateTime = formatEventDateTime(mostRecentDate)

  const rowClass = 'vads-grid-row vads-grid-gap-1'
  const col1Class = 'vads-grid-col-auto'
  const col2Class = 'vads-grid-col-fill'

  return (
    <div
      data-template="teasers/event"
      className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4"
    >
      <h3 className="vads-u-margin-top--0 vad-u-margin-bottom-1 vads-u-font-size--md medium-screen:vads-u-font-size--lg">
        <va-link text={title} href={entityUrl.path} />
      </h3>
      <p className="vads-u-margin-bottom--1p5 vads-u-margin-top--0">
        {truncateWordsOrChar(fieldDescription ?? '', 60, true)}
      </p>
      <div className={clsx(rowClass, 'vads-u-margin-bottom--1')}>
        <div className={col1Class}>
          <strong>When</strong>
        </div>
        <div className={col2Class}>
          {mostRecentDate ? (
            <span>{formattedDateTime}</span>
          ) : (
            <span>Date and time to be announced</span>
          )}
        </div>
      </div>
      {fieldFacilityLocation && (
        <div className={rowClass}>
          <div className={col1Class}>
            <strong>Where</strong>
          </div>
          <div className={col2Class}>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
              <va-link
                href={fieldFacilityLocation.entity.entityUrl.path}
                text={fieldFacilityLocation.entity.title}
              />
            </p>
            {fieldLocationHumanreadable && (
              <span>{fieldLocationHumanreadable}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
