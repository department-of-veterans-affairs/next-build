import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type ReactWidget = PublishedParagraph & {
  type: 'paragraph--react_widget'
  entityId: number | null
  widgetType: string
  ctaWidget?: boolean
  loadingMessage?: string
  slowLoadingMessage?: string
  timeout?: number
  errorMessage?: string
  defaultLink?: {
    url: string
    title: string
  } | null
  buttonFormat?: boolean
}
