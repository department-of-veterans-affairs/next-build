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
      <div className="usa-grid usa-grid-full vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1">
        <div className="vads-u-margin-right--2 when-where-width">
          <strong>When</strong>
        </div>
        <div className="usa-width-five-sixths">
          {mostRecentDate ? (
            <span>{formattedDateTime}</span>
          ) : (
            <span>Date and time to be announced</span>
          )}
        </div>
      </div>
      {fieldFacilityLocation && (
        <div className="usa-grid usa-grid-full vads-u-display--flex vads-u-flex-direction--row">
          <div className="vads-u-margin-right--2 when-where-width">
            <strong>Where</strong>
          </div>
          <div className="usa-width-five-sixths">
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
