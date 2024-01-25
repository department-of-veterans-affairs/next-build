export type ReactWidget = {
  entityId: number
  widgetType: string
  ctaWidget?: boolean
  loadingMessage?: string
  slowLoadingMessage?: string
  timeout?: number
  errorMessage?: string
  defaultLink?: {
    url: string
    title: string
  }
  buttonFormat?: boolean
}
