import { Event } from '../event/formatted-type'
import { CampaignLandingPageProps } from './template'
import { FieldDateTimeRange } from '@/types/drupal/field_type'
import {
  deriveMostRecentDate,
  formatDateObject,
  formatEventDateTime,
} from '@/lib/utils/date'

const EventDate = ({ dates }: { dates: FieldDateTimeRange[] }) => {
  const formattedDates = formatDateObject(dates)
  const date = deriveMostRecentDate(formattedDates)

  return formatEventDateTime(date, {
    fullEndDate: true,
    format: ({ start, end, tz }) => (
      <>
        {start} -
        <br />
        {end} {tz}
      </>
    ),
  })
}

export const EventsPanel = ({ events }: CampaignLandingPageProps) => {
  if (!events?.show) {
    return null
  }

  return (
    <div
      className="vads-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0"
      data-testid="events-panel"
    >
      <div className="vads-grid-row">
        <div className="vads-grid-col-9">
          <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
            Events
          </p>
          <h2 className="vads-u-margin-top--0">{events.header}</h2>
        </div>
      </div>

      <div className="vads-grid-row vads-u-margin-bottom--2 tablet:vads-u-margin-x--neg6">
        {events.events.map((event, index) => (
          <div
            key={event.id}
            className={`vads-grid-col-6 ${index > 0 ? 'vads-u-margin-top--4 tablet:vads-u-margin-top--0' : ''}`}
          >
            <div className="tablet:vads-u-margin-x--6">
              <h3
                className="vads-u-margin-top--0"
                aria-label={event.title}
                data-testid="event-header"
              >
                {event.title && event.urlOfOnlineEvent ? (
                  <va-link
                    data-testid="event-header-link"
                    href={
                      event.urlOfOnlineEvent.url ?? event.urlOfOnlineEvent.uri
                    }
                    text={event.title}
                  ></va-link>
                ) : (
                  event.title
                )}
              </h3>

              <p>{event.description}</p>

              <div className="vads-u-display--flex vads-u-flex-direction--column tablet:vads-u-flex-direction--row">
                <p className="vads-u-font-weight--bold vads-u-margin--0 vads-u-margin-right--2">
                  When
                </p>
                <p className="vads-u-margin--0">
                  <EventDate dates={event.datetimeRange} />
                </p>
              </div>

              {(event.facilityLocation?.path?.alias ||
                event.locationHumanReadable ||
                event.link?.url) && (
                <div
                  className="vads-u-display--flex vads-u-flex-direction--column tablet:vads-u-flex-direction--row vads-u-margin-top--2"
                  data-testid="event-location"
                >
                  <p className="vads-u-font-weight--bold vads-u-margin--0 vads-u-margin-right--2">
                    Where
                  </p>

                  <div className="vads-u-display--flex vads-u-flex-direction--column">
                    {event.facilityLocation?.path?.alias &&
                      event.facilityLocation?.title && (
                        <va-link
                          data-testid="event-location-link"
                          href={event.facilityLocation?.path?.alias}
                          text={event.facilityLocation?.title}
                        />
                      )}

                    {event.eventCTA && (
                      <va-link
                        data-testid="event-cta-link"
                        active
                        href={event.link?.url}
                        text={event.eventCTA}
                      ></va-link>
                    )}

                    {event.urlOfOnlineEvent ? (
                      <va-link
                        data-testid="event-online-link"
                        href={event.urlOfOnlineEvent.url}
                        text={event.locationHumanReadable}
                      />
                    ) : (
                      <p className="vads-u-margin--0">
                        {event.locationHumanReadable}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
