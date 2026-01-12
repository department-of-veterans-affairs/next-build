const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || '/generated/'
const nonce = '**CSP_NONCE**'

/**
 * Server component that renders polyfills script tag.
 * Using dangerouslySetInnerHTML to ensure it's included in static HTML
 * and not stripped by Next.js App Router.
 */
export function PolyfillsScript() {
  return (
    <div
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `<script id="polyfills" nomodule src="${ASSETS_URL}polyfills.entry.js" data-nb-nonce="${nonce}"><\/script>`,
      }}
    />
  )
}
