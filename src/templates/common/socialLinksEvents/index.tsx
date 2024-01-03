export interface SocialLinksEventsProps {
  path: string
  title: string
  description?: string
  address?: string
  dateObject?: {
    endValue: number
    value: number
  }
}

export const SocialLinksEvents = ({
  path,
  title,
  description,
  address,
  dateObject,
}: SocialLinksEventsProps) => {
  return (
    <div id="va-c-social-share">
      <ul className="usa-unstyled-list" role="list">
        <li className="vads-u-margin-bottom--2p5">
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

        <li className="vads-u-margin-bottom--2p5">
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

        <li>
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
      </ul>
    </div>
  )
}
