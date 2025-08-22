import { GetUpdatesSection } from '@/templates/components/getUpdatesSection'
import { VamcSystemSocialLinks as VamcSystemSocialLinksProps } from '@/types/formatted/vamcSystem'

export const VamcSystemSocialLinks = ({
  regionNickname,
  links,
}: VamcSystemSocialLinksProps) => (
  <GetUpdatesSection
    links={links}
    heading={`Get updates from ${regionNickname}`}
    sectionId="get-updates"
  />
)
