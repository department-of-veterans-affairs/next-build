import { DEV_PATH } from '@/lib/constants'

export const SocialLinks = ({ node }): JSX.Element => {
  const hostUrl = DEV_PATH + node?.path?.alias

  return (
    <div className="vads-u-margin-bottom--0p5 medium-screen:vads-u-margin-bottom--2">
      <ul className="usa-unstyled-list vads-u-display--flex" role="list">
        <li className="vads-u-margin-right--5 medium-screen:vads-u-margin-right--2p5">
          <a
            className="va-js-share-link"
            href={`https://www.facebook.com/sharer/sharer.php?href=${hostUrl}`}
          >
            <i className="va-c-social-icon fab fa-facebook vads-u-margin-right--0p5"></i>
            Share on Facebook
          </a>
        </li>

        <li className="vads-u-flex--1">
          <a
            className="va-js-share-link"
            href={`https://twitter.com/intent/tweet?text=${node?.title}&url=${hostUrl}`}
          >
            <i className="va-c-social-icon fab fa-twitter vads-u-margin-right--0p5"></i>
            Share on Twitter
          </a>
        </li>
      </ul>
    </div>
  )
}
