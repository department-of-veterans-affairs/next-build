import { MetaTag } from '@/types/formatted/metatags'
import { parseDate, getDateParts } from '@/lib/utils/date'
import { capitalizeWords } from '@/lib/utils/capitalizeWords'
import { generateAbsoluteUrlFromEnv } from '@/lib/utils/environment'
import { BUILD_TYPES } from '@/lib/constants/environment'

const LastUpdatedTag = ({ timestamp }: { timestamp: string | number }) => {
  if (timestamp) {
    const lastUpdatedDate = parseDate(timestamp)
    if (lastUpdatedDate) {
      const dateParts = getDateParts(lastUpdatedDate)
      const month = dateParts?.month?.twoDigit
      const day = dateParts?.day?.twoDigit
      const year = dateParts?.year?.numeric

      if (month && day && year) {
        return <meta name="DC.Date" content={`${year}-${month}-${day}`}></meta>
      }
    }
  }
  return null
}

const IOSBannerTags = () => (
  <>
    <meta name="apple-itunes-app" content="app-id=1559609596" />
    <meta
      name="smartbanner:exclude-user-agent-regex"
      content="^.*(Version).*Safari"
    />
    <meta name="smartbanner:title" content="VA: Health and Benefits" />
    <meta name="smartbanner:author" content="US Dept. of Veteran Affairs" />
    <meta name="smartbanner:price" content=" " />
    <meta name="smartbanner:price-suffix-apple" content=" " />
    <meta name="smartbanner:price-suffix-google" content=" " />
    <meta
      name="smartbanner:icon-apple"
      content="https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/cb/43/1f/cb431fa1-b110-805f-251d-2fbb68babb1a/AppIcon-1x_U007emarketing-0-7-0-85-220.png/230x0w.webp"
    />
    <meta
      name="smartbanner:icon-google"
      content="https://play-lh.googleusercontent.com/pxpOEzV8odLxElJtNrPhorM48TPh6p-RnTWqwvlhetuMM3lZuGmbXP2_4YHlQ-fCOA=w240-h480-rw"
    />
    <meta name="smartbanner:button" content="VIEW" />
    <meta
      name="smartbanner:button-url-apple"
      content="https://apps.apple.com/us/app/va-health-and-benefits/id1559609596"
    />
    <meta
      name="smartbanner:button-url-google"
      content="https://play.google.com/store/apps/details?id=gov.va.mobileapp&hl=en_US&gl=US&pli=1"
    />
    <meta name="smartbanner:enabled-platforms" content="android,ios" />
    <meta name="smartbanner:close-label" content="Close" />
  </>
)

const CustomTags = ({ tags }: { tags: MetaTag[] }) =>
  tags.map?.(({ tag: Tag, attributes }, i) =>
    attributes.name === 'title' ? (
      <title key={i}>{capitalizeWords(attributes.content)}</title>
    ) : (
      <Tag key={i} {...attributes} />
    )
  )

const DefaultTags = ({ title }: { title: string }) => {
  const metaTitle = `${title} | Veterans Affairs`

  return (
    <>
      <meta property="og:site_name" content="Veterans Affairs" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:image" content="/img/design/logo/va-og-image.png" />
      <meta
        property="og:image:alt"
        content="U.S. Department of Veterans Affairs logo"
      />

      <meta name="twitter:site" content="@DeptVetAffairs" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:card" content="Summary" />
      <meta
        name="twitter:image"
        content="/img/design/logo/va-og-twitter-image.png"
      />
      <meta
        name="twitter:image:alt"
        content="U.S. Department of Veterans Affairs logo"
      />

      <title>{metaTitle}</title>
    </>
  )
}

interface PseudoResource {
  title: string
  entityPath?: string
  lastUpdated: string
  metatags?: MetaTag[]
  canonicalLink?: string
}

export const Meta = ({ resource }: { resource: PseudoResource }) => {
  const noIndex = process.env.NEXT_PUBLIC_BUILD_TYPE !== BUILD_TYPES.PROD
  const canonicalLink =
    'canonicalLink' in resource ? resource.canonicalLink : resource.entityPath

  const lastUpdated = resource.lastUpdated
  const entityPath = resource.entityPath || '/'

  const urlsForBanner = [
    // For testing purposes you can uncomment this following route.
    // '/central-iowa-health-care/events/52265',
    '/health-care/refill-track-prescriptions',
    '/health-care/secure-messaging',
    '/health-care/get-medical-records',
    '/disability/view-disability-rating',
    '/claim-or-appeal-status',
    '/disability/upload-supporting-evidence',
    '/records/download-va-letters',
    '/va-payment-history',
    '/change-direct-deposit',
  ]
  const showIOSBanner = urlsForBanner.includes(entityPath)

  return (
    <>
      {noIndex && <meta name="robots" content="noindex" />}
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {canonicalLink && (
        <link
          rel="canonical"
          href={generateAbsoluteUrlFromEnv(canonicalLink)}
        />
      )}
      <meta
        property="og:url"
        content={generateAbsoluteUrlFromEnv(entityPath)}
      />
      <meta property="og:type" content="website" />

      {lastUpdated && <LastUpdatedTag timestamp={lastUpdated} />}
      {showIOSBanner && <IOSBannerTags />}

      {resource.metatags?.length > 0 ? (
        <CustomTags tags={resource.metatags} />
      ) : (
        <DefaultTags title={resource.title} />
      )}
    </>
  )
}
