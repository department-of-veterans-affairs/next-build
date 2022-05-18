import Link from 'next/link'
import { ParagraphLinkTeaser } from '@/types/paragraph'

function isRequestValid(paragraph: ParagraphLinkTeaser) {
  return paragraph?.field_button_label && paragraph?.field_button_link?.uri
}

const LinkTeaser = ({ paragraph }): JSX.Element => {
  if (!paragraph || !isRequestValid(paragraph)) return

  return <li key={paragraph.id}></li>
}

export default LinkTeaser
