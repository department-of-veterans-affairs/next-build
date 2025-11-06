import { BenefitCategories } from './BenefitCategories'
import { ConnectWithUs } from './ConnectWithUs'
import { EventsPanel } from './EventsPanel'
import { FaqPanel } from './FaqPanel'
import { HeroBanner } from './HeroBanner'
import { ResourcesPanel } from './ResourcesPanel'
import { SpotlightPanel } from './SpotlightPanel'
import { StoriesPanel } from './StoriesPanel'
import { VideoPanel } from './VideoPanel'
import { WhatYouCanDo } from './WhatYouCanDo'
import { WhyThisMatters } from './WhyThisMatters'

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
