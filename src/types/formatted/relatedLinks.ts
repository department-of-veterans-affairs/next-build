export type RelatedLink = {
  title: string
<<<<<<< HEAD
  uri: string
  summary?: string
=======
  url: string
  summary: string
>>>>>>> d3dcb96c (Refactor related information component to be shared)
}

export type FormattedRelatedLinks = {
  sectionTitle: string
  links: RelatedLink[]
}
