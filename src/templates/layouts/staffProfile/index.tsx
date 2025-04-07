import SidebarNav from '@/templates/components/facilityNoDrupalPageSideBarNav'

import { StaffProfile as FormattedStaffProfile } from '@/types/formatted/staffProfile'
import { PersonProfile } from '@/templates/components/personProfile'

export type PersonProfileTeaserProps = {
  title: string
  description?: string
}

export const StaffProfile = ({
  firstName,
  lastName,
  suffix,
  emailAddress,
  phoneNumber,
  introText,
  description,
  body,
  completeBiographyCreate,
  vamcOfficalName,
  media,
  menu,
}: FormattedStaffProfile) => {
  return (
    <div className="usa-grid usa-grid-full">
      <SidebarNav sidebarData={menu} />
      <div className="usa-width-three-fourths">
        <PersonProfile
          firstName={firstName}
          lastName={lastName}
          suffix={suffix}
          emailAddress={emailAddress}
          phoneNumber={phoneNumber}
          introText={introText}
          description={description}
          body={body}
          completeBiographyCreate={completeBiographyCreate}
          vamcOfficalName={vamcOfficalName}
          media={media}
          displayType="page"
        />
      </div>
    </div>
  )
}
