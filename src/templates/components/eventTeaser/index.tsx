import { truncateWordsOrChar } from '@/lib/utils/helpers'
import { EventWidgetTeaser } from '@/products/event/formatted-type'
import { deriveMostRecentDate, formatEventDateTime } from '@/lib/utils/date'

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

  const col1Class = 'vads-grid-col-2 tablet:vads-grid-col-1'
  const col2Class = 'vads-grid-col-10 tablet:vads-grid-col-11'

  return (
    <div data-template="teasers/event" className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4">
      <h3 className="vads-u-margin-top--0 vad-u-margin-bottom-1 vads-u-font-size--md medium-screen:vads-u-font-size--lg">
        <va-link
          text={title}
          href={entityUrl.path}
        />
      </h3>
      <p className="vads-u-margin-bottom--1p5 vads-u-margin-top--0">
        {truncateWordsOrChar(fieldDescription ?? "", 60, true)}
      </p>
      <div className="vads-grid-row vads-grid-gap-2 vads-u-margin-bottom--1">
        {/* I really wanted to use `vads-grid-col-auto` with a width-8 utility class, but
            the fixed width utility classes don't exist in VADS like they do in USWDS.
            I would have set the other column to `vads-grid-col-fill`. */}
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
        <div className="vads-grid-row vads-grid-gap-2">
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
