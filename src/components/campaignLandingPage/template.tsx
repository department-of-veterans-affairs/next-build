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
    ConnectWithUs,
    BenefitCategories,
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
    </>
  )
}
