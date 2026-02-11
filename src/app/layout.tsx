import type { Metadata } from 'next'
import Script from 'next/script'
import { GTM_ID } from '@/lib/analytics'
import '@/assets/styles/globals.css'
import { ClientMetrics } from './ClientMetrics'
import { CustomElements } from './CustomElements'
import { PolyfillsScript } from './PolyfillsScript'

const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || '/generated/'
const nonce = '**CSP_NONCE**'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://www.va.gov'
  ),
  other: {
    HandheldFriendly: 'True',
    MobileOptimized: '320',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <link
          href={`${ASSETS_URL}static-pages.css`}
          data-entry-name="static-pages.css"
          rel="stylesheet"
        />
        <link rel="stylesheet" href={`${ASSETS_URL}style.css`} />

        <Script
          id="web-components"
          strategy="beforeInteractive"
          src={`${ASSETS_URL}web-components.entry.js`}
        />

        {/* Add vendor file */}
        <Script
          id="vendor"
          strategy="beforeInteractive"
          src={`${ASSETS_URL}vendor.entry.js`}
        />

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

        {/* We participate in the US government's analytics program. See the data at analytics.usa.gov. https://github.com/digital-analytics-program/gov-wide-code */}
        <Script
          src="https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js?agency=VA"
          id="_fed_an_ua_tag"
          strategy="afterInteractive"
          data-nb-nonce={nonce}
          async
        />
      </head>
      <body className="merger">
        <PolyfillsScript />
        <div id="announcement-root"></div>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <CustomElements />
        <ClientMetrics>{children}</ClientMetrics>
      </body>
    </html>
  )
}
