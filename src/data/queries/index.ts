import { createQueries } from '@next-drupal/query'
import * as NewsStoryFull from './NewsStoryFull'
export const queries = createQueries({
  'node--news_story': NewsStoryFull,
})
