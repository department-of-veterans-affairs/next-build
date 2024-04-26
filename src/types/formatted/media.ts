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

export type MediaVideoLinks = {
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

export type MediaVideo = {
  id: string
  type: string
  links: MediaVideoLinks
  alt: string
  width: number
  height: number
  title: string
}

export type MediaDocumentLinks = {
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

export type MediaDocument = {
  id: string
  type: string
  links: MediaDocumentLinks
  alt: string
  width: number
  height: number
  title: string
}


