export type BenefitsHub = {
  id: string
  url: string
  title: string
  homePageHubLabel: string
  teaserText: string
}

export type BenefitsHubLinks = {
  title: string
  relatedBenefitHubs: BenefitsHub[]
}
