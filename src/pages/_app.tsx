import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import { useEffect } from 'react'
import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'
import { TAG_MANAGER_ARGS } from '@/lib/google-analytics'
import TagManager from 'react-gtm-module'
import route from 'next/dist/server/router'
import '@/styles/globals.css'

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

  useEffect(() => {
    TagManager.initialize(TAG_MANAGER_ARGS)
    defineCustomElements()
  })

  return getLayout(<Component {...pageProps} key={route} />)
}
