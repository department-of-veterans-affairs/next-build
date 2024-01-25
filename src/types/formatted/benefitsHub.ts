export type BenefitsHubLink = {
  id: string
  title: string
  label: string
  path: string
  teaserText: string
}

export type BenefitsHubLinksProps = {
  title: string
  introText?: string
  benefitHubs: BenefitsHubLink[]
}
