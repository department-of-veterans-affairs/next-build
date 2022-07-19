import { GetServerSidePropsContext, GetStaticPropsContext } from 'next'
import { drupalClient } from '@/utils/drupalClient'
import { getMenu } from 'next-drupal'
import { LayoutProps } from 'components/layout'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

type GlobalElements = LayoutProps

function getParams(name: string): DrupalJsonApiParams {
  const params = new DrupalJsonApiParams()

  return params
    .addInclude(['field_office', 'field_office.field_system_menu'])
    .addFilter('field_office.field_system_menu', name)
}
// This is a helper function to fetch global elements for layout.
// This is going to be run for every pages on build.
// To make this fast, you could cache the results example on Redis.

export async function getMenus(
  context: GetStaticPropsContext | GetServerSidePropsContext
): Promise<GlobalElements> {
  // global context

  const path = await drupalClient.translatePathFromContext(context)
  const type = path?.jsonapi?.resourceName

  // build the params for the request
  const menuOpts = {
    params: getParams(type).getQueryObject(),
    locale: context.locale,
    defaultLocale: context.defaultLocale,
  }

  // fetch menu items from facility
  const { field_office: fieldOffice } =
    await drupalClient.getResourceFromContext(path, context, {
      ...menuOpts,
    })
  console.log('Field Office', fieldOffice)

  // fetch menu items from facility
  const menuType = fieldOffice?.field_system_menu?.type
  console.log('Menu Type', menuType)

  const menuId =
    fieldOffice?.field_system_menu?.resourceIdObjMeta
      ?.drupal_internal__target_id
  console.log('Menu Id', menuId)

  const menu = await drupalClient.getResource(
    menuType,
    fieldOffice?.field_system_menu.id
  )
  console.log('Menu', menu)

  // Fetch menu items.
  const mainMenu = await drupalClient.getMenu('main', menuOpts)
  const footerMenu = await drupalClient.getMenu('footer', menuOpts)

  console.log('Main Menu', mainMenu)
  console.log('Footer Menu', footerMenu)

  return {
    props: {},
  }
}
