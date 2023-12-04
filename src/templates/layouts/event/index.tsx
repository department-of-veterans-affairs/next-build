import React, { useState } from 'react';
import { NodeEvent } from '@/types/dataTypes/drupal/node';

export const Event = ({
  title,
  image,
  description,
  datetimeRange,
  locationHumanReadable,
  fieldAddress,
  cost,
  fieldLink,
  fieldEventCTA,
  fieldBody,
  fieldAdditionalInfo
}) => {
  const [showRecurringEvents, setShowRecurringEvents] = useState(false);

  const toggleRecurringEvents = () => {
    setShowRecurringEvents(prevState => !prevState);
  };
  return (
    <div className="interior" id="content">
      <main className="va-l-detail-page va-facility-page">
        {/* Title */}
        <h1>{title}</h1>

        {/* Image */}
        {image && (
          <img
            alt={image.alt}
            className="event-detail-img"
            src={image.url}
          />
        )}

        {/* Description */}
        {description && (
          <p className="va-introtext">{description}</p>
        )}

        {/* Date and Time */}
        <div>
          <strong>When:</strong>
          {datetimeRange.map((dateRange, index) => (
            <p key={index}>
              {dateRange.start} to {dateRange.end} ({dateRange.timezone})
            </p>
          ))}
        </div>

        {/* Location */}
        <div>
          <strong>Where:</strong>
          {locationHumanReadable && <p>{locationHumanReadable}</p>}
          {fieldAddress && (
            <p>
              {fieldAddress.addressLine1}, {fieldAddress.locality}, {fieldAddress.administrativeArea}
            </p>
          )}
        </div>

        {/* Cost */}
        {cost && (
          <div>
            <strong>Cost:</strong>
            <p>{cost}</p>
          </div>
        )}

        {/* CTA */}
        {fieldLink && (
          <a href={fieldLink} className="vads-c-action-link--green">
            {fieldEventCTA || 'More details'}
          </a>
        )}

        {/* Body */}
        <div dangerouslySetInnerHTML={{ __html: fieldBody }} />

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
        {fieldAdditionalInfo && (
          <p>{fieldAdditionalInfo}</p>
        )}

      </main>
    </div>
  );

}