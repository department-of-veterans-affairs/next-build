export type BenefitsHubLink = {
  id: string
  title: string
  label: string
  path: string
  teaserText: string
}

export type BenefitsHubLinks = {
  title: string
  introText?: string
  links: BenefitsHubLink[]
}
