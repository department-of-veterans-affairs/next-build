import { LeadershipListing as FormattedLeadershipListing } from './formatted-type'
import { ContentFooter } from '@/components/contentFooter/template'
import { StaffProfileTeaser } from '@/components/staffProfileTeaser/template'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { SideNavLayout } from '@/components/sideNavLayout/template'
export function LeadershipListing({
  title,
  introText,
  menu,
  profiles,
  lovellVariant,
  lovellSwitchPath,
}: LovellStaticPropsResource<FormattedLeadershipListing>) {
  return (
    <SideNavLayout menu={menu}>
      <article className="usa-content">
        <LovellSwitcher
          currentVariant={lovellVariant}
          switchPath={lovellSwitchPath}
        />
        <h1 className="vads-u-margin-bottom--3">{title}</h1>
        <div className="va-introtext">
          <p>{introText}</p>
        </div>
        {profiles.map((profile) => (
          <StaffProfileTeaser {...profile} key={profile.id} />
        ))}
        <ContentFooter />
      </article>
    </SideNavLayout>
  )
}
