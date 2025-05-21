import { VamcEhrSystem } from '@/types/drupal/vamcEhr'

interface ManageYourHealthLinksProps {
  vamcEhrSystem: VamcEhrSystem
}

export function isProd() {
  return process.env.APP_ENV === 'prod'
}

export function ManageYourHealthLinks({
  vamcEhrSystem,
}: ManageYourHealthLinksProps) {
  function getTopTaskUrl(path) {
    // If cerner, or if cerner-staged in a non-prod environment
    if (
      vamcEhrSystem === 'cerner' ||
      (vamcEhrSystem === 'cerner_staged' && !isProd())
    ) {
      if (path === 'refill-track-prescriptions/') {
        return 'https://patientportal.myhealth.va.gov/pages/medications/current'
      }

      if (path === 'secure-messaging/') {
        return 'https://patientportal.myhealth.va.gov/pages/messaging/inbox'
      }

      if (path === 'schedule-view-va-appointments/') {
        return 'https://patientportal.myhealth.va.gov/pages/scheduling/upcoming'
      }

      if (path === 'get-medical-records/') {
        return 'https://patientportal.myhealth.va.gov/pages/health_record/clinical_documents/open_notes?pagelet=https%3A%2F%2Fportal.myhealth.va.gov%2Fperson%2F1056308125V679416%2Fhealth-record%2Fopen-notes'
      }

      if (path === 'view-test-and-lab-results/') {
        return 'https://patientportal.myhealth.va.gov/pages/health_record/results'
      }
    }

    // Vista equivalent
    return `/health-care/${path}`
  }

  return (
    <div className="vads-u-display--flex medium-screen:vads-u-flex-direction--row vads-u-flex-direction--column">
      <div className="vads-u-margin-right--0 medium-screen:vads-u-margin-right--3">
        <div className="vads-facility-hub-cta vads-u-display--flex vads-u-align-items--center">
          <va-icon
            class="vads-u-color--link-default vads-facility-hub-cta-circle vads-u-margin-right--1"
            size="3"
            icon="pill"
          />
          <va-link
            href={getTopTaskUrl('refill-track-prescriptions/')}
            text="Refill and track your prescriptions"
          />
        </div>
        <div className="vads-facility-hub-cta vads-u-display--flex vads-u-align-items--center">
          <va-icon
            class="vads-u-color--link-default vads-facility-hub-cta-circle vads-u-margin-right--1"
            size="3"
            icon="forum"
          />
          <va-link
            href={getTopTaskUrl('secure-messaging/')}
            text="Send a secure message to your health care team"
          />
        </div>
        <div className="vads-facility-hub-cta vads-u-border-color--primary-alt-light medium-screen:vads-u-border-bottom--1px vads-u-display--flex vads-u-align-items--center">
          <va-icon
            class="vads-u-color--link-default vads-facility-hub-cta-circle vads-u-margin-right--1"
            size="3"
            icon="event_available"
          />
          <va-link
            href={getTopTaskUrl('schedule-view-va-appointments/')}
            text="Schedule and manage health appointments"
          />
        </div>
        <div className="vads-facility-hub-cta vads-u-display--none medium-screen:vads-u-display--flex vads-u-align-items--center">
          <va-icon
            class="vads-u-color--link-default vads-facility-hub-cta-circle vads-u-margin-right--1"
            size="3"
            icon="chat"
          />
          <va-link
            href="https://mobile.va.gov/app/va-health-chat"
            text="Download VA Health Chat"
          />
        </div>
      </div>
      <div>
        <div className="vads-facility-hub-cta vads-u-display--flex vads-u-align-items--center">
          <va-icon
            class="vads-u-color--link-default vads-facility-hub-cta-circle vads-u-margin-right--1"
            size="3"
            icon="note_add"
          />
          <va-link
            href={getTopTaskUrl('get-medical-records/')}
            text="Download your VA medical records (Blue Button)"
          />
        </div>
        <div className="vads-facility-hub-cta vads-u-display--flex vads-u-align-items--center">
          <va-icon
            class="vads-u-color--link-default vads-facility-hub-cta-circle vads-u-margin-right--1"
            size="3"
            icon="assignment"
          />
          <va-link
            href={getTopTaskUrl('view-test-and-lab-results/')}
            text="View your lab and test results"
          />
        </div>
        <div className="vads-facility-hub-cta vads-facility-hub-cta-last-line vads-u-border-top--1px vads-u-border-color--primary-alt-light vads-u-display--flex vads-u-align-items--center">
          <va-icon
            class="vads-u-color--link-default vads-facility-hub-cta-circle vads-u-margin-right--1"
            size="3"
            icon="hearing_disabled"
          />
          <va-link
            href="/health-care/order-hearing-aid-batteries-and-accessories/"
            text="Order hearing aid batteries and accessories"
          />
        </div>
        <div className="vads-facility-hub-cta vads-u-display--flex vads-u-align-items--center medium-screen:vads-u-display--none">
          <va-icon
            class="vads-u-color--link-default vads-facility-hub-cta-circle vads-u-margin-right--1"
            size="3"
            icon="chat"
          />
          <va-link
            href="https://mobile.va.gov/app/va-health-chat"
            text="Download VA Health Chat"
          />
        </div>
        <div className="vads-facility-hub-cta vads-u-display--flex vads-u-align-items--center">
          <va-icon
            class="vads-u-color--link-default vads-facility-hub-cta-circle vads-u-margin-right--1"
            size="3"
            icon="phone"
          />
          <va-link
            href="https://www.va.gov/health/connect-to-va-care/index.asp"
            text="Connect to VA care"
          />
        </div>
      </div>
    </div>
  )
}
