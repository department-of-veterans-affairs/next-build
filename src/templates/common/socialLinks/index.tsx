import { SocialLinkItem } from './socialLinkItem'

interface SocialLinkProps {
  uri: string
  title: string
}

interface SocialLinksProps {
  path: string
  title: string
  description?: string
  address?: string
  dateObject?: {
    endValue: number
    value: number
  }
  regionNickname?: string
  fieldNews?: SocialLinkProps
  fieldFacebook?: SocialLinkProps
  fieldTwitter?: SocialLinkProps
  fieldFlickr?: SocialLinkProps
  fieldInstagram?: SocialLinkProps
  fieldYoutube?: SocialLinkProps
}

export const SocialLinks = ({
  path,
  title,
  description,
  address,
  dateObject,
  regionNickname,
  fieldNews,
  fieldFacebook,
  fieldTwitter,
  fieldFlickr,
  fieldInstagram,
  fieldYoutube,
}: SocialLinksProps) => {
  // Determine if page is event or VBA based on props
  const isEvent = description || address || dateObject
  const isVBA =
    fieldNews ||
    fieldTwitter ||
    fieldFacebook ||
    fieldFlickr ||
    fieldInstagram ||
    fieldYoutube

  const divClass = isEvent
    ? 'va-c-social-share'
    : 'vads-u-margin-bottom--0p5 medium-screen:vads-u-margin-bottom--2'

  const ulClass = 'usa-unstyled-list' + (isEvent ? '' : ' vads-u-display--flex')

  const vbaSocialLinks = [
    fieldNews && {
      url: fieldNews.uri,
      icon: 'fas fa-envelope',
      title: fieldNews.title,
    },
    fieldFacebook && {
      url: fieldFacebook.uri,
      icon: 'fab fa-facebook-square',
      title: fieldFacebook.title,
    },
    fieldTwitter && {
      url: fieldTwitter.uri,
      icon: 'fab fa-twitter',
      title: fieldTwitter.title,
    },
    fieldFlickr && {
      url: fieldFlickr.uri,
      icon: 'fab fa-flickr',
      title: fieldFlickr.title,
    },
    fieldInstagram && {
      url: fieldInstagram.uri,
      icon: 'fab fa-instagram',
      title: fieldInstagram.title,
    },
    fieldYoutube && {
      url: fieldYoutube.uri,
      icon: 'fab fa-youtube',
      title: fieldYoutube.title,
    },
  ].filter(Boolean)

  return (
    <div className={divClass}>
      <ul className={ulClass} role="list">
        {isEvent && (
          <li className="vads-u-margin-bottom--2p5 medium-screen:vads-u-margin-right--2p5">
            <a
              data-description={description}
              data-end={dateObject?.endValue}
              data-location={address}
              data-start={dateObject?.value}
              data-subject={title}
              href={path}
              id="add-to-calendar-link"
            >
              <i
                className="va-c-social-icon fas fa-calendar-check vads-u-margin-right--0p5"
                aria-hidden="true"
                role="presentation"
              ></i>
              Add to Calendar
            </a>
          </li>
        )}

        {isVBA ? (
          <>
            <h2 className="vads-u-margin-bottom--2">
              Get updates from {regionNickname}
            </h2>
            {vbaSocialLinks.map((link, index) => (
              <SocialLinkItem key={index} {...link} />
            ))}
          </>
        ) : (
          <>
            <li className="vads-u-margin-bottom--2p5 medium-screen:vads-u-margin-right--2p5">
              <a
                className="va-js-share-link"
                href={`https://www.facebook.com/sharer/sharer.php?href=${path}`}
              >
                <i
                  aria-hidden="true"
                  className="va-c-social-icon fab fa-facebook vads-u-margin-right--0p5"
                  role="presentation"
                ></i>
                Share on Facebook
              </a>
            </li>
            <li className="medium-screen:vads-u-margin-right--2p5">
              <a
                className="va-js-share-link"
                href={`https://twitter.com/intent/tweet?text=${title}&url=${path}`}
              >
                <i
                  aria-hidden="true"
                  className="va-c-social-icon fab fa-twitter vads-u-margin-right--0p5"
                  role="presentation"
                ></i>
                Share on Twitter
              </a>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}
