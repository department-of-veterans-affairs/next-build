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

import { CampaignLandingPage as FormattedCampaignLandingPage } from './formatted-type'

export type CampaignLandingPageProps = {
  title: string
  hero: {
    cta: {
      primary: Link
      secondary: Link
    }
    blurb: string
    image: {
      url: string
    }
  }
}

export function CampaignLandingPage(props: CampaignLandingPageProps) {
  return (
    <>
      <HeroBanner {...props} />
      <WhyThisMatters {...props} />
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
