import type { ReactNode } from 'react'
import { MetaTag } from '@/types/formatted/metatags'
import { parseDate, getDateParts } from '@/lib/utils/date'
import { capitalizeWords } from '@/lib/utils/capitalizeWords'
import { generateAbsoluteUrlFromEnv } from '@/lib/utils/environment'
import { BUILD_TYPES } from '@/lib/constants/environment'

function getLastUpdatedTag(timestamp: string | number): ReactNode[] {
  if (!timestamp) return []
  const lastUpdatedDate = parseDate(timestamp)
  if (!lastUpdatedDate) return []
  const dateParts = getDateParts(lastUpdatedDate)
  const month = dateParts?.month?.twoDigit
  const day = dateParts?.day?.twoDigit
  const year = dateParts?.year?.numeric

  if (month && day && year) {
    return [
      <meta key="dc-date" name="DC.Date" content={`${year}-${month}-${day}`} />,
    ]
  }
  return []
}

function getIOSBannerTags(): ReactNode[] {
  return [
    <meta
      key="apple-itunes-app"
      name="apple-itunes-app"
      content="app-id=1559609596"
    />,
    <meta
      key="smartbanner:exclude-user-agent-regex"
      name="smartbanner:exclude-user-agent-regex"
      content="^.*(Version).*Safari"
    />,
    <meta
      key="smartbanner:title"
      name="smartbanner:title"
      content="VA: Health and Benefits"
    />,
    <meta
      key="smartbanner:author"
      name="smartbanner:author"
      content="US Dept. of Veteran Affairs"
    />,
    <meta key="smartbanner:price" name="smartbanner:price" content=" " />,
    <meta
      key="smartbanner:price-suffix-apple"
      name="smartbanner:price-suffix-apple"
      content=" "
    />,
    <meta
      key="smartbanner:price-suffix-google"
      name="smartbanner:price-suffix-google"
      content=" "
    />,
    <meta
      key="smartbanner:icon-apple"
      name="smartbanner:icon-apple"
      content="https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/cb/43/1f/cb431fa1-b110-805f-251d-2fbb68babb1a/AppIcon-1x_U007emarketing-0-7-0-85-220.png/230x0w.webp"
    />,
    <meta
      key="smartbanner:icon-google"
      name="smartbanner:icon-google"
      content="https://play-lh.googleusercontent.com/pxpOEzV8odLxElJtNrPhorM48TPh6p-RnTWqwvlhetuMM3lZuGmbXP2_4YHlQ-fCOA=w240-h480-rw"
    />,
    <meta key="smartbanner:button" name="smartbanner:button" content="VIEW" />,
    <meta
      key="smartbanner:button-url-apple"
      name="smartbanner:button-url-apple"
      content="https://apps.apple.com/us/app/va-health-and-benefits/id1559609596"
    />,
    <meta
      key="smartbanner:button-url-google"
      name="smartbanner:button-url-google"
      content="https://play.google.com/store/apps/details?id=gov.va.mobileapp&hl=en_US&gl=US&pli=1"
    />,
    <meta
      key="smartbanner:enabled-platforms"
      name="smartbanner:enabled-platforms"
      content="android,ios"
    />,
    <meta
      key="smartbanner:close-label"
      name="smartbanner:close-label"
      content="Close"
    />,
  ]
}

function getCustomTags(tags: MetaTag[]): ReactNode[] {
  return (
    tags.map?.(({ tag: Tag, attributes }, i) =>
      attributes.name === 'title' ? (
        <title key={i}>{capitalizeWords(attributes.content)}</title>
      ) : (
        <Tag key={i} {...attributes} />
      )
    ) ?? []
  )
}

function getDefaultTags(title: string): ReactNode[] {
  const metaTitle = `${title} | Veterans Affairs`

  return [
    <meta
      key="og:site_name"
      property="og:site_name"
      content="Veterans Affairs"
    />,
    <meta key="og:title" property="og:title" content={metaTitle} />,
    <meta
      key="og:image"
      property="og:image"
      content="/img/design/logo/va-og-image.png"
    />,
    <meta
      key="og:image:alt"
      property="og:image:alt"
      content="U.S. Department of Veterans Affairs logo"
    />,
    <meta key="twitter:site" name="twitter:site" content="@DeptVetAffairs" />,
    <meta key="twitter:title" name="twitter:title" content={metaTitle} />,
    <meta key="twitter:card" name="twitter:card" content="Summary" />,
    <meta
      key="twitter:image"
      name="twitter:image"
      content="/img/design/logo/va-og-twitter-image.png"
    />,
    <meta
      key="twitter:image:alt"
      name="twitter:image:alt"
      content="U.S. Department of Veterans Affairs logo"
    />,
    <title key="title">{metaTitle}</title>,
  ]
}

interface PseudoResource {
  title: string
  entityPath?: string
  lastUpdated: string
  metatags?: MetaTag[]
  canonicalLink?: string
}

export function getMetaElements(
  resource: PseudoResource,
  description?: string
): ReactNode[] {
  const elements: ReactNode[] = []
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

  if (noIndex) {
    elements.push(<meta key="robots" name="robots" content="noindex" />)
  }
  elements.push(
    <meta key="charset" charSet="utf-8" />,
    <meta
      key="x-ua-compatible"
      httpEquiv="X-UA-Compatible"
      content="IE=edge"
    />,
    <meta key="handheld-friendly" name="HandheldFriendly" content="True" />,
    <meta key="mobile-optimized" name="MobileOptimized" content="320" />,
    <meta
      key="viewport"
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
  )
  if (canonicalLink) {
    elements.push(
      <link
        key="canonical"
        rel="canonical"
        href={generateAbsoluteUrlFromEnv(canonicalLink)}
      />
    )
  }
  elements.push(
    <meta
      key="og:url"
      property="og:url"
      content={generateAbsoluteUrlFromEnv(entityPath)}
    />,
    <meta key="og:type" property="og:type" content="website" />
  )

  if (description) {
    elements.push(
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />,
      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />,
      <meta key="description" name="description" content={description} />
    )
  }

  elements.push(...getLastUpdatedTag(lastUpdated))
  if (showIOSBanner) {
    elements.push(...getIOSBannerTags())
  }

  if (resource.metatags?.length) {
    elements.push(...getCustomTags(resource.metatags))
  } else {
    elements.push(...getDefaultTags(resource.title))
  }

  return elements
}

/** Returns an array of meta/link/title elements for use as direct children of next/head */
export const Meta = ({
  resource,
  description,
}: {
  resource: PseudoResource
  description?: string
}) => getMetaElements(resource, description)
