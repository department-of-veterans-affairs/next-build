import { ServiceLocationTemplateData } from '@/types/formatted/healthCareLocalFacility'
import { ServiceAddress } from './ServiceAddress'
import { PhoneNumber } from '@/templates/common/phoneNumber'

// TODO: Replace these with the web components
const VaIcon = ({ icon, size }: { icon: string; size: string }) => (
  <span>{icon}</span>
)
const VaLinkAction = ({ href, text }: { href: string; text: string }) => (
  <a href={href}>{text}</a>
)

export const ServiceLocation = (props: ServiceLocationTemplateData) => {
  const {
    fieldReferralRequired,
    fieldTelephone,
    fieldPhoneNumber,
    isMentalHealthService,
    single,
  } = props

  // Determine service main phone
  // Determine main phone number
  const mainPhone =
    isMentalHealthService && fieldTelephone
      ? fieldTelephone
      : fieldPhoneNumber
        ? { number: fieldPhoneNumber, extension: '', phoneType: 'tel' }
        : null

  const showMainNumberForAppointments =
    mainPhone && single.fieldUseFacilityPhoneNumber
  const hasAppointmentPhoneNumbers =
    (single.fieldOtherPhoneNumbers?.length || 0) > 0
  const hasOtherContactPhoneNumbers = (single.fieldPhone?.length || 0) > 0

  const hasOfficeVisits =
    single.fieldOfficeVisits &&
    single.fieldOfficeVisits !== 'no' &&
    single.fieldOfficeVisits !== 'null'
  const hasVirtualSupport =
    single.fieldVirtualSupport &&
    single.fieldVirtualSupport !== 'no' &&
    single.fieldVirtualSupport !== 'null'
  const showOnlineScheduleLink = single.fieldOnlineSchedulingAvail === 'yes'

  return (
    <va-card className="break-word-wrap">
      {/* Office visits and virtual support */}
      {(hasOfficeVisits ||
        hasVirtualSupport ||
        (fieldReferralRequired &&
          !['not_applicable', 'unknown', '2'].includes(
            fieldReferralRequired
          ))) && (
        <div className="vads-u-padding-top--1">
          {hasOfficeVisits && (
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              <VaIcon icon="location_city" size="3" />{' '}
              {{
                yes_appointment_only: 'Visit our office, by appointment only',
                yes_walk_in_visits_only:
                  'Visit our office, walk-in visits only',
                yes_with_or_without_appointment:
                  'Visit our office, with or without an appointment',
              }[single.fieldOfficeVisits as string] || ''}
            </p>
          )}
          {hasVirtualSupport && (
            <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
              <VaIcon
                icon={
                  single.fieldVirtualSupport === 'yes_veterans_can_call'
                    ? 'phone'
                    : 'calendar_today'
                }
                size="3"
              />{' '}
              {{
                yes_appointment_only: 'Virtual visits by appointment only',
                yes_veterans_can_call: 'Call at your convenience',
                virtual_visits_may_be_available:
                  'Virtual visits may be available',
              }[single.fieldVirtualSupport as string] || ''}
            </p>
          )}
          {fieldReferralRequired &&
            !['not_applicable', 'unknown', '2'].includes(
              fieldReferralRequired
            ) && (
              <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
                <VaIcon
                  icon={
                    fieldReferralRequired === '1' ? 'check_circle' : 'cancel'
                  }
                  size="3"
                />{' '}
                {fieldReferralRequired === '1'
                  ? 'A referral is required'
                  : 'A referral is not required'}
              </p>
            )}
        </div>
      )}

      {/* Appointments header */}
      {(single.fieldApptIntroTextType !== 'remove_text' ||
        hasAppointmentPhoneNumbers ||
        showMainNumberForAppointments ||
        showOnlineScheduleLink) && (
        <h4
          className="vads-u-margin-top--2 vads-u-line-height--1"
          data-testid="service-location-appoinments-header"
        >
          Appointments
        </h4>
      )}

      {/* Appointment intro text */}
      {single.fieldApptIntroTextType &&
        single.fieldApptIntroTextType !== 'remove_text' && (
          <div>
            {single.fieldApptIntroTextType === 'customize_text' ? (
              <p
                data-testid="service-location-custom-text"
                className="vads-u-margin-bottom--0"
              >
                {single.fieldApptIntroTextCustom}
              </p>
            ) : (
              <p
                data-testid="service-location-default-text"
                className="vads-u-margin-bottom--0"
              >
                Contact us to schedule, reschedule, or cancel your appointment.
                If a referral is required, you’ll need to contact your primary
                care provider first.
              </p>
            )}
          </div>
        )}

      {/* Main phone number */}
      {showMainNumberForAppointments && mainPhone && (
        <div data-testid="service-location-main-facility-phone">
          <PhoneNumber
            number={mainPhone.number}
            extension={mainPhone.extension}
            phoneType={mainPhone.phoneType}
            label="Main Phone"
            testId="main-phone-appointments"
          />
        </div>
      )}

      {/* Other appointment phone numbers */}
      {hasAppointmentPhoneNumbers && (
        <div data-testid="service-location-show-other-phone-numbers">
          {single.fieldOtherPhoneNumbers?.map((num, idx) => (
            <PhoneNumber key={idx} {...num} />
          ))}
        </div>
      )}

      {/* Online scheduling link */}
      {showOnlineScheduleLink && (
        <div
          data-testid="service-location-action-link-online"
          className="vads-u-margin-top--2 vads-u-margin-bottom--1"
        >
          <VaLinkAction
            href="/health-care/schedule-view-va-appointments"
            text="Schedule an appointment online"
          />
        </div>
      )}

      {/* Service location address */}
      {single.fieldServiceLocationAddress?.entity && (
        <ServiceAddress
          serviceLocationAddress={single.fieldServiceLocationAddress.entity}
        />
      )}

      {/* Main facility phone for contact */}

      {single.fieldUseMainFacilityPhone && mainPhone && (
        <div data-testid="service-location-main-facility-phone-for-contact">
          <PhoneNumber
            number={mainPhone.number}
            extension={mainPhone.extension}
            phoneType={mainPhone.phoneType}
            label="Main Phone"
            testId="main-phone-contact"
          />
        </div>
      )}

      {/* Additional contact phone numbers */}
      {hasOtherContactPhoneNumbers && (
        <div data-testid="service-location-show-contact-phone-numbers">
          {single.fieldPhone?.map((num, idx) => (
            <PhoneNumber key={idx} {...num} />
          ))}
        </div>
      )}

      {/* Email contacts */}
      {single.fieldEmailContacts?.map((email, i) => (
        <p key={i} data-testid="service-location-email-contact">
          {email.label && <h4>{email.label}</h4>}
          <a href={`mailto:${email.address}`}>{email.address}</a>
        </p>
      ))}

      {/* Service hours */}
      {single.fieldHours !== '1' && (
        <h4 data-testid="service-location-field-hours">Service Hours</h4>
      )}
      {single.fieldHours && (
        <div>
          {single.fieldHours === '2' && single.fieldOfficeHours && (
            <p>(Service-specific hours rendering here)</p>
          )}
          {single.fieldHours === '0' && (
            <p data-testid="service-location-field-hours-same-as-facility">
              The service hours are the same as our facility hours.
            </p>
          )}
        </div>
      )}

      {single.fieldAdditionalHoursInfo && (
        <p className="vads-u-margin-bottom--0">
          {single.fieldAdditionalHoursInfo}
        </p>
      )}
    </va-card>
  )
}
