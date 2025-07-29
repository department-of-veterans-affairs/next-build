import type { Metadata } from 'next'
import { ReactNode } from 'react'
import Script from 'next/script'
import { GTM_ID } from '@/lib/analytics'
import { Providers } from './providers'
import '@/assets/styles/globals.css'

export const metadata: Metadata = {
  title: 'VA.gov | Veterans Affairs',
  description: 'Official website of the U.S. Department of Veterans Affairs',
  icons: {
    icon: '/img/design/icons/favicon.ico',
    apple: [
      { url: '/img/design/icons/apple-touch-icon.png' },
      { url: '/img/design/icons/apple-touch-icon-72x72.png', sizes: '72x72' },
      { url: '/img/design/icons/apple-touch-icon-114x114.png', sizes: '114x114' },
      { url: '/img/design/icons/apple-touch-icon-152x152.png', sizes: '144x144' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || '/generated/'
  const nonce = '**CSP_NONCE**'

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

        {/* Add web components */}
        <link rel="stylesheet" href={`${ASSETS_URL}web-components.css`} />

        {/* Add polyfills */}
        <Script
          id="polyfills"
          noModule
          strategy="afterInteractive"
          src={`${ASSETS_URL}polyfills.entry.js`}
          data-nb-nonce={nonce}
        />

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
        <div id="announcement-root"></div>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
