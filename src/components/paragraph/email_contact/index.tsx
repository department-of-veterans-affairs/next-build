import Link from 'next/link'
import { recordEvent } from '@/utils/recordEvent'
import { ParagraphEmailContact } from '@/types/paragraph'

function isRequestValid(paragraph: ParagraphEmailContact) {
  return (
    paragraph.field_email_label !== null &&
    paragraph.field_email_address !== null
  )
}

const EmailContact = ({ paragraph }): JSX.Element => {
  if (!paragraph || !isRequestValid(paragraph)) return

  const EMAIL_CONTACT_EVENT = {
    event: 'nav-linkslist',
    'links-list-header': `${encodeURIComponent(paragraph.field_email_address)}`,
    'links-list-section-header': 'Need more help?',
  }

  return (
    <div key={paragraph.id}>
      <strong>{paragraph.field_email_label}: </strong>
      <Link href={'mailto:' + paragraph.field_email_address} passHref>
        <a
          onClick={() => recordEvent(EMAIL_CONTACT_EVENT)}
          rel="noreferrer noopener"
        >
          {paragraph.field_email_address}
        </a>
      </Link>
    </div>
  )
}

export default EmailContact
