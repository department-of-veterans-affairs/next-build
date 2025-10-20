import { placeholders } from '../placeholders.temp'

export const EventsPanel = () => {
  return (
    placeholders.fieldClpEventsPanel && (
      <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--9">
            <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
              Events
            </p>
            <h2 className="vads-u-margin-top--0">
              {placeholders.fieldClpEventsHeader}
            </h2>
          </div>
        </div>

        <div className="vads-l-row vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--neg6">
          {placeholders.fieldClpEventsReferences.map(
            (eventReference, index) => (
              <div
                key={index}
                className={`vads-l-col--12 medium-screen:vads-l-col--6 ${index > 0 ? 'vads-u-margin-top--4 medium-screen:vads-u-margin-top--0' : ''}`}
              >
                <div className="medium-screen:vads-u-margin-x--6">
                  <h3 className="vads-u-margin-top--0">
                    {eventReference.entity.entityUrl.path &&
                    eventReference.entity.title ? (
                      <va-link
                        href={eventReference.entity.entityUrl.path}
                        text={eventReference.entity.title}
                      ></va-link>
                    ) : (
                      eventReference.entity.title
                    )}
                  </h3>

                  <p>{eventReference.entity.fieldDescription}</p>

                  <div className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
                    <p className="vads-u-font-weight--bold vads-u-margin--0 vads-u-margin-right--2">
                      When
                    </p>
                    <p className="vads-u-margin--0">
                      {/* TODO: currentTime, deriveMostRecentDate, dateFromUnix, timezoneAbbrev filters - need helper functions */}
                    </p>
                  </div>

                  {(eventReference.entity.fieldFacilityLocation.entity.entityUrl
                    .path ||
                    eventReference.entity.fieldLocationHumanreadable ||
                    eventReference.entity.fieldLink.uri) && (
                    <div className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row vads-u-margin-top--2">
                      <p className="vads-u-font-weight--bold vads-u-margin--0 vads-u-margin-right--2">
                        Where
                      </p>

                      <div className="vads-u-display--flex vads-u-flex-direction--column">
                        {eventReference.entity.fieldFacilityLocation.entity
                          .entityUrl.path &&
                          eventReference.entity.fieldFacilityLocation.entity
                            .title && (
                            <va-link
                              href={
                                eventReference.entity.fieldFacilityLocation
                                  .entity.entityUrl.path
                              }
                              text={
                                eventReference.entity.fieldFacilityLocation
                                  .entity.title
                              }
                            />
                          )}

                        {eventReference.entity.fieldLink.uri &&
                          eventReference.entity.fieldEventCta && (
                            <>
                              {/* TODO: determineFieldLink filter - using direct URL path */}
                              {eventReference.entity.fieldLink.url.path && (
                                <va-link
                                  active
                                  href={
                                    eventReference.entity.fieldLink.url.path
                                  }
                                  text={eventReference.entity.fieldEventCta}
                                ></va-link>
                              )}
                            </>
                          )}

                        {eventReference.entity.fieldLocationHumanreadable && (
                          <>
                            {eventReference.entity.fieldUrlOfAnOnlineEvent
                              .uri ? (
                              <va-link
                                href={
                                  eventReference.entity.fieldUrlOfAnOnlineEvent
                                    .uri
                                }
                                text={
                                  eventReference.entity
                                    .fieldLocationHumanreadable
                                }
                              />
                            ) : (
                              <p className="vads-u-margin--0">
                                {
                                  eventReference.entity
                                    .fieldLocationHumanreadable
                                }
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    )
  )
}
