import NextDocument, { Html, Main, NextScript, Head } from 'next/document'
import { GTM_ID } from '@/lib/google-analytics'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="stylesheet"
            data-entry-name="style.css"
            href="https://unpkg.com/@department-of-veterans-affairs/formation/dist/formation.min.css"
          />
          <link
            rel="stylesheet"
            data-entry-name="style.css"
            href="https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/generated/style.css"
          />
        </Head>
        <body>
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
}
