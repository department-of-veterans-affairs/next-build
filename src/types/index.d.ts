export global {
  interface Window {
    gtag: any
  }
}

export interface PublishedEntity {
  id: string
  type: string
  published: boolean
}

export type NewsStoryFullType = PublishedEntity & {
  title: string
  image: ImageProps
  caption: string
  author: PersonProfileTeaserProps
  introText: string
  bodyContent: string
  date: string
  socialLinks: SocialLinksProps
  listing: string
}
