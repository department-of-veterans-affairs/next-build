export type MediaImageLinks = {
  [key: string]: {
    href: string
    meta?: {
      linkParams?: {
        width?: number
        height?: number
      }
    }
  }
}

export type MediaImage = {
  id: string
  alt: string
  title: string
  width: number
  height: number
  links: MediaImageLinks
}
