import { queries, ParamsType } from '@/data/queries'

export const getNestedIncludes = (
  fieldName: string,
  resourceType: ParamsType | ParamsType[]
) => {
  const resourceTypes = Array.isArray(resourceType)
    ? resourceType
    : [resourceType]

  const includedFields = resourceTypes.flatMap((resourceType) =>
    queries.getParams(resourceType).getQueryObject().include.split(',')
  )

  return fieldName
    ? [
        fieldName,
        ...includedFields.map(
          (includedField) => `${fieldName}.${includedField}`
        ),
      ]
    : includedFields
}
