import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import { useEffect } from 'react'
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'
import { TAG_MANAGER_ARGS, pageview } from '@/lib/analytics'
import TagManager from 'react-gtm-module'
import '@/assets/styles/globals.css'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export function reportWebVitals(metric: object) {
  // eslint-disable-next-line no-console
  console.log(metric)
}

export default function MyApp({
  Component,
  pageProps,
  router,
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  useEffect(() => {
    TagManager.initialize(TAG_MANAGER_ARGS)
    defineCustomElements()

    const handleRouteChange = (url: string) => {
      pageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return getLayout(<Component {...pageProps} key={router.asPath} />)
}
