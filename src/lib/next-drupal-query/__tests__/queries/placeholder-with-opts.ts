import { QueryOpts, QueryPlaceholderData } from '../..'

type ParamOpts = QueryOpts<{
  email: string
}>

export const placeholder: QueryPlaceholderData<
  ParamOpts,
  { name: string; email: string }
> = async (opts) => {
  return {
    name: 'shadcn',
    email: opts.email,
  }
}
