import { GetServerSidePropsContext, GetStaticPropsContext } from 'next'
import { drupalClient } from '@/utils/drupalClient'
import { LayoutProps } from 'components/layout'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

type GlobalElements = LayoutProps

export function getParams(name: string): DrupalJsonApiParams {
  const params = new DrupalJsonApiParams()
  if (name === 'node--story_listing') {
    return params.addInclude(['field_office'])
  }
}
// This is a helper function to fetch global elements for layout.
// This is going to be run for every pages on build.
// To make this fast, you could cache the results example on Redis.
export async function getGlobalElements(
  context: GetStaticPropsContext | GetServerSidePropsContext
): Promise<GlobalElements> {
  // build the params for the request
  const menuOpts = {
    params: getParams('node--story_listing').getQueryObject(),
    locale: context.locale,
    defaultLocale: context.defaultLocale,
  }
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
  // Request Footer
  const requestFooter = await drupalClient.fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/generated/headerFooter.json`
  )
  const footer = await requestFooter.json()
  const { footerData } = footer

  // Fetch menu items.
  const sideNavData = await drupalClient.getResourceCollectionFromContext(
    'node--story_listing',
    context,
    {
      ...menuOpts,
    }
  )

  return {
    props: { bannerData, footerData, sideNavData },
  }
}
