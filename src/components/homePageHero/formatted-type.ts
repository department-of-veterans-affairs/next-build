
type Link = {
  title: string
  url: string
}

export type HomePageHero = {
  fieldPromoHeadline: string
  fieldPromoCta: {
    fieldButtonLabel: string
    fieldButtonLink: string
  }
  fieldPromoText: string
  createAccountBlock: {
    fieldCtaSummaryText: string
    fieldPrimaryCtaButtonText: string
    fieldRelatedInfoLinks: Link[]
  }
}
