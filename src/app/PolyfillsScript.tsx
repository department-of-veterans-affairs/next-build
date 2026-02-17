const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || '/generated/'
const nonce = '**CSP_NONCE**'

/**
 * Server component that renders polyfills script tag for legacy browsers.
 *
 * Why this component exists:
 * ===========================
 * In Next.js Pages Router (_document.tsx), using `<Script noModule>` works correctly
 * because the script tag is server-rendered directly in the HTML. The browser's native
 * `nomodule` check happens during HTML parsing, so modern browsers skip the script.
 *
 * However, in Next.js App Router (layout.tsx), `<Script>` components with
 * `strategy="afterInteractive"` are injected client-side during hydration via Next.js's
 * script loader. This bypasses the browser's native `nomodule` check, causing the
 * polyfills bundle (345 KB) to load in modern browsers even though it's not needed.
 *
 * Solution:
 * =========
 * We use `dangerouslySetInnerHTML` to inject a raw `<script nomodule>` tag directly
 * into the static HTML. This ensures:
 * 1. The script tag is server-rendered in the HTML (not injected client-side)
 * 2. The browser's native `nomodule` check applies during HTML parsing
 * 3. Modern browsers skip the script, legacy browsers load it
 * 4. The polyfills bundle is excluded from modern browsers, saving ~300 KB
 *
 * The `suppressHydrationWarning` prop prevents React hydration warnings since this
 * intentionally differs between server and client rendering.
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
