import { GetServerSidePropsContext, GetStaticPropsContext } from 'next'
import { drupalClient } from '@/lib/utils/drupalClient'
import { LayoutProps } from 'templates/layout'

type GlobalElements = LayoutProps

// This is a helper function to fetch global elements for layout.
// This is going to be run for every pages on build.
// To make this fast, you could cache the results example on Redis.
export async function getGlobalElements(
  context: GetStaticPropsContext | GetServerSidePropsContext
): Promise<GlobalElements> {
  // global context
  const slug = await drupalClient.getPathFromContext(context)
  const path = await drupalClient.translatePathFromContext(context)
  const route = `${path?.jsonapi?.entryPoint}`
  // Banner Path
  let bannerPath = `${route}/banner-alerts?item-path=${slug}`
  // check to see if we are on the homepage
  if (slug.includes('home')) {
    bannerPath = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/banner-alerts?item-path=/`
  }
  // Request Banners
  const requestBanner = await drupalClient.fetch(`${bannerPath}`)
  const bannerData = drupalClient.deserialize(await requestBanner.json())

  // // Request Footer
  // const requestFooter = await drupalClient.fetch(
  //   `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/generated/headerFooter.json`
  // )
  // const footer = await requestFooter.json()
  // const { footerData } = footer

  return {
    props: { bannerData, footerData: {} },
    // props: { bannerData, footerData },
  }
}
