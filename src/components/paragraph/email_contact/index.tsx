import Link from 'next/link'
import { recordEvent } from '@/utils/recordEvent'
import {
  ParagraphMetaInfo,
  ParagraphProps,
  ParagraphResourceType,
} from '@/types//paragraph'

function isRequestValid(paragraph) {
  return (
    paragraph.field_email_label !== null &&
    paragraph.field_email_address !== null
  )
}

export function EmailContact({ paragraph }: ParagraphProps) {
  if (!paragraph || !isRequestValid(paragraph)) return

  const analytic = {
    event: 'nav-linkslist',
    'links-list-header': `${encodeURIComponent(paragraph.field_email_address)}`,
    'links-list-section-header': 'Need more help?',
  }

  return (
    <div key={paragraph.id}>
      <strong>{paragraph.field_email_label}: </strong>
      <Link href={'mailto:' + paragraph.field_email_address} passHref>
        <a onClick={() => recordEvent(analytic)} rel="noreferrer noopener">
          {paragraph.field_email_address}
        </a>
      </Link>
    </div>
  )
}

export const Meta: ParagraphMetaInfo = {
  resource: ParagraphResourceType.EmailContact,
  component: EmailContact,
}
