import { Table } from '@/templates/components/table'
import { Wysiwyg } from '@/templates/components/wysiwyg'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { Paragraph as FormattedParagraph } from '@/types/formatted/paragraph'

export const Paragraph = (paragraph: FormattedParagraph) => {
  const type = paragraph.type

  switch (type) {
    case PARAGRAPH_RESOURCE_TYPES.TABLE:
      return <Table {...paragraph} />

    case PARAGRAPH_RESOURCE_TYPES.WYSIWYG:
    case PARAGRAPH_RESOURCE_TYPES.RICH_TEXT_CHAR_LIMIT_1000:
      return <Wysiwyg {...paragraph} />

    default:
      return null
  }
}
