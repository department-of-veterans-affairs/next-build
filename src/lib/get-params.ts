import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { FIELDS } from 'lib/constants'

export function getParams(name: string) {
  const params = new DrupalJsonApiParams()

  switch (name) {
    case 'node--q_a':
      params.addFields('node', [FIELDS])
      break
    case 'node--news_story':
      params.addInclude(['field_media', 'field_media.image', 'field_author'])
      break
    default:
      console.log(`sorry, no params for ${name}`)
  }

  return params.getQueryObject()
}
