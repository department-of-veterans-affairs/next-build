import { QueryParams } from '../..'
import { queries } from '.'

export const params: QueryParams<null> = () => {
  return queries.getParams('params-only').addPageLimit(10)
}
