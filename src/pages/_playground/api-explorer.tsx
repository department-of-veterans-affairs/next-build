import * as React from 'react'

import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '@/data/queries'

/**
 * This is a simple page used to return serialized but unformatted data for use
 * in our mocks. Ideally I would like it to become an interactive query explorer.
 */

export default function Page(props) {
  const output = JSON.stringify(props.data, null, 2)
  return <pre>{output}</pre>
}

export async function getStaticProps() {
  // We do not want this in output.
  if (process.env.NODE_ENV == 'production') {
    return {
      notFound: true,
    }
  }

  // Change this to the query you are interested in mocking:
  const params = queries.getParams('node--event_listing')
  const data = await drupalClient.getResourceCollection('node--event_listing', {
    params: params.getQueryObject(),
  })

  return {
    props: {
      data: data,
    },
  }
}
