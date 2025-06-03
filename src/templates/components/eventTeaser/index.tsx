import { truncateWordsOrChar } from '@/lib/utils/helpers'
import { EventWidgetTeaser } from '@/products/event/formatted-type'
import { formatDateObject, deriveMostRecentDate, formatEventDateTime } from '@/lib/utils/date'
import { ComponentType } from 'react'

interface EventTeaserProps extends EventWidgetTeaser {
  headingLevel?: ComponentType | keyof JSX.IntrinsicElements
}

/** Teaser event. */
export const EventTeaser = ({
  headingLevel,
  title,
  entityUrl,
  fieldDescription,
  fieldDatetimeRangeTimezone,
  fieldFacilityLocation,
  fieldLocationHumanreadable,
}: EventTeaserProps) => {
  const TitleTag = ({ children, className }) => {
    const Heading = headingLevel ? headingLevel : 'h2'
    return <Heading className={className}>{children}</Heading>
  }

  // Use existing date utilities following the same pattern as the event template
  const formattedDates = fieldDatetimeRangeTimezone ? formatDateObject([fieldDatetimeRangeTimezone]) : []
  const mostRecentDate = formattedDates.length > 0 ? deriveMostRecentDate(formattedDates) : null
  const formattedDateTime = formatEventDateTime(mostRecentDate)

  // Parse the formatted date/time to extract components for display logic
  const hasDateTime = mostRecentDate && formattedDateTime && formattedDateTime !== 'No event data'
  
  // Extract timezone from the formatted string
  const timezone = mostRecentDate?.timezone ? 
    new Intl.DateTimeFormat('en-US', { 
      timeZone: mostRecentDate.timezone, 
      timeZoneName: 'short' 
    })
      .formatToParts(new Date())
      .find(part => part.type === 'timeZoneName')
      ?.value.replace(/S|D/i, '') || 'ET' 
    : 'ET'

  // Extract date and time parts from the formatted string
  let startDateNoTime = ''
  let timeRange = ''
  
  if (hasDateTime) {
    // Format: "Thu. May 4, 2023, 12:00 pm – 2:00 pm ET"
    const parts = formattedDateTime.split(', ')
    if (parts.length >= 3) {
      startDateNoTime = `${parts[0]}, ${parts[1]}, ${parts[2].split(',')[0]}`
      const timePart = parts[2].split(', ')[1]
      if (timePart) {
        // Remove the timezone from the time part since we'll add it separately
        timeRange = timePart.replace(` ${timezone}`, '')
      }
    }
  }

  return (
    <div data-template="teasers/event" className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4">
      <TitleTag className="vads-u-margin-top--0 vad-u-margin-bottom-1 vads-u-font-size--md medium-screen:vads-u-font-size--lg">
        <va-link
          text={title}
          href={entityUrl.path}
        />
      </TitleTag>
      <p className="vads-u-margin-bottom--1p5 vads-u-margin-top--0">
        {truncateWordsOrChar(fieldDescription, 60, true)}
      </p>
      <div className="usa-grid usa-grid-full vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1">
        <div className="vads-u-margin-right--2 when-where-width">
          <strong>When</strong>
        </div>
        <div className="usa-width-five-sixths">
          {hasDateTime ? (
            <>
              <span className="event-date">{startDateNoTime}</span><br />
              <span className="event-time">{timeRange}</span>
              <span> {timezone}</span>
            </>
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
