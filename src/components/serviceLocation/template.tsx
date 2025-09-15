import { ServiceAddress } from './ServiceAddress'
import { PhoneNumber } from '@/components/phoneNumber/template'
import { PhoneNumber as PhoneNumberType } from '@/components/phoneNumber/formatted-type'
import { Hours } from '@/components/hours/template'
import { ServiceLocation as FormattedServiceLocation } from './formatted-type'

type HeadingTagString = 'h2' | 'h3' | 'h4' | 'h5'
type SubheadingTagString = 'h3' | 'h4' | 'h5' | 'h6'

export enum ServiceLocationType {
  NON_CLINICAL = 'nonclinical',
  VBA = 'vba',
}

export interface ServiceLocationProps {
  fieldReferralRequired?: string
  mentalHealthPhoneNumber?: PhoneNumberType
  mainPhoneString?: string
  isMentalHealthService?: boolean
  location: FormattedServiceLocation
  locationType?: ServiceLocationType
  intoTextType?: string
  introTextCustom?: string
  serviceDescription?: string
  serviceHeader?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5
}

export const ServiceLocation = ({
  fieldReferralRequired,
  mentalHealthPhoneNumber,
  mainPhoneString,
  isMentalHealthService,
  location,
  locationType,
  serviceDescription,
  serviceHeader,
  headingLevel = 4,
}: ServiceLocationProps) => {
  const subHeadingLevel = serviceHeader ? headingLevel + 1 : headingLevel
  const ServiceHeaderTag = `h${headingLevel}` as HeadingTagString
  const SubHeadingTag = `h${subHeadingLevel}` as SubheadingTagString

  const showIntroText =
    Boolean(location.apptIntroTextType || location.apptIntroTextCustom) &&
    location.apptIntroTextType !== 'remove_text'

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
    mainPhone && location.useFacilityPhoneNumber
  const hasAppointmentPhoneNumbers =
    (location.appointmentPhoneNumbers?.length || 0) > 0
  const hasOtherContactPhoneNumbers =
    (location.contactInfoPhoneNumbers?.length ?? 0) > 0

  const hasOfficeVisits =
    location.officeVisits &&
    location.officeVisits !== 'no' &&
    location.officeVisits !== 'null'
  const hasVirtualSupport =
    location.virtualSupport &&
    location.virtualSupport !== 'no' &&
    location.virtualSupport !== 'null'
  const showOnlineScheduleLink = location.onlineSchedulingAvail === 'yes'

  const showReferralRequirement =
    fieldReferralRequired &&
    !['not_applicable', 'unknown', '2'].includes(fieldReferralRequired)

  let appointmentIntroContent
  if (
    location.apptIntroTextType &&
    location.apptIntroTextType !== 'remove_text'
  ) {
    if (
      location.apptIntroTextType === 'customize_text' &&
      location.apptIntroTextCustom
    ) {
      appointmentIntroContent = (
        <p
          data-testid="service-location-custom-text"
          className="vads-u-margin-bottom--0"
          dangerouslySetInnerHTML={{
            __html: location.apptIntroTextCustom,
          }}
        />
      )
    } else {
      appointmentIntroContent = (
        <p
          data-testid="service-location-default-text"
          className="vads-u-margin-bottom--0"
        >
          Contact us to schedule, reschedule, or cancel your appointment.
          {locationType !== ServiceLocationType.VBA && (
            <>
              {' '}
              If a referral is required, you’ll need to contact your primary
              care provider first.
            </>
          )}
        </p>
      )
    }
  }
  const showAppointmentsHeader = Boolean(
    appointmentIntroContent ||
      hasAppointmentPhoneNumbers ||
      showMainNumberForAppointments ||
      showOnlineScheduleLink
  )

  const content = (
    <>
      {serviceHeader && (
        <ServiceHeaderTag className="vads-u-margin-y--0">
          {serviceHeader}
        </ServiceHeaderTag>
      )}
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
              }[location.officeVisits as string] || ''}
            </p>
          )}
          {hasVirtualSupport && (
            <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
              <va-icon
                class="vads-u-margin-right--0p5"
                icon={
                  location.virtualSupport === 'yes_veterans_can_call'
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
              }[location.virtualSupport as string] || ''}
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
      {showAppointmentsHeader && (
        <SubHeadingTag
          className="vads-u-margin-top--2 vads-u-line-height--1"
          data-testid="service-location-appoinments-header"
        >
          Appointments
        </SubHeadingTag>
      )}

      {/* Appointment intro text */}
      {appointmentIntroContent && <div>{appointmentIntroContent}</div>}

      {/* Main phone number */}
      {showMainNumberForAppointments && (
        <div data-testid="service-location-main-facility-phone">
          <PhoneNumber
            treatment={SubHeadingTag}
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
            <PhoneNumber key={idx} treatment={SubHeadingTag} {...num} />
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
              locationType === ServiceLocationType.VBA
                ? 'https://va.my.site.com/VAVERA/s/'
                : '/health-care/schedule-view-va-appointments'
            }
            text="Schedule an appointment online"
            type="secondary"
          ></va-link-action>
        </div>
      )}

      {/* Service location address */}
      {location.serviceLocationAddress && (
        <ServiceAddress
          useH5={serviceHeader && serviceHeader.length > 0}
          serviceLocationAddress={location.serviceLocationAddress}
        />
      )}

      {/* Main facility phone for contact */}

      {location.useMainFacilityPhone && mainPhone && (
        <div data-testid="service-location-main-facility-phone-for-contact">
          <PhoneNumber
            treatment={SubHeadingTag}
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
            <PhoneNumber treatment={SubHeadingTag} key={idx} {...num} />
          ))}
        </div>
      )}

      {/* Email contacts */}
      {location.emailContacts?.map((email, i) => (
        <div key={i} data-testid="service-location-email-contact">
          {email.label && <SubHeadingTag>{email.label}</SubHeadingTag>}
          <va-link
            href={`mailto:${email.address}`}
            text={email.address}
            data-testid={`service-location-email-contact-${i}`}
          />
        </div>
      ))}

      {/* Service hours */}
      {location.hours === '2' && location.officeHours && (
        <>
          <SubHeadingTag data-testid="service-location-field-hours">
            Service Hours
          </SubHeadingTag>
          <div>
            <Hours allHours={location.officeHours} />
          </div>
        </>
      )}
      {location.hours === '0' && (
        <>
          <SubHeadingTag data-testid="service-location-field-hours">
            Service Hours
          </SubHeadingTag>
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

      {location.additionalHoursInfo && (
        <p className="vads-u-margin-bottom--0">
          {location.additionalHoursInfo}
        </p>
      )}
    </>
  )

  if (locationType === ServiceLocationType.NON_CLINICAL) {
    return <div className="break-word-wrap">{content}</div>
  } else {
    return (
      <va-card class="vads-u-margin-y--2 break-word-wrap">{content}</va-card>
    )
  }
}
