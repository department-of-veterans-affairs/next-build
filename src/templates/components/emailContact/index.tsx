import Link from 'next/link'
import { recordEvent } from '@/lib/utils/recordEvent'
import { isEmpty, isNull } from 'lodash'
import { EmailContactType } from '@/types/index'

function isRequestInValid(email) {
  return isNull(email.label) || isNull(email.address)
}

export function EmailContact(email: EmailContactType) {
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
