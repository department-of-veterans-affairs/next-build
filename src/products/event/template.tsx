import React, { useState, useEffect, useMemo } from 'react'
import {
  deriveMostRecentDate,
  formatDateObject,
  formatEventDateTime,
  isEventInPast,
  filterPastEvents,
} from '@/lib/utils/date'
import { ContentFooter } from '@/templates/common/contentFooter'
import { MediaImage } from '@/templates/common/mediaImage'
import { GoogleMapsDirections } from '@/templates/common/googleMapsDirections'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { Event as FormattedEvent } from '@/products/event/formatted-type'
import { SocialLinks } from '@/templates/common/socialLinks'
import { formatEventCTA, createMailToLink } from '@/lib/utils/events'

export const Event = ({
  title,
  image,
  description,
  datetimeRange,
  lastUpdated,
  locationHumanReadable,
  facilityLocation,
  locationType,
  urlOfOnlineEvent,
  address,
  cost,
  registrationRequired,
  socialLinks,
  administration,
  link,
  additionalInfo,
  eventCTA,
  emailCTA,
  howToSignUp,
  body,
  listing,
  listingOffice,
}: FormattedEvent) => {
  const [mostRecentDate, setMostRecentDate] = useState(null)
  const [showAllEvents, setShowAllEvents] = useState(false)

  // Memoized because formateDateObject returns a map that will be recalculated on each render.
  const formattedDates = useMemo(
    () => formatDateObject(filterPastEvents(datetimeRange)),
    [datetimeRange]
  )

  const initialFormattedDates = formattedDates.slice(0, 5)
  const [currentFormattedDates, setCurrentFormattedDates] = useState(
    initialFormattedDates
  )

  useEffect(() => {
    // Calculate the most recent date when the component mounts
    const recentDate = deriveMostRecentDate(formattedDates)
    setMostRecentDate(recentDate)
  }, [formattedDates])

  const handleAllEventsToggle = () => {
    if (showAllEvents) {
      setCurrentFormattedDates(initialFormattedDates)
    } else {
      setCurrentFormattedDates(formattedDates)
    }
    setShowAllEvents((prevState) => !prevState)
  }

  const formattedDateTime = formatEventDateTime(mostRecentDate)

  const addressObj = facilityLocation?.field_address || address
  const directionsString = [
    addressObj?.address_line1,
    addressObj?.locality,
    addressObj?.administrative_area,
  ]
    .filter(Boolean)
    .join(', ')

  let eventCTAText = null

  if (eventCTA) {
    eventCTAText = formatEventCTA(eventCTA)
  }

  return (
    <div className="va-l-detail-page va-facility-page">
      <div className="usa-grid usa-grid-full">
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1p5 desktop-lg:vads-u-padding-x--0 vads-u-padding-bottom--2">
          {/* Title */}
          <h1>{title}</h1>

          {/* Image */}
          {image && (
            <MediaImage
              className="event-detail-img vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4"
              {...image}
              imageStyle="7_2_medium_thumbnail"
              loading="eager"
            />
          )}

          {/* Description */}
          {description && (
            <p className="va-introtext vads-u-margin-top--0">{description}</p>
          )}

          {/* When */}
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1">
            <p className="vads-u-margin--0 vads-u-margin-right--0p5">
              <strong>When:</strong>
            </p>
            <div className="vads-u-display--flex vads-u-flex-direction--column">
              <p className="vads-u-margin--0">{formattedDateTime}</p>
              {formattedDates.length > 1 && (
                <p className="vads-u-margin--0">
                  <va-icon icon="autorenew" size="3" />
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
                  <va-link
                    href={facilityLocation?.path?.alias}
                    text={facilityLocation?.title}
                  ></va-link>
                </p>
                <p className="vads-u-margin--0">{locationHumanReadable}</p>
                {facilityLocation?.field_address?.address_line1 && (
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
                <p className="vads-u-margin--0">
                  <GoogleMapsDirections
                    address={directionsString}
                    location={facilityLocation?.title}
                  />
                </p>
              </div>
            ) : locationType === 'online' ? (
              <p className="vads-u-margin--0 vads-u-margin-bottom--2">
                {urlOfOnlineEvent ? (
                  <va-link
                    href={urlOfOnlineEvent.uri}
                    text="This is an online event."
                    data-test-id="online-event-link"
                  />
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
                <p className="vads-u-margin--0">
                  <GoogleMapsDirections
                    location={locationHumanReadable}
                    address={directionsString}
                  />
                </p>
              </div>
            )}
          </div>

          {/* Cost */}
          {cost && (
            <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1">
              <p className="vads-u-margin--0 vads-u-margin-right--0p5">
                <strong>Cost:</strong>
              </p>
              <p className="vads-u-margin--0">{cost}</p>
            </div>
          )}
          {/* Registration */}
          {registrationRequired && eventCTA && (
            <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--3">
              <p className="vads-u-margin--0 vads-u-margin-right--0p5">
                {eventCTA == 'register' && <strong>Registration:</strong>}
                {eventCTA == 'apply' && <strong>Application:</strong>}
                {eventCTA == 'rsvp' && <strong>RSVP:</strong>}
              </p>
              {eventCTA != 'more_details' && (
                <p className="vads-u-margin--0">Required</p>
              )}
            </div>
          )}
          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-flex--1">
            <SocialLinks
              path={socialLinks?.path}
              title={socialLinks?.title}
              description={description}
              address={directionsString}
              dateObject={mostRecentDate}
            />
          </div>
        </div>
        {/* CTA */}
        {(link || additionalInfo || eventCTA) && (
          <div className="registration vads-u-margin-top--4 vads-u-margin-bottom--1 vads-u-padding-x--1p5 medium-screen:vads-u-padding--0">
            {isEventInPast(mostRecentDate?.value) ? (
              <p className="vads-u-margin--0 vads-u-color--secondary vads-u-font-weight--bold">
                This event already happened.
              </p>
            ) : (
              <>
                {link && eventCTAText && (
                  <va-link-action
                    class="vads-u-display--block"
                    href={link?.uri}
                    text={eventCTAText}
                  />
                )}
                {howToSignUp === 'email' && (
                  <>
                    {mostRecentDate && eventCTAText && (
                      <va-link-action
                        class="vads-u-display--block"
                        href={createMailToLink(
                          emailCTA,
                          title,
                          mostRecentDate,
                          link?.uri
                        )}
                        text={eventCTAText}
                      />
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
        {body && <div dangerouslySetInnerHTML={{ __html: body?.processed }} />}

        {/* Recurring Events */}
        {currentFormattedDates.length > 1 && (
          <div>
            <va-accordion open-single id="expand-recurring-events">
              <va-accordion-item
                header="View other times for this event"
                bordered
              >
                {currentFormattedDates.map((dateRange, index) => (
                  <div
                    key={index}
                    className="recurring-event vads-u-margin-bottom--2"
                  >
                    <p className="vads-u-margin--0">
                      {formatEventDateTime(dateRange)}
                    </p>
                    <va-link
                      calendar
                      data-description={description}
                      data-end={dateRange?.endValue}
                      data-location={directionsString}
                      data-start={dateRange?.value}
                      data-subject={title}
                      href={socialLinks?.path}
                      rel="noreferrer noopener"
                      text="Add to Calendar"
                    />
                  </div>
                ))}

                {formattedDates.length > 5 && (
                  <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-justify-content--flex-end vads-u-width--full medium-screen:vads-u-width--auto">
                    {!showAllEvents && (
                      <va-button
                        id="show-all-recurring-events"
                        secondary
                        text="Show all times"
                        onClick={handleAllEventsToggle}
                      />
                    )}
                  </div>
                )}
              </va-accordion-item>
            </va-accordion>
          </div>
        )}

        {/* See more events */}
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
          Other VA events
        </h2>
        {administration?.id != 7 &&
          listingOffice != 'Outreach and events' &&
          administration?.name && (
            <p>
              <va-link
                href={listing}
                onClick={() =>
                  recordEvent({ event: 'nav-secondary-button-click' })
                }
                id="see-more-events"
                text={`Browse the ${administration.name} events calendar`}
              ></va-link>
            </p>
          )}
        <p>
          <va-link
            href="/outreach-and-events/events/"
            text="Browse the VA outreach events calendar"
          ></va-link>
        </p>
        <ContentFooter lastUpdated={lastUpdated} />
      </div>
    </div>
  )
}
