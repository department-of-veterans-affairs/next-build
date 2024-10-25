export type BenefitsHubLink = {
  id: string
  label: string
  path: string
  teaserText: string
}

export type BenefitsHubLinks = {
  introText?: string
  title?: string
  links: BenefitsHubLink[]
}
