import StaffProfileSideBarNav from '@/templates/components/staffProfileSideBarNav'
import { StaffProfile as FormattedStaffProfile } from '@/types/formatted/staffProfile'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { PhoneNumber } from '@/templates/common/phoneNumber'
import { MediaImage } from '@/templates/common/mediaImage'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'
import { ContentFooter } from '@/templates/common/contentFooter'

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
  completeBiography,
  completeBiographyCreate,
  photoAllowHiresDownload,
  vamcTitle,
  media,
  menu,
  lovellVariant,
  lovellSwitchPath,
  lastUpdated,
}: LovellStaticPropsResource<FormattedStaffProfile>) => {
  return (
    <div className="vads-grid-container">
      <div className="vads-grid-row">
        {menu && (
          <div className="vads-u-display--none tablet:vads-u-display--block tablet:vads-grid-col-3">
            <StaffProfileSideBarNav
              sidebarData={menu}
              lovellVariant={lovellVariant}
            />
          </div>
        )}
        <div className={menu ? 'tablet:vads-grid-col-9' : 'vads-grid-col-12'}>
          <article className="usa-content">
            <LovellSwitcher
              currentVariant={lovellVariant}
              switchPath={lovellSwitchPath}
            />
            <div className="vads-display--flex vads-u-margin-bottom--2 vads-u-display--flex vads-u-flex-direction--column tablet:vads-u-flex-direction--row">
              <div
                className="vads-u-margin-bottom--2 tablet:vads-u-margin-bottom--0 vads-u-margin-right--3"
                style={{ maxWidth: '160px' }}
              >
                {media && (
                  <MediaImage
                    {...media}
                    className="person-profile-detail-page-image vads-u-width--auto"
                    imageStyle="2_3_medium_thumbnail"
                  />
                )}
              </div>
              <div className="vads-u-display--flex vads-u-flex-direction--column">
                <h1 className="vads-u-font-size--xl vads-u-margin-bottom--0p5">
                  {`${firstName} ${lastName} ${suffix ? suffix : ''}`}
                </h1>
                {description ? (
                  <p className="vads-u-font-size--lg vads-u-margin-top--0 vads-u-font-family--serif vads-u-margin-bottom--0p5">
                    {description}
                  </p>
                ) : null}
                {vamcTitle ? (
                  <p
                    className="
                        vads-u-margin--0
                        vads-u-margin-bottom--0p5
                        vads-u-font-family--serif
                        vads-u-font-size--lg"
                  >
                    {vamcTitle}
                    {lovellVariant ? ` - ${lovellVariant.toUpperCase()}` : ''}
                  </p>
                ) : null}

                {emailAddress && (
                  <p className="vads-u-margin-bottom--0p5 vads-u-margin-top--0">
                    <span className="vads-u-font-weight--bold">Email: </span>
                    <va-link
                      data-testid="profile-email"
                      href={`mailto:${emailAddress}`}
                      text={emailAddress}
                    />
                  </p>
                )}
                {phoneNumber?.number && (
                  <PhoneNumber
                    {...phoneNumber}
                    className="vads-u-margin-bottom--0p5 vads-u-margin-top--0"
                  />
                )}
              </div>
            </div>
            {completeBiographyCreate && (
              <div className="vads-u-margin-bottom--2">
                <div className="va-introtext">
                  <p className="vads-u-margin-bottom--0">{introText}</p>
                </div>
                <div
                  className="vads-u-margin-bottom--2"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>
            )}
            {media && photoAllowHiresDownload && (
              <p>
                {/* TODO this is not the full size photo path. We need to send the original path down from Drupal */}
                <va-link
                  data-testid="head-shot-download"
                  href={media.links['2_3_medium_thumbnail'].href}
                  download
                  text="Download full size photo"
                  filetype={media.links['2_3_medium_thumbnail'].href
                    .split('.')
                    .pop()
                    .toUpperCase()}
                />
              </p>
            )}
            {completeBiography && (
              <p>
                <va-link
                  data-testid="complete-biography-download"
                  href={completeBiography?.url}
                  download
                  text="Download full bio"
                  filetype={completeBiography?.url
                    .split('.')
                    .pop()
                    .toUpperCase()}
                />
              </p>
            )}
          </article>
          <ContentFooter lastUpdated={lastUpdated} />
        </div>
      </div>
    </div>
  )
}
