export interface SupportService {
  type: string
  id: string
  title: string
  number?: string
  link?: {
    uri: string
    title: string
    url?: string
  }
}
