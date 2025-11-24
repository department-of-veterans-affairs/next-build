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

export interface CampaignLandingPageProps extends FormattedCampaignLandingPage {
  // TODO: remove this once all the components are done. Used for axe testing which will fail on
  // unfinished, scaffolded sections
  onlyRenderFinishedComponents?: boolean
}

export function CampaignLandingPage(props: CampaignLandingPageProps) {
  return (
    <>
      <HeroBanner {...props} />
      <WhyThisMatters {...props} />
      <WhatYouCanDo {...props} />
      <VideoPanel {...props} />
      <SpotlightPanel {...props} />

      {/* TODO: In-progress components: */}
      {props.onlyRenderFinishedComponents !== true && (
        <>
          <StoriesPanel />
          <ResourcesPanel />
          <EventsPanel />
          <FaqPanel />
          <ConnectWithUs />
          <BenefitCategories />
        </>
      )}
    </>
  )
}
