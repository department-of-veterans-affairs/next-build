import SidebarNav from '@/templates/components/facilityNoDrupalPageSideBarNav'

import { StaffProfile as FormattedStaffProfile } from '@/types/formatted/staffProfile'
import { MediaImage } from '@/templates/common/mediaImage'

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
                <p className="vads-u-font-size--lg vads-u-margin-top--0 vads-u-font-family--serif vads-u-margin-bottom--0p5">
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
                  <va-link
                    data-testid="profile-email"
                    href={`mailto:${emailAddress}`}
                    text={emailAddress}
                  />
                </p>
              )}
              {phoneNumber?.number && (
                <p className="vads-u-font-weight--regular vads-u-margin--0 vads-u-margin-bottom--0p5">
                  <span className="vads-u-font-weight--bold">Phone: </span>
                  <va-link
                    data-testid="profile-phone"
                    href={`tel:${phoneNumber?.number}`}
                    text={phoneNumber?.number}
                  />
                </p>
              )}
            </div>
          </div>
          {completeBiographyCreate && (
            <div className="vads-u-margin-bottom--2">
              <p className="vads-u-margin-bottom--0 va-introtext">
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
