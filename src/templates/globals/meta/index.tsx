import Head from 'next/head'
import { MetaTag } from '@/types/formatted/metatags'
import { parseDate, getDateParts } from '@/lib/utils/date'
import { StaticPropsResource } from '@/lib/drupal/staticProps'
import { FormattedResource } from '@/data/queries'
import { generateAbsoluteUrlFromEnv } from '@/lib/utils/environment'
import { BUILD_TYPES } from '@/lib/constants/environment'

const LastUpdated = ({ timestamp }: { timestamp: string | number }) => {
  if (timestamp) {
    const lastUpdatedDate = parseDate(timestamp)
    const dateParts = getDateParts(lastUpdatedDate)
    const month = dateParts.month?.twoDigit
    const day = dateParts.day?.twoDigit
    const year = dateParts.year?.numeric

    if (month && day && year) {
      return (
        <Head>
          <meta name="DC.Date" content={`${year}-${month}-${day}`}></meta>
        </Head>
      )
    }
  }
}

const IOSBanner = () => (
  <Head>
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
  </Head>
)

// TODO: Implement article tags
// TODO: Is this necessary? Are these ever set?
// See: https://github.com/department-of-veterans-affairs/content-build/blob/f898e20d02cbf011e6e26976de95c5d33eace1c0/src/site/includes/metatags.drupal.liquid#L58-L63C12
const ArticleTags = ({ tags }: { tags: string[] }) => <></>

const CustomTags = ({ tags }: { tags: MetaTag[] }) => (
  <Head>
    {tags.map?.(({ tag: Tag, attributes }, i) =>
      attributes.name === 'title' ? (
        <title key={i}>{attributes.content}</title>
      ) : (
        <Tag key={i} {...attributes} />
      )
    )}
  </Head>
)

// TODO: Implement default meta tags when no custom tags are present
// TODO: Is this necessary? Are there content types where custom meta tags are not set?
// See: https://github.com/department-of-veterans-affairs/content-build/blob/f898e20d02cbf011e6e26976de95c5d33eace1c0/src/site/includes/metatags.drupal.liquid#L88-L146
const DefaultTags = ({
  resource,
}: {
  resource: StaticPropsResource<FormattedResource>
}) => <></>

export const Meta = ({
  resource,
}: {
  resource: StaticPropsResource<FormattedResource>
}) => {
  const noIndex = process.env.NEXT_PUBLIC_BUILD_TYPE !== BUILD_TYPES.PROD
  const canonicalLink =
    'canonicalLink' in resource ? resource.canonicalLink : resource.entityPath

  // TODO: pass this value when we have it present in future content types
  const lastUpdated = null

  // TODO: calculate when to show iOS banner
  // See: https://github.com/department-of-veterans-affairs/content-build/blob/f898e20d02cbf011e6e26976de95c5d33eace1c0/src/site/filters/liquid.js#L1741-L1756
  const showIOSBanner = false

  return (
    <>
      <Head>
        {noIndex && <meta name="robots" content="noindex" />}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="canonical"
          href={generateAbsoluteUrlFromEnv(canonicalLink)}
        />
        <meta
          property="og:url"
          content={generateAbsoluteUrlFromEnv(resource.entityPath)}
        />
        <meta property="og:type" content="website" />
      </Head>

      {lastUpdated && <LastUpdated timestamp={lastUpdated} />}
      {showIOSBanner && <IOSBanner />}
      <ArticleTags tags={null} />

      {resource.metatags?.length > 0 ? (
        <CustomTags tags={resource.metatags} />
      ) : (
        <DefaultTags resource={resource} />
      )}
    </>
  )
}
