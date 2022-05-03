import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { FIELDS } from 'lib/constants'

export function getParams(name: string) {
  const params = new DrupalJsonApiParams()

  switch (name) {
    case 'node--q_a':
      params.addFields('node', [FIELDS])
      break
    default:
      console.log(`sorry, no params for ${name}`)
  }

  return params.getQueryObject()
}
