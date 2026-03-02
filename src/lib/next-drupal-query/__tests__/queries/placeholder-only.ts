import { QueryPlaceholderData } from '../..'

export const placeholder: QueryPlaceholderData<
  null,
  { name: string }
> = async () => {
  return {
    name: 'shadcn',
  }
}
