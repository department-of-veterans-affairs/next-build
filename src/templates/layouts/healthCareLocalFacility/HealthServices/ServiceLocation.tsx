import { ServiceAddress } from './ServiceAddress'
import { PhoneNumber } from '@/templates/common/phoneNumber'
import { PhoneNumber as PhoneNumberType } from '@/types/formatted/phoneNumber'
import { Hours } from '@/templates/components/hours'
import { VamcFacilityServiceLocation } from '@/types/formatted/healthCareLocalFacility'

export const ServiceLocation = ({
  fieldReferralRequired,
  fieldTelephone,
  fieldPhoneNumber,
  isMentalHealthService,
  single,
}: {
  fieldReferralRequired?: string
  fieldTelephone?: PhoneNumberType
  fieldPhoneNumber?: string
  isMentalHealthService?: boolean
  single: VamcFacilityServiceLocation
}) => {
  // Determine service main phone
  // Determine main phone number
  const mainPhone =
    isMentalHealthService && fieldTelephone
      ? fieldTelephone
      : fieldPhoneNumber
        ? ({
            number: fieldPhoneNumber,
            extension: '',
            phoneType: 'tel',
          } as PhoneNumberType)
        : null

  const showMainNumberForAppointments =
    mainPhone && single.fieldUseFacilityPhoneNumber
  const hasAppointmentPhoneNumbers =
    (single.fieldOtherPhoneNumbers?.length || 0) > 0
  const hasOtherContactPhoneNumbers = (single.fieldPhone?.length ?? 0) > 0

  const hasOfficeVisits =
    single.fieldOfficeVisits &&
    single.fieldOfficeVisits !== 'no' &&
    single.fieldOfficeVisits !== 'null'
  const hasVirtualSupport =
    single.fieldVirtualSupport &&
    single.fieldVirtualSupport !== 'no' &&
    single.fieldVirtualSupport !== 'null'
  const showOnlineScheduleLink = single.fieldOnlineSchedulingAvail === 'yes'

  const showReferralRequirement =
    fieldReferralRequired &&
    !['not_applicable', 'unknown', '2'].includes(fieldReferralRequired)

  return (
    <va-card class="vads-u-margin-y--2 break-word-wrap">
      {/* Office visits and virtual support */}
      {(hasOfficeVisits || hasVirtualSupport || showReferralRequirement) && (
        <div className="vads-u-padding-top--1">
          {hasOfficeVisits && (
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              <va-icon
                class="vads-u-margin-right--0p5"
                icon="location_city"
                size="3"
              ></va-icon>{' '}
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
              <va-icon
                class="vads-u-margin-right--0p5"
                icon={
                  single.fieldVirtualSupport === 'yes_veterans_can_call'
                    ? 'phone'
                    : 'calendar_today'
                }
                size="3"
              ></va-icon>{' '}
              {{
                yes_appointment_only: 'Virtual visits by appointment only',
                yes_veterans_can_call: 'Call at your convenience',
                virtual_visits_may_be_available:
                  'Virtual visits may be available',
              }[single.fieldVirtualSupport as string] || ''}
            </p>
          )}
          {showReferralRequirement && (
            <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
              <va-icon
                class="vads-u-margin-right--0p5"
                icon={fieldReferralRequired === '1' ? 'check_circle' : 'cancel'}
                size="3"
              ></va-icon>
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
                dangerouslySetInnerHTML={{
                  __html: single.fieldApptIntroTextCustom,
                }}
              />
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
      {showMainNumberForAppointments && (
        <div data-testid="service-location-main-facility-phone">
          <PhoneNumber
            treatment="h4"
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
            <PhoneNumber key={idx} treatment="h4" {...num} />
          ))}
        </div>
      )}

      {/* Online scheduling link */}
      {showOnlineScheduleLink && (
        <div
          data-testid="service-location-action-link-online"
          className="vads-u-margin-top--2 vads-u-margin-bottom--1"
        >
          <va-link-action
            class="vads-u-display--block"
            href="/health-care/schedule-view-va-appointments"
            text="Schedule an appointment online"
            type="secondary"
          ></va-link-action>
        </div>
      )}

      {/* Service location address */}
      {single.fieldServiceLocationAddress && (
        <ServiceAddress
          serviceLocationAddress={single.fieldServiceLocationAddress}
        />
      )}

      {/* Main facility phone for contact */}

      {single.fieldUseMainFacilityPhone && mainPhone && (
        <div data-testid="service-location-main-facility-phone-for-contact">
          <PhoneNumber
            treatment="h4"
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
            <PhoneNumber treatment="h4" key={idx} {...num} />
          ))}
        </div>
      )}

      {/* Email contacts */}
      {single.fieldEmailContacts?.map((email, i) => (
        <div key={i} data-testid="service-location-email-contact">
          {email.label && <h4>{email.label}</h4>}
          <a href={`mailto:${email.address}`}>{email.address}</a>
        </div>
      ))}

      {/* Service hours */}
      {single.fieldHours === '2' && single.fieldOfficeHours && (
        <>
          <h4 data-testid="service-location-field-hours">Service Hours</h4>
          <div>
            <Hours allHours={single.fieldOfficeHours} />
          </div>
        </>
      )}
      {single.fieldHours === '0' && (
        <>
          <h4 data-testid="service-location-field-hours">Service Hours</h4>
          <div>
            <p
              className="vads-u-margin-y--0"
              data-testid="service-location-field-hours-same-as-facility"
            >
              The service hours are the same as our facility hours.
            </p>
          </div>
        </>
      )}

      {single.fieldAdditionalHoursInfo && (
        <p className="vads-u-margin-bottom--0">
          {single.fieldAdditionalHoursInfo}
        </p>
      )}
    </va-card>
  )
}
