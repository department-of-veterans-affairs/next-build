import React from 'react'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

export const MyResource = ({ data }) => {
  return (
    <div>
      <h2>{data.title}</h2>
      <h3>by {data.author}</h3>
      <p>{data.body}</p>
    </div>
  )
}
