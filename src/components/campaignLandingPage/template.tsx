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

  // used for analytics which needs to know the number of page sections
  pageSectionCount?: number
}

export function CampaignLandingPage(props: CampaignLandingPageProps) {
  const sections = [
    HeroBanner,
    WhyThisMatters,
    WhatYouCanDo,
    VideoPanel,
    SpotlightPanel,
    StoriesPanel,
    ResourcesPanel,
    EventsPanel,
    FaqPanel,
  ]

  const pageSectionCount = sections.length

  return (
    <>
      {sections.map((SectionComponent, index) => (
        <SectionComponent
          {...props}
          pageSectionCount={pageSectionCount}
          key={index}
        />
      ))}

      {/* TODO: In-progress components: */}
      {props.onlyRenderFinishedComponents !== true && (
        <>
          <ConnectWithUs />
          <BenefitCategories />
        </>
      )}
    </>
  )
}
