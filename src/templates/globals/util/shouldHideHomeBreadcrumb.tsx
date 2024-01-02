import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

export const shouldHideHomeBreadcrumb = (resourceType) => {
  const typesToShowHomeBreadcrumb = [RESOURCE_TYPES.EVENT]

  return !typesToShowHomeBreadcrumb.includes(resourceType)
}
