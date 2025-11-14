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
  width?: number
  height?: number
  links: MediaImageLinks
  loading?: 'eager' | 'lazy'
}

export type MediaVideo = {
  id: string
  type: string
  name: string
  field_description: string | null
  field_duration: number | null
  field_publication_date: string | null
  field_media_video_embed_field: string | null
}

export type MediaDocument = {
  id: string
  type: string
  filename: string
  uri: string
  filemime: string
  filesize: number
}
