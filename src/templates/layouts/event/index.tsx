import React, { useState } from 'react';
import { NodeEvent } from '@/types/dataTypes/drupal/node';
import { deriveMostRecentDate } from './util';
import { ContentFooter } from '@/templates/common/contentFooter';
import { SocialLinks } from '../../common/socialLinks'
import { MediaImage } from '@/templates/common/mediaImage';

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
  eventCTA,
  body,
  additionalInfo,

}) => {
  const [showRecurringEvents, setShowRecurringEvents] = useState(false);

  const toggleRecurringEvents = () => {
    setShowRecurringEvents(prevState => !prevState);
  };

  const mostRecentDate = deriveMostRecentDate(datetimeRange)

  return (
    <div className="va-l-detail-page va-facility-page">
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-three-fourths">
          <article className="usa-content">
            {/* Title */}
            <h1>{title}</h1>

            {/* Image */}
            {image && (
              <MediaImage
                className="event-detail-img"
                {...image}
              />
            )}

            {/* Description */}
            {description && (
              <p className="va-introtext">{description}</p>
            )}

            {/* When */}
            <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-bottom--1">
              <p className="vads-u-margin--0 vads-u-margin-right--0p5">
                <strong>When:</strong>
              </p>
              <div className="vads-u-display--flex vads-u-flex-direction--column">
                <p className="vads-u-margin--0">
                  {mostRecentDate.start} to {mostRecentDate.end} ({mostRecentDate.timezone})
                </p>
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
                    <a href={facilityLocation?.entity?.entityUrl?.path}>
                      {facilityLocation?.entity?.title}
                    </a>
                  </p>
                  <p className="vads-u-margin--0">{locationHumanReadable}</p>
                  {facilityLocation?.entity?.fieldAddress.addressLine1 && (
                    <p className="vads-u-margin--0">{facilityLocation?.entity?.fieldAddress?.addressLine1}</p>
                  )}
                  {facilityLocation?.entity?.fieldAddress?.addressLine2 && (
                    <p className="vads-u-margin--0">{facilityLocation?.entity?.fieldAddress?.addressLine2}</p>
                  )}
                  <p className="vads-u-margin--0">
                    {facilityLocation?.entity?.fieldAddress?.locality && (
                      <span>{facilityLocation?.entity?.fieldAddress?.locality}, </span>
                    )}
                    {facilityLocation?.entity?.fieldAddress?.administrativeArea}
                  </p>

                </div>
              ) : locationType === "online" ? (
                <p className="vads-u-margin--0 vads-u-margin-bottom--2">
                  {urlOfOnlineEvent ? (
                    <a href={urlOfOnlineEvent.uri}>This is an online event.</a>
                  ) : (
                    "This is an online event."
                  )}
                </p>
              ) : (
                <div className="vads-u-display--flex vads-u-flex-direction--column">
                  {locationHumanReadable && (
                    <p className="vads-u-margin--0">{locationHumanReadable}</p>
                  )}
                  {address && address.addressLine1 && (
                    <p className="vads-u-margin--0">{address.addressLine1}</p>
                  )}
                  {address && address.addressLine2 && (
                    <p className="vads-u-margin--0">{address.addressLine2}</p>
                  )}
                  <p className="vads-u-margin--0">
                    {address && address.locality && (
                      <span>{address.locality}, </span>
                    )}
                    {address && address.administrativeArea}
                  </p>
                  {/* Add Google Maps link logic here */}
                </div>
              )}
            </div>

            {/* Cost */}
            {cost && (
              <div>
                <strong>Cost:</strong>
                <p>{cost}</p>
              </div>
            )}

            <SocialLinks path={socialLinks.path} title={socialLinks.title} description={description} address={address} />

            {/* CTA */}
            {link && (
              <a href={link} className="vads-c-action-link--green">
                {eventCTA || 'More details'}
              </a>
            )}

            {/* Body */}
            {body.processed && (
              <div dangerouslySetInnerHTML={{ __html: body.processed }} />
            )}

            {/* Recurring Events */}
            {datetimeRange.length > 1 && (
              <>
                <button onClick={toggleRecurringEvents}>
                  View other times for this event
                </button>
                {showRecurringEvents && (
                  <div>
                    {datetimeRange.map((dateRange, index) => (
                      <p key={index}>{dateRange.start} to {dateRange.end}</p>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Additional Registration Information */}
            {additionalInfo && (
              <p>{additionalInfo}</p>
            )}
          </article>
          <ContentFooter />
        </div>
      </div>
    </div>
  );

}