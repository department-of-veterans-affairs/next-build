import { queries, ParamsType } from '@/data/queries'

export const getNestedIncludes = (
  fieldName: string,
  resourceType: ParamsType
) => {
  const includedFields = queries
    .getParams(resourceType)
    .getQueryObject()
    .include.split(',')

  return fieldName
    ? [
        fieldName,
        ...includedFields.map(
          (includedField) => `${fieldName}.${includedField}`
        ),
      ]
    : includedFields
}
