export type MediaImageLink = {
  [key: string]: {
    href: string
    meta: {
      linkParams: {
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
  url: string
  width: number
  height: number
  link: MediaImageLink
  imageStyle?: string
  className?: string
  style?: string
}
