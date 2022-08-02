import { createQueries } from "@next-drupal/query"

import * as NewsStoryPage from "./NewsStoryPage"

export const queries = createQueries({
  "node--news_story": NewsStoryPage,
})
