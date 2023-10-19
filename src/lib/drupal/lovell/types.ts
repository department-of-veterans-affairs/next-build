import { ListingPageFormattedResource } from '@/lib/drupal/listingPages'
import {
  LOVELL,
  LOVELL_RESOURCE_TYPES,
  LOVELL_BIFURCATED_RESOURCE_TYPES,
} from './constants'
import { QUERIES_MAP } from '@/data/queries'

export type LovellResourceType = (typeof LOVELL_RESOURCE_TYPES)[number]

export type LovellBifurcatedResourceType =
  (typeof LOVELL_BIFURCATED_RESOURCE_TYPES)[number]

export type LovellVariant =
  | typeof LOVELL.federal.variant
  | typeof LOVELL.tricare.variant
  | typeof LOVELL.va.variant

export type LovellChildVariant =
  | typeof LOVELL.tricare.variant
  | typeof LOVELL.va.variant

export type LovellFormattedResource = ReturnType<
  (typeof QUERIES_MAP)[(typeof LOVELL_RESOURCE_TYPES)[number]]['formatter']
>

export type LovellBifurcatedFormattedResource = ReturnType<
  (typeof QUERIES_MAP)[(typeof LOVELL_BIFURCATED_RESOURCE_TYPES)[number]]['formatter']
>

export type LovellListingPageFormattedResource = Extract<
  LovellFormattedResource,
  ListingPageFormattedResource
>

export type LovellStaticPropsContextProps = {
  isLovellVariantPage: boolean
  variant: LovellChildVariant
}

type LovellFormattedResourceProps = {
  canonicalLink?: string
  lovellVariant?: LovellChildVariant
  lovellSwitchPath?: string
}

export type LovellStaticPropsResource<T extends LovellFormattedResource> = T &
  LovellFormattedResourceProps
