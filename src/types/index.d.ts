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

export type NewsStoryTeaserType = PublishedEntity & {
  headingLevel?: ComponentType | keyof JSX.IntrinsicElements
  link: string
  title: string
  image: ImageProps
  introText: string
}

export type StoryListingFullType = PublishedEntity & {
  title: string
  introText: string
  stories: NewsStoryTeaserType[]
}

export type StoryListingLinkType = {
  path: string
}
