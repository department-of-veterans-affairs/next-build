import { VaIcon ,
  VaLink,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { VamcEhrSystem } from '@/types/drupal/vamcEhr'
import clsx from 'clsx'

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

  const renderIcon = (icon: string) => (
    <VaIcon
      class="vads-u-color--link-default vads-facility-hub-cta-circle vads-u-margin-right--1"
      size="3"
      icon={icon}
    />
  )

  const baseItemClasses =
    'vads-facility-hub-cta vads-u-margin--0 vads-u-align-items--center vads-u-border-top--1px vads-u-border-color--primary-alt-light'
  const normalItemClasses = clsx(baseItemClasses, 'vads-u-display--flex')
  const mobileOnlyItemClasses = clsx(
    baseItemClasses,
    'vads-u-display--flex tablet:vads-u-display--none'
  )
  const desktopOnlyItemClasses = clsx(
    baseItemClasses,
    'vads-u-display--none tablet:vads-u-display--flex'
  )

  // Let's use border util classes instead
  return (
    <div className="vads-u-display--flex tablet:vads-u-flex-direction--row vads-u-flex-direction--column">
      <div className="vads-u-margin-right--0 tablet:vads-u-margin-right--3">
        <p className={normalItemClasses}>
          {renderIcon('pill')}
          <VaLink
            href={getTopTaskUrl('refill-track-prescriptions/')}
            text="Refill and track your prescriptions"
          />
        </p>
        <p className={normalItemClasses}>
          {renderIcon('forum')}
          <VaLink
            href={getTopTaskUrl('secure-messaging/')}
            text="Send a secure message to your health care team"
          />
        </p>
        <p className={normalItemClasses}>
          {renderIcon('event_available')}
          <VaLink
            href={getTopTaskUrl('schedule-view-va-appointments/')}
            text="Schedule and manage health appointments"
          />
        </p>
        <p
          className={clsx(desktopOnlyItemClasses, 'vads-u-border-bottom--1px')}
        >
          {renderIcon('chat')}
          <VaLink
            href="https://mobile.va.gov/app/va-health-chat"
            text="Download VA Health Chat"
          />
        </p>
      </div>
      <div>
        <p className={normalItemClasses}>
          {renderIcon('note_add')}
          <VaLink
            href={getTopTaskUrl('get-medical-records/')}
            text="Download your VA medical records (Blue Button)"
          />
        </p>
        <p className={normalItemClasses}>
          {renderIcon('assignment')}
          <VaLink
            href={getTopTaskUrl('view-test-and-lab-results/')}
            text="View your lab and test results"
          />
        </p>
        <p className={normalItemClasses}>
          {renderIcon('hearing_disabled')}
          <VaLink
            href="/health-care/order-hearing-aid-batteries-and-accessories/"
            text="Order hearing aid batteries and accessories"
          />
        </p>
        <p className={mobileOnlyItemClasses}>
          {renderIcon('chat')}
          <VaLink
            href="https://mobile.va.gov/app/va-health-chat"
            text="Download VA Health Chat"
          />
        </p>
        <p className={clsx(normalItemClasses, 'vads-u-border-bottom--1px')}>
          {renderIcon('phone')}
          <VaLink
            href="https://www.va.gov/health/connect-to-va-care/index.asp"
            text="Connect to VA care"
          />
        </p>
      </div>
    </div>
  )
}
