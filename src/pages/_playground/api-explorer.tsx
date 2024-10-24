import * as React from 'react'

import { drupalClient } from '@/lib/drupal/drupalClient'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { getNestedIncludes } from '@/lib/utils/queries'
import { PARAGRAPH_RESOURCE_TYPES, RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

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
    ...getNestedIncludes(
      'field_alert_single',
      PARAGRAPH_RESOURCE_TYPES.ALERT_SINGLE
    ),
    'field_buttons',
    'field_checklist.field_checklist_sections',
    ...getNestedIncludes(
      'field_contact_information',
      PARAGRAPH_RESOURCE_TYPES.CONTACT_INFORMATION
    ),
    'field_related_benefit_hubs',
    'field_related_information',
    ...getNestedIncludes(
      'field_tags',
      PARAGRAPH_RESOURCE_TYPES.AUDIENCE_TOPICS
    ),
  ]).addPageLimit(3)
  const data = await drupalClient.getResourceCollection('node--checklist', {
    params: params.getQueryObject(),
    withAuth: {
      clientId: process.env.DRUPAL_CLIENT_ID,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET,
    },
  })
  return {
    props: {
      data: data,
    },
  }
}
