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

  const params = queries
    .getParams()
    .addPageLimit(3)
    .addInclude([
      'field_answer',
      'field_buttons',
      'field_related_benefit_hubs',
      'field_related_information',
      'field_tags.field_topics',
      'field_tags.field_audience_beneficiares',
      'field_tags.field_non_beneficiares',
    ])
  const data = await drupalClient.getResourceCollection('node--q_a', {
    params: params.getQueryObject(),
  })

  return {
    props: {
      data: data,
    },
  }
}
