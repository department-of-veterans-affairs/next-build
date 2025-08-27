import { GetUpdatesSection } from '@/components/getUpdatesSection/template'
import { VamcSystemSocialLinks as VamcSystemSocialLinksProps } from '@/components/vamcSystem/formatted-type'

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
