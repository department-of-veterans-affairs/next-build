import { QueryOpts, QueryParams } from '../..'
import { queries } from '.'

type ParamOpts = QueryOpts<{
  fields: string[]
}>

export const params: QueryParams<ParamOpts> = (opts) => {
  return queries.getParams().addFields('resource', opts.fields)
}
