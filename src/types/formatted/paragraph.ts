import { Table } from '@/types/formatted/table'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

export type ParagraphComponent<T> = Omit<T, 'type'> & {
  type?: (typeof PARAGRAPH_RESOURCE_TYPES)[keyof typeof PARAGRAPH_RESOURCE_TYPES]
}

export type Paragraph = Table | Wysiwyg
