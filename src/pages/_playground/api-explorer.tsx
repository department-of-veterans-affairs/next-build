import * as React from 'react'

import { drupalClient } from '@/lib/drupal/drupalClient'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { getNestedIncludes } from '@/lib/utils/queries'

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
  if (process.env.SSG === 'true') {
    return {
      notFound: true,
    }
  }

  const params = new DrupalJsonApiParams().addInclude([
'field_pdf_version',
  ])
  const data = await drupalClient.getResourceCollection(
    'node--press_release',
    {
      params: params.getQueryObject(),
      withAuth: {
        clientId: process.env.DRUPAL_CLIENT_ID,
        clientSecret: process.env.DRUPAL_CLIENT_SECRET,
      },
    }
  )
  return {
    props: {
      data: data,
    },
  }
}
