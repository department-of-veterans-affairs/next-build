import React, { useState, useEffect } from 'react'
import {
  deriveMostRecentDate,
  formatDateObject,
  deriveFormattedTimestamp,
  isEventInPast,
} from '@/lib/utils/date'
import { ContentFooter } from '@/templates/common/contentFooter'
import { MediaImage } from '@/templates/common/mediaImage'
import { GoogleMapsDirections } from '@/templates/common/googleMapsDirections'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { Event as FormattedEvent } from '@/types/formatted/event'
import { SocialLinksEvents } from '@/templates/common/socialLinksEvents'
import { formatEventCTA } from '@/lib/utils/formatEventCTA'

export const Event = ({
  title,
  image,
  description,
  datetimeRange,
  locationHumanReadable,
  facilityLocation,
  locationType,
  urlOfOnlineEvent,
  address,
  cost,
  socialLinks,
  link,
  additionalInfo,
  eventCTA,
  emailCTA,
  howToSignUp,
  body,
  listing,
}: FormattedEvent) => {
  const [showRecurringEvents, setShowRecurringEvents] = useState(false)
  const [mostRecentDate, setMostRecentDate] = useState(null)
  const [showAllEvents, setShowAllEvents] = useState(false)
  const initialFormattedDates = formatDateObject(datetimeRange).slice(0, 5)
  const [currentFormattedDates, setCurrentFormattedDates] = useState(
    initialFormattedDates
  )
  const formattedDates = formatDateObject(datetimeRange)

  useEffect(() => {
    // Calculate the most recent date when the component mounts
    const allDates = formatDateObject(datetimeRange)
    const recentDate = deriveMostRecentDate(allDates)
    setMostRecentDate(recentDate)
  }, [datetimeRange])

  const toggleRecurringEvents = () => {
    setShowRecurringEvents((prevState) => !prevState)
  }

  const handleAllEventsToggle = () => {
    if (showAllEvents) {
      setCurrentFormattedDates(initialFormattedDates)
    } else {
      setCurrentFormattedDates(formattedDates)
    }
    setShowAllEvents((prevState) => !prevState)
  }

  const formattedTimestamp = deriveFormattedTimestamp(mostRecentDate)
  const addressObj = facilityLocation?.field_address || address
  const directionsString = [
    addressObj?.address_line1,
    addressObj?.locality,
    addressObj?.administrative_area,
  ]
    .filter(Boolean)
    .join(', ')

  const createMailToLink = (emailCTA, title, mostRecentDate, linkPath) => {
    const formattedDate = deriveFormattedTimestamp(mostRecentDate)
    const subject = `RSVP for ${title} on ${formattedDate}`
    const body = `I would like to register for ${title} on ${formattedDate}. (https://va.gov${
      linkPath || ''
    })`

    return `mailto:${emailCTA}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="va-l-detail-page va-facility-page">
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-three-fourths">
          <article className="usa-content">
            {/* Title */}
            <h1>{title}</h1>

            {/* Image */}
            {image && <MediaImage className="event-detail-img" {...image} />}

            {/* Description */}
            {description && <p className="va-introtext">{description}</p>}

            {/* When */}
            <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1">
              <p className="vads-u-margin--0 vads-u-margin-right--0p5">
                <strong>When:</strong>
              </p>
              <div className="vads-u-display--flex vads-u-flex-direction--column">
                <p className="vads-u-margin--0">{formattedTimestamp}</p>
                {formattedDates.length > 1 && (
                  <p className="vads-u-margin--0">
                    <i
                      aria-hidden="true"
                      className="fa fa-sync vads-u-font-size--sm vads-u-margin-right--0p5"
                    ></i>
                    Repeats
                  </p>
                )}
              </div>
            </div>

            {/* Where */}
            <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1">
              <p className="vads-u-margin--0 vads-u-margin-right--0p5">
                <strong>Where:</strong>
              </p>

              {facilityLocation ? (
                <div className="vads-u-display--flex vads-u-flex-direction--column">
                  <p className="vads-u-margin--0">
                    <a href={facilityLocation?.path?.alias}>
                      {facilityLocation?.title}
                    </a>
                  </p>
                  <p className="vads-u-margin--0">{locationHumanReadable}</p>
                  {facilityLocation?.field_address.address_line1 && (
                    <p className="vads-u-margin--0">
                      {facilityLocation?.field_address?.address_line1}
                    </p>
                  )}
                  {facilityLocation?.field_Address?.address_Line2 && (
                    <p className="vads-u-margin--0">
                      {facilityLocation?.field_address?.address_line2}
                    </p>
                  )}
                  {facilityLocation?.field_address?.locality && (
                    <p className="vads-u-margin--0">
                      {facilityLocation?.field_address?.locality},{' '}
                      {facilityLocation.field_address?.administrative_area}
                    </p>
                  )}
                  <GoogleMapsDirections
                    title={title}
                    address={directionsString}
                  />
                </div>
              ) : locationType === 'online' ? (
                <p className="vads-u-margin--0 vads-u-margin-bottom--2">
                  {urlOfOnlineEvent ? (
                    <a href={urlOfOnlineEvent.uri}>This is an online event.</a>
                  ) : (
                    'This is an online event.'
                  )}
                </p>
              ) : (
                <div className="vads-u-display--flex vads-u-flex-direction--column">
                  {locationHumanReadable && (
                    <p className="vads-u-margin--0">{locationHumanReadable}</p>
                  )}
                  {address && address.address_line1 && (
                    <p className="vads-u-margin--0">{address.address_line1}</p>
                  )}
                  {address && address.address_line2 && (
                    <p className="vads-u-margin--0">{address.address_line2}</p>
                  )}
                  <p className="vads-u-margin--0">
                    {address && address.locality && (
                      <span>{address.locality}, </span>
                    )}
                    {address && address.administrative_area}
                  </p>
                  <GoogleMapsDirections
                    title={title}
                    address={directionsString}
                  />
                </div>
              )}
            </div>

            {/* Cost */}
            {cost && (
              <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--2">
                <p className="vads-u-margin--0 vads-u-margin-right--0p5">
                  <strong>Cost:</strong>
                </p>
                <p className="vads-u-margin--0">{cost}</p>
              </div>
            )}

            <SocialLinksEvents
              path={socialLinks?.path}
              title={socialLinks?.title}
              description={description}
              address={directionsString}
              dateObject={mostRecentDate}
            />

            {/* CTA */}
            {(link || additionalInfo || eventCTA) && (
              <div className="registration vads-u-margin-top--4 vads-u-margin-bottom--1">
                {isEventInPast(mostRecentDate?.value) ? (
                  <p className="vads-u-margin--0 vads-u-color--secondary vads-u-font-weight--bold">
                    This event already happened.
                  </p>
                ) : (
                  <>
                    {link && (
                      <p className="vads-u-margin--0">
                        <a
                          className="vads-c-action-link--green"
                          href={link?.url?.path}
                        >
                          {eventCTA || 'More details'}
                        </a>
                      </p>
                    )}
                    {howToSignUp === 'email' && (
                      <>
                        {mostRecentDate && (
                          <p className="vads-u-margin--0">
                            <a
                              className="vads-c-action-link--green"
                              href={createMailToLink(
                                emailCTA,
                                title,
                                mostRecentDate,
                                link?.url?.path
                              )}
                            >
                              {eventCTA && formatEventCTA(eventCTA)}
                            </a>
                          </p>
                        )}
                      </>
                    )}
                    {additionalInfo && (
                      <div
                        className="vads-u-margin--0"
                        dangerouslySetInnerHTML={{
                          __html: additionalInfo?.processed,
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {/* Body */}
            {body && (
              <div dangerouslySetInnerHTML={{ __html: body?.processed }} />
            )}

            {/* Recurring Events */}
            {formattedDates.length > 1 && (
              <div className="vads-u-margin-bottom--2">
                <button
                  className="vads-u-background-color--gray-lightest vads-u-color--primary-darkest vads-u-font-weight--bold vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between vads-u-height--full vads-u-padding--2 vads-u-margin--0 vads-u-margin-top--1"
                  onClick={toggleRecurringEvents}
                >
                  View other times for this event
                  <i
                    aria-hidden="true"
                    className={`fa ${
                      showRecurringEvents ? 'fa-minus' : 'fa-plus'
                    }`}
                    id="expand-recurring-events-icon"
                  ></i>
                </button>
                {showRecurringEvents && (
                  <div
                    className="vads-u-flex-direction--column vads-u-background-color--white vads-u-border--2px vads-u-border-color--gray-lightest vads-u-padding--2"
                    id="recurring-events"
                  >
                    {currentFormattedDates.map((dateRange, index) => (
                      <div key={index} className="vads-u-margin-bottom--2">
                        <p className="vads-u-margin--0">
                          {deriveFormattedTimestamp(dateRange)}
                        </p>
                        <a
                          className="recurring-event"
                          data-description={description}
                          data-end={dateRange?.endValue}
                          data-location={directionsString}
                          data-start={dateRange?.value}
                          data-subject={title}
                          href={socialLinks?.path}
                          rel="noreferrer noopener"
                        >
                          <i
                            aria-hidden="true"
                            className="va-c-social-icon fas fa-calendar-check vads-u-margin-right--0p5"
                            role="presentation"
                          ></i>
                          Add to Calendar
                        </a>
                      </div>
                    ))}
                    {formattedDates.length > 5 && (
                      <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-justify-content--flex-end vads-u-width--full medium-screen:vads-u-width--auto">
                        <button
                          className="usa-button-secondary vads-u-width--full medium-screen:vads-u-width--auto"
                          id="show-all-recurring-events"
                          type="button"
                          onClick={handleAllEventsToggle}
                        >
                          {showAllEvents
                            ? 'Show fewer times'
                            : 'Show all times'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* See more events */}
            <a
              className="vads-u-padding-bottom--3 vads-u-margin-top--1 vads-u-font-weight--bold"
              href={listing}
              onClick={() =>
                recordEvent({ event: 'nav-secondary-button-click' })
              }
            >
              See more events
              <i
                aria-hidden="true"
                className="vads-u-font-size--sm vads-u-margin-left--1 fa fa-chevron-right"
                role="presentation"
              ></i>
            </a>
          </article>
          <ContentFooter />
        </div>
      </div>
    </div>
  )
}
