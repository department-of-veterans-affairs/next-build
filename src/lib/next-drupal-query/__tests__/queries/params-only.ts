import { QueryParams } from '../..'
import { queries } from '.'

export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude(['field_image', 'uid'])
}
