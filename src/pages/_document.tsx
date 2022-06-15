import NextDocument, { Html, Main, NextScript, Head } from 'next/document'
import { GtagInit } from '@/lib/google-analytics/gtag_init'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          {/*Global site tag (gtag.js) - Google Analytics*/}
          <GtagInit />
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
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
