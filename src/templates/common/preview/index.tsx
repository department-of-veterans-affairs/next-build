/* These two components appear when viewing a page through the /api/preview route
 * using the Drupal CMS preview.
 */

// In preview mode, this appears just above the page's breadcrumbs.
export const PreviewCrumb = ({ entityId }) => {
  return (
    <div className="usa-grid-full">
      <div className="usa-width-one-whole">
        <div className="vads-u-margin-top--2">
          <a
            data-same-tab=""
            href={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/node/${entityId}/edit`}
          >
            « Edit this page in the CMS (requires a CMS account with appropriate
            permissions)
          </a>
        </div>
      </div>
    </div>
  )
}

// In preview mode, this appears as a small banner at the very top of the page when viewing draft or archived revisions.
export const UnpublishedBanner = ({ resource }) => {
  if (resource.published) return null

  let modState
  switch (resource.moderationState) {
    case 'archived':
      modState = 'an archived'
      break
    case 'draft':
    case 'review':
    default:
      modState = 'a draft'
  }

  return (
    <div className="vads-u-background-color--primary-alt-lightest vads-u-padding--1">
      <div className="vads-l-grid-container medium-screen:vads-u-padding-x--0">
        You are viewing {modState} revision of {resource?.entityPath}.
        <a
          data-same-tab=""
          href={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/node/${resource?.entityId}/edit`}
        >
          Edit this page in the CMS.
        </a>
      </div>
    </div>
  )
}
