import { queries, ParamsType } from '@/lib/drupal/queries'

export const getNestedIncludes = (
  fieldName: string,
  resourceType: ParamsType | ParamsType[]
) => {
  const resourceTypes = Array.isArray(resourceType)
    ? resourceType
    : [resourceType]

  const includedFields = resourceTypes.flatMap((resourceType) => {
    const include = queries.getParams(resourceType).getQueryObject().include
    return include ? include.split(',') : []
  })

  return fieldName
    ? [
        fieldName,
        ...includedFields.map(
          (includedField) => `${fieldName}.${includedField}`
        ),
      ]
    : includedFields
}
