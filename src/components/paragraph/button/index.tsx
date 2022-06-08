import Link from 'next/link'
import validator from 'validator'
import { ParagraphMetaInfo, ParagraphProps } from '@/components/paragraph'

function isRequestValid(paragraph) {
  return (
    paragraph?.field_button_label &&
    paragraph?.field_button_link?.uri &&
    validator.isURL(paragraph?.field_button_link?.uri)
  )
}

export function Button({ paragraph }: ParagraphProps) {
  if (!paragraph || !isRequestValid(paragraph)) return

  return (
    <div key={paragraph.id}>
      <Link href={paragraph.field_button_link?.uri} passHref>
        <a className="vads-c-action-link--blue">
          {paragraph.field_button_label}
        </a>
      </Link>
    </div>
  )
}

export const Meta: ParagraphMetaInfo = {
  resource: 'paragraph--button',
  component: Button,
}
