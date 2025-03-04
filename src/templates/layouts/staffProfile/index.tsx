import { MediaImage } from '@/templates/common/mediaImage'
import SidebarNav from '@/templates/components/facilityNoDrupalPageSideBarNav'

import { StaffProfile as FormattedStaffProfile } from '@/types/formatted/staffProfile'

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
        <article className="usa-content">
          <div className="usa-grid usa-grid-full vads-u-margin-bottom--2 vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
            <div className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-margin-right--3 staff-profile-image">
              {media && (
                <MediaImage
                  {...media}
                  className="person-profile-detail-page-image"
                  imageStyle="2_3_medium_thumbnail"
                />
              )}
            </div>
            <div className="vads-u-display--flex vads-u-flex-direction--column">
              <h1 className="vads-u-font-size--xl vads-u-margin-bottom--0p5">
                {firstName} {lastName} {suffix}
              </h1>
              {description ? (
                <p className="vads-u-font-size--lg vads-u-margin-bottom--0p5">
                  {description}
                </p>
              ) : null}
              {vamcOfficalName ? (
                <p
                  className="
                             vads-u-font-weight--normal
                             vads-u-margin--0
                             vads-u-margin-bottom--0p5
                             vads-u-font-family--serif
                             vads-u-font-size--lg"
                >
                  {vamcOfficalName}
                </p>
              ) : null}

              {emailAddress && (
                <p className="vads-u-font-size--lg vads-u-margin-bottom--0p5">
                  <span className="vads-u-font-weight--bold">Email: </span>
                  <a target="blank" href={`mailto:${emailAddress}`}>
                    {emailAddress}
                  </a>
                </p>
              )}
              {phoneNumber && (
                <p
                  className="
                vads-u-font-weight--regular
                vads-u-margin--0
                vads-u-margin-bottom--0p5"
                >
                  <span className="vads-u-font-weight--bold">Phone: </span>
                  <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
                </p>
              )}
            </div>
          </div>
          {completeBiographyCreate && (
            <div className="va-introtext vads-u-margin-bottom--2">
              <p className="va-introtext vads-u-margin-bottom--0">
                {introText}
              </p>
              <div
                className="vads-u-margin-bottom--2"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
