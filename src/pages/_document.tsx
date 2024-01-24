import { Html, Main, NextScript, Head } from 'next/document'
import { GTM_ID } from '@/lib/analytics'
import Script from 'next/script'

const Document = () => {
  const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || '/generated/'

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta charSet="utf-8" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/@department-of-veterans-affairs/formation/dist/formation.min.css"
        />
        <link
          href={`${ASSETS_URL}static-pages.css`}
          data-entry-name="static-pages.css"
          rel="stylesheet"
        />
        <link rel="stylesheet" href={`${ASSETS_URL}style.css`} />

        {/* Preconnect to google tag manager domain */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Preload main fonts */}
        <link
          rel="preload"
          href={`${ASSETS_URL}sourcesanspro-bold-webfont.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={`${ASSETS_URL}sourcesanspro-regular-webfont.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={`${ASSETS_URL}bitter-bold.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={`${ASSETS_URL}fa-solid-900.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Load Icons */}
        <link
          href="/img/design/icons/apple-touch-icon.png"
          rel="apple-touch-icon-precomposed"
        />
        <link
          href="/img/design/icons/apple-touch-icon-72x72.png"
          rel="apple-touch-icon-precomposed"
          sizes="72x72"
        />
        <link
          href="/img/design/icons/apple-touch-icon-114x114.png"
          rel="apple-touch-icon-precomposed"
          sizes="114x114"
        />
        <link
          href="/img/design/icons/apple-touch-icon-152x152.png"
          rel="apple-touch-icon-precomposed"
          sizes="144x144"
        />
        <link
          rel="shortcut icon"
          sizes="any"
          href="/img/design/icons/favicon.ico"
        />

        {/* Add web components */}
        <link rel="stylesheet" href={`${ASSETS_URL}web-components.css`} />
        <Script
          id="web-components"
          strategy="afterInteractive"
          src={`${ASSETS_URL}web-components.entry.js`}
        />

        {/* Add vendor file */}
        <Script
          id="vendor"
          strategy="afterInteractive"
          src={`${ASSETS_URL}vendor.entry.js`}
        />

        {/* Add polyfills */}
        <Script
          id="polyfills"
          noModule
          strategy="afterInteractive"
          src={`${ASSETS_URL}polyfills.entry.js`}
        />

        {/* We participate in the US government’s analytics program. See the data at analytics.usa.gov. https://github.com/digital-analytics-program/gov-wide-code */}
        <Script
          src="https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js?agency=VA"
          id="_fed_an_ua_tag"
          strategy="afterInteractive"
          async
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
