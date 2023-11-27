import Link from 'next/link'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { isEmpty, isNull } from 'lodash'
import { EmailContact as FormattedEmailContact } from '@/types/dataTypes/formatted/emailContact'

function isRequestInValid(email) {
  return isNull(email.label) || isNull(email.address)
}

export function EmailContact(email: FormattedEmailContact) {
  if (isEmpty(email) || isRequestInValid(email)) return

  const analytic = {
    event: 'nav-linkslist',
    'links-list-header': `${encodeURIComponent(email.address)}`,
    'links-list-section-header': 'Need more help?',
  }

  return (
    <div key={email.id}>
      <strong>{email.label}: </strong>
      <Link
        onClick={() => recordEvent(analytic)}
        rel="noreferrer noopener"
        href={'mailto:' + email.address}
        passHref
      >
        {email.address}
      </Link>
    </div>
  )
}
