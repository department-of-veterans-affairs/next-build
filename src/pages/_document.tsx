import { Html, Main, NextScript, Head } from 'next/document'
import { GTM_ID } from '@/lib/analytics'
import Script from 'next/script'

const Document = () => {
  const ASSETS_URL =
    process.env.NEXT_PUBLIC_ASSETS_URL ||
    'https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/generated/'

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta charSet="utf-8" />
        <link
          href={`${ASSETS_URL}static-pages.css`}
          data-entry-name="static-pages.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          data-entry-name="style.css"
          href={`${ASSETS_URL}style.css`}
        />
        {/* Loads widgets built from vets-website after data has been added to window */}
        <Script
          id="staticPages"
          strategy="afterInteractive"
          src={`${ASSETS_URL}static-pages.entry.js`}
        />
      </Head>
      <body className="merger">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
