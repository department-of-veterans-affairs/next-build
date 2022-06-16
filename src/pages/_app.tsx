import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import { TAG_MANAGER_ARGS, pageview } from '@/lib/google-analytics'
import '@/styles/globals.css'
import { useRouter } from 'next/router'
import route from 'next/dist/server/router'
import { useEffect } from 'react'
import TagManager from 'react-gtm-module'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export function reportWebVitals(metric: object) {
  console.log(metric)
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  const router = useRouter()
  useEffect(() => {
    TagManager.initialize(TAG_MANAGER_ARGS)

    router.events.on('routeChangeComplete', pageview)
    return () => {
      router.events.off('routeChangeComplete', pageview)
    }
  }, [router.events])

  return getLayout(
    <>
      <Component {...pageProps} key={route} />
    </>
  )
}
