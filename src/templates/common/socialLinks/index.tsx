export interface SocialLinksProps {
  path: string
  title: string
  isNews: boolean
  description: string
  address: {
    additionalName: string | null;
    addressLine1: string;
    addressLine2: string;
    administrativeArea: string;
    countryCode: string;
    dependentLocality: string | null;
    familyName: string | null;
    givenName: string | null;
    langcode: string;
    locality: string;
    organization: string | null;
    postalCode: string | null;
    sortingCode: string | null;
  }
}

export const SocialLinks = ({ path, title, isNews = false, description, address, }: SocialLinksProps): JSX.Element => {


  if (isNews) {
    return (
      <div className="vads-u-margin-bottom--0p5 medium-screen:vads-u-margin-bottom--2">
        <ul className="usa-unstyled-list vads-u-display--flex" role="list">
          <li className="vads-u-margin-right--5 medium-screen:vads-u-margin-right--2p5">
            <a
              className="va-js-share-link"
              href={`https://www.facebook.com/sharer/sharer.php?href=${path}`}
            >
              <i className="va-c-social-icon fab fa-facebook vads-u-margin-right--0p5"></i>
              Share on Facebook
            </a>
          </li>

          <li className="vads-u-flex--1">
            <a
              className="va-js-share-link"
              href={`https://twitter.com/intent/tweet?text=${title}&url=${path}`}
            >
              <i className="va-c-social-icon fab fa-twitter vads-u-margin-right--0p5"></i>
              Share on Twitter
            </a>
          </li>
        </ul>
      </div>
    )
  }
  return (
    // TODO, FIX DATES
    <div id="va-c-social-share">
      <ul className="usa-unstyled-list" role="list">
        <li className="vads-u-margin-bottom--2p5">
          <a
            data-description={description}
            data-end="{{ mostRecentDate.endValue }}"
            data-location={`${address.addressLine1} ${address.locality}, ${address.administrativeArea}`}
            data-start="{{ mostRecentDate.value }}"
            data-subject={title}
            href={path}
            id="add-to-calendar-link">
            <i className="va-c-social-icon fas fa-calendar-check vads-u-margin-right--0p5" aria-hidden="true" role="presentation"></i>
            Add to Calendar
          </a>
        </li>

        <li className="vads-u-margin-bottom--2p5">
          <a className="va-js-share-link" href={`https://www.facebook.com/sharer/sharer.php?href=${path}`}>
            <i aria-hidden="true" className="va-c-social-icon fab fa-facebook vads-u-margin-right--0p5" role="presentation"></i>
            Share on Facebook
          </a>
        </li>

        <li>
          <a className="va-js-share-link" href={`https://twitter.com/intent/tweet?text=${title}&url=${path}`}>
            <i aria-hidden="true" className="va-c-social-icon fab fa-twitter vads-u-margin-right--0p5" role="presentation"></i>
            Share on Twitter
          </a>
        </li>
      </ul>
    </div >
  )
}
