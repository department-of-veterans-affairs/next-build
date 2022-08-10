import { MediaImageComponent, ImageProps } from '@/templates/media'
import Image from '@/templates/image'

export type StaffProfileProps = {
  id: string
  name: string
  thumbnail?: ImageProps
  linkToBio?: boolean
  path?: string | null
  description?: string
  phone?: string
  email?: string
}

export function StaffProfile({
  id,
  name,
  thumbnail,
  linkToBio,
  path,
  description,
  phone,
  email,
}: StaffProfileProps) {
  return (
    <article key={id} className="usa-content">
      <div className="vads-u-display--flex vads-u-margin-bottom--4 vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
        {!thumbnail ? (
          <div className="vads-u-flex--auto medium-screen:vads-u-margin-right--3 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
            <span className="circular-profile-image bio-paragraph-image vads-u-position--relative vads-u-background-color--gray-lightest vads-u-display--block">
              <span className="fas fa-user circular-profile-missing-icon"></span>
            </span>
          </div>
        ) : (
          <div className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-margin-right--3">
            {/*<MediaImageComponent*/}
            {/*  className="circular-profile-image bio-paragraph-image max-width-100"*/}
            {/*  image={thumbnail}*/}
            {/*  imageStyle="thumbnail"*/}
            {/*/>*/}
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
            {linkToBio ? (
              <a className="bioLink" href={path}>
                {name}
              </a>
            ) : (
              <span>{name}</span>
            )}
          </p>
          {description && (
            <p className="vads-u-font-size--lg vads-u-margin-bottom--0p5">
              {description}
            </p>
          )}
          {phone && (
            <p
              className="
                vads-u-font-weight--normal
                vads-u-margin--0
                vads-u-margin-bottom--1"
            >
              <span className="vads-u-font-weight--bold">Phone: </span>
              <a href={`tel:${phone}`}>{phone}</a>
            </p>
          )}
          {email && (
            <p
              className="vads-u-font-weight--normal
              vads-u-margin--0
              vads-u-margin-bottom--1"
            >
              <span className="vads-u-font-weight--bold">Email: </span>
              <a href={`mailto:${email}`} target="_blank" rel="noreferrer">
                {email}
              </a>
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
