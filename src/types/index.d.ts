export global {
  interface Window {
    gtag: any
  }
}
export interface SocialLinksProps {
  path: string
  title: string
}

export type ImageProps = {
  url: string
  width?: number
  height?: number
  alt?: string
  title?: string
  styles?: object //todo: do we need to type this more strongly?
}

export type PersonProfileTeaserProps = {
  title: string
  description: string
}

export type NewsStoryPageProps = {
  type: string
  published: boolean
  title: string
  image: ImageProps
  caption: string
  author: PersonProfileTeaserProps | any
  introText: string
  bodyContent: string
  date: string
  socialLinks: SocialLinksProps
  listing: string
}

export type NewsStoryTeaserProps = {
  headingLevel?: ComponentType | keyof JSX.IntrinsicElements
  link: string
  title: string
  image: ImageProps
  introText: string
}
