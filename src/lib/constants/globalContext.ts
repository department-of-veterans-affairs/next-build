import { GetServerSidePropsContext, GetStaticPropsContext } from 'next'
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { LayoutProps } from '@/components/layout'

type GlobalElements = LayoutProps

// This is a helper function to fetch global elements for layout.
// This is going to be run for every pages on build.
// To make this fast, you could cache the results example on Redis.
export async function getGlobalElements(
  context: GetStaticPropsContext | GetServerSidePropsContext
): Promise<GlobalElements> {
  //const path = await drupalClient.translatePathFromContext(context)
  console.log(context)

  return {
    menus: [],
    blocks: [],
    taxonomy: [],
    // ...(await getParams(context)),
  }
}
