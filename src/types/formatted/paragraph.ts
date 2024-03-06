import { ParagraphResourceType } from '@/lib/constants/resourceTypes'

export type ParagraphComponent<T> = Omit<T, 'type'> & {
  type?: ParagraphResourceType
}
