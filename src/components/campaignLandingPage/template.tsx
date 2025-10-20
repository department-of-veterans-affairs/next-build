import {
  BenefitCategories,
  ConnectWithUs,
  EventsPanel,
  FaqPanel,
  HeroBanner,
  ResourcesPanel,
  SpotlightPanel,
  StoriesPanel,
  VideoPanel,
  WhatYouCanDo,
  WhyThisMatters,
} from './components'

export type CampaignLandingPageProps = {
  title: string
}

export function CampaignLandingPage({ title }: CampaignLandingPageProps) {
  return (
    <>
      <HeroBanner title={title} />
      <WhyThisMatters title={title} />
      <WhatYouCanDo />
      <VideoPanel />
      <SpotlightPanel />
      <StoriesPanel />
      <ResourcesPanel />
      <EventsPanel />
      <FaqPanel />
      <ConnectWithUs />
      <BenefitCategories />
    </>
  )
}
