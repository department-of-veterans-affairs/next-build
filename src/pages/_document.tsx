import NextDocument, { Html, Main, NextScript, Head } from 'next/document'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          {/*Global site tag (gtag.js) - Google Analytics*/}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <script
            id="gtag-init"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {page_path: window.location.pathname,
            });
          `,
            }}
          ></script>
          {/*End Google Tag Manager*/}
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
