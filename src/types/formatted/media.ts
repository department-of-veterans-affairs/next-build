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

export type MediaVideo = {
  id: string
  type: string
  name: string
  field_description: string
  field_duration: number
  field_media_video_embed_field: string
}

export type MediaDocument = {
  id: string
  type: string
  filename: string
  uri: string
  filemime: string
  filesize: number
}
