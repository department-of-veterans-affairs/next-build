import { ServiceAddress } from './ServiceAddress'
import { PhoneNumber } from '@/components/phoneNumber/template'
import { PhoneNumber as PhoneNumberType } from '@/components/phoneNumber/formatted-type'
import { Hours } from '@/components/hours/template'
import { VamcFacilityServiceLocation } from '@/components/vamcFacility/formatted-type'

export const ServiceLocation = ({
  fieldReferralRequired,
  mentalHealthPhoneNumber,
  mainPhoneString,
  isMentalHealthService,
  location,
  serviceDescription,
  serviceHeader,
  isVba = false,
}: {
  fieldReferralRequired?: string
  mentalHealthPhoneNumber?: PhoneNumberType
  mainPhoneString?: string
  isMentalHealthService?: boolean
  location: VamcFacilityServiceLocation
  intoTextType?: string
  introTextCustom?: string
  serviceDescription?: string
  serviceHeader?: string
  isVba?: boolean
}) => {
  // Determine service main phone
  // Determine main phone number
  const mainPhone =
    isMentalHealthService && mentalHealthPhoneNumber
      ? mentalHealthPhoneNumber
      : mainPhoneString
        ? ({
            number: mainPhoneString,
            extension: '',
            phoneType: 'tel',
          } as PhoneNumberType)
        : null

  const showMainNumberForAppointments =
    mainPhone && location.fieldUseFacilityPhoneNumber
  const hasAppointmentPhoneNumbers =
    (location.appointmentPhoneNumbers?.length || 0) > 0
  const hasOtherContactPhoneNumbers =
    (location.contactInfoPhoneNumbers?.length ?? 0) > 0

  const hasOfficeVisits =
    location.fieldOfficeVisits &&
    location.fieldOfficeVisits !== 'no' &&
    location.fieldOfficeVisits !== 'null'
  const hasVirtualSupport =
    location.fieldVirtualSupport &&
    location.fieldVirtualSupport !== 'no' &&
    location.fieldVirtualSupport !== 'null'
  const showOnlineScheduleLink = location.fieldOnlineSchedulingAvail === 'yes'

  const showReferralRequirement =
    fieldReferralRequired &&
    !['not_applicable', 'unknown', '2'].includes(fieldReferralRequired)
  function VariableHeading({
    testId,
    className,
    children,
  }: {
    testId?: string
    className?: string
    children: React.ReactNode
  }) {
    if (serviceHeader) {
      return (
        <h5 data-testid={testId} className={className}>
          {children}
        </h5>
      )
    }
    return (
      <h4 data-testid={testId} className={className}>
        {children}
      </h4>
    )
  }
  return (
    <va-card class="vads-u-margin-y--2 break-word-wrap">
      {serviceHeader && <h4 className="vads-u-margin-y--0">{serviceHeader}</h4>}
      {serviceDescription && (
        <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
          {serviceDescription}
        </p>
      )}
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
              }[location.fieldOfficeVisits as string] || ''}
            </p>
          )}
          {hasVirtualSupport && (
            <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
              <va-icon
                class="vads-u-margin-right--0p5"
                icon={
                  location.fieldVirtualSupport === 'yes_veterans_can_call'
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
              }[location.fieldVirtualSupport as string] || ''}
            </p>
          )}
          {showReferralRequirement && (
            <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
              <va-icon
                class="vads-u-margin-right--0p5"
                icon={fieldReferralRequired === '1' ? 'check_circle' : 'cancel'}
                size="3"
                data-testid="referral-icon"
              ></va-icon>{' '}
              {fieldReferralRequired === '1'
                ? 'A referral is required'
                : 'A referral is not required'}
            </p>
          )}
        </div>
      )}

      {/* Appointments header */}
      {(location.fieldApptIntroTextType !== 'remove_text' ||
        hasAppointmentPhoneNumbers ||
        showMainNumberForAppointments ||
        showOnlineScheduleLink) && (
        <VariableHeading
          className="vads-u-margin-top--2 vads-u-line-height--1"
          testId="service-location-appoinments-header"
        >
          Appointments
        </VariableHeading>
      )}

      {/* Appointment intro text */}
      {location.fieldApptIntroTextType &&
        location.fieldApptIntroTextType !== 'remove_text' && (
          <div>
            {location.fieldApptIntroTextType === 'customize_text' ? (
              <p
                data-testid="service-location-custom-text"
                className="vads-u-margin-bottom--0"
                dangerouslySetInnerHTML={{
                  __html: location.fieldApptIntroTextCustom,
                }}
              />
            ) : (
              <p
                data-testid="service-location-default-text"
                className="vads-u-margin-bottom--0"
              >
                Contact us to schedule, reschedule, or cancel your appointment.
                {!isVba && (
                  <>
                    {' '}
                    If a referral is required, you’ll need to contact your
                    primary care provider first.
                  </>
                )}
              </p>
            )}
          </div>
        )}

      {/* Main phone number */}
      {showMainNumberForAppointments && (
        <div data-testid="service-location-main-facility-phone">
          <PhoneNumber
            treatment={serviceHeader ? 'h5' : 'h4'}
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
          {location.appointmentPhoneNumbers?.map((num, idx) => (
            <PhoneNumber
              key={idx}
              treatment={serviceHeader ? 'h5' : 'h4'}
              {...num}
            />
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
            href={
              isVba
                ? 'https://va.my.site.com/VAVERA/s/'
                : '/health-care/schedule-view-va-appointments'
            }
            text="Schedule an appointment online"
            type="secondary"
          ></va-link-action>
        </div>
      )}

      {/* Service location address */}
      {location.fieldServiceLocationAddress && (
        <ServiceAddress
          useH5={serviceHeader && serviceHeader.length > 0}
          serviceLocationAddress={location.fieldServiceLocationAddress}
        />
      )}

      {/* Main facility phone for contact */}

      {location.fieldUseMainFacilityPhone && mainPhone && (
        <div data-testid="service-location-main-facility-phone-for-contact">
          <PhoneNumber
            treatment={serviceHeader ? 'h5' : 'h4'}
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
          {location.contactInfoPhoneNumbers?.map((num, idx) => (
            <PhoneNumber
              treatment={serviceHeader ? 'h5' : 'h4'}
              key={idx}
              {...num}
            />
          ))}
        </div>
      )}

      {/* Email contacts */}
      {location.fieldEmailContacts?.map((email, i) => (
        <div key={i} data-testid="service-location-email-contact">
          {email.label && <VariableHeading>{email.label}</VariableHeading>}
          <va-link
            href={`mailto:${email.address}`}
            text={email.address}
            data-testid={`service-location-email-contact-${i}`}
          />
        </div>
      ))}

      {/* Service hours */}
      {location.fieldHours === '2' && location.fieldOfficeHours && (
        <>
          <VariableHeading testId="service-location-field-hours">
            Service Hours
          </VariableHeading>
          <div>
            <Hours allHours={location.fieldOfficeHours} />
          </div>
        </>
      )}
      {location.fieldHours === '0' && (
        <>
          <VariableHeading testId="service-location-field-hours">
            Service Hours
          </VariableHeading>
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

      {location.fieldAdditionalHoursInfo && (
        <p className="vads-u-margin-bottom--0">
          {location.fieldAdditionalHoursInfo}
        </p>
      )}
    </va-card>
  )
}
