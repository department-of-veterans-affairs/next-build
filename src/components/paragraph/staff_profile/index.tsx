import Image from '@/components/image'
import { DEV_PATH } from '@/lib/constants'
import {
  ParagraphMetaInfo,
  ParagraphProps,
  ParagraphResourceType,
} from '@/types/paragraph'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

export function StaffProfiles({ paragraph }: ParagraphProps) {
  if (!paragraph && !paragraph.field_staff_profile) return

  const thumbnail =
    DEV_PATH + paragraph.field_staff_profile?.field_media?.thumbnail?.uri?.url
  const meta =
    paragraph.field_staff_profile?.field_media?.thumbnail?.resourceIdObjMeta

  return (
    <div key={paragraph.field_staff_profile?.id}>
      <article className="usa-content">
        <div className="vads-u-display--flex vads-u-margin-bottom--4 vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
          {!paragraph.field_staff_profile?.field_media?.thumbnail ? (
            <div className="vads-u-flex--auto medium-screen:vads-u-margin-right--3 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
              <span className="circular-profile-image bio-paragraph-image vads-u-position--relative vads-u-background-color--gray-lightest vads-u-display--block">
                <span className="fas fa-user circular-profile-missing-icon"></span>
              </span>
            </div>
          ) : (
            <div className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-margin-right--3">
              <Image
                className="circular-profile-image bio-paragraph-image max-width-100"
                src={thumbnail}
                alt={meta?.alt}
                title={meta?.title}
                width={meta?.width}
                height={meta?.height}
              />
            </div>
          )}
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <p
              className="
            vads-u-margin-top--0
            vads-u-font-family--serif
            vads-u-font-weight--bold
            vads-u-display--block
            vads-u-margin-bottom--0
            vads-u-font-size--md"
            >
              {paragraph.field_staff_profile
                ?.field_complete_biography_create ? (
                <a
                  className="bioLink"
                  href={
                    paragraph.field_staff_profile?.field_entity?.entityUrl.path
                  }
                >
                  {paragraph.field_staff_profile?.field_name_first}{' '}
                  {paragraph.field_staff_profile?.field_last_name}{' '}
                  {paragraph.field_staff_profile?.field_suffix}
                </a>
              ) : (
                <span>
                  {paragraph.field_staff_profile?.field_name_first}{' '}
                  {paragraph.field_staff_profile?.field_last_name}{' '}
                  {paragraph.field_staff_profile?.field_suffix}{' '}
                </span>
              )}
            </p>
            {paragraph.field_staff_profile?.field_description && (
              <p className="vads-u-font-size--lg vads-u-margin-bottom--0p5">
                {paragraph.field_staff_profile?.field_description}
              </p>
            )}
            {paragraph.field_staff_profile?.field_phone_number && (
              <p
                className="
                vads-u-font-weight--normal
                vads-u-margin--0
                vads-u-margin-bottom--1"
              >
                <span className="vads-u-font-weight--bold">Phone: </span>
                <a
                  href={`tel:${paragraph.field_staff_profile?.field_phone_number}`}
                >
                  {paragraph.field_staff_profile?.field_phone_number}
                </a>
              </p>
            )}
            {paragraph.field_staff_profile?.field_email_address && (
              <p
                className="vads-u-font-weight--normal
              vads-u-margin--0
              vads-u-margin-bottom--1"
              >
                <span className="vads-u-font-weight--bold">Email: </span>
                <a
                  href={`mailto:${paragraph.field_staff_profile?.field_email_address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {paragraph.field_staff_profile?.field_email_address}
                </a>
              </p>
            )}
          </div>
        </div>
      </article>
      <hr />
    </div>
  )
}

const staffProfileParams = new DrupalJsonApiParams().addInclude([
  'field_staff_profile',
  'field_staff_profile.field_media',
  'field_staff_profile.field_media.thumbnail',
  'field_staff_profile.field_media.image',
])

export const Meta: ParagraphMetaInfo = {
  resource: ParagraphResourceType.StaffProfile,
  component: StaffProfiles,
  params: staffProfileParams,
}
