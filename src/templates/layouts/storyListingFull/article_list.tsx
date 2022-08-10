import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import config from '../../../../config'
import { isValidData } from '@/lib/utils/helpers'
import { NodeResourceType } from '@/types/data-types/drupal/node'

const NodeItem = ({ drupal_internal__nid, path, title }) => (
  <li id={drupal_internal__nid}>
    <Link href={`${path.alias}`} passHref>
      <a>{title}</a>
    </Link>
  </li>
)

const NoData = () => <div>No news articles found.</div>

// This is a list of story titles for testing purposes only
const StoryListOnly = () => {
  const [content, setContent] = useState(null)
  const [filter, setFilter] = useState(null)

  useEffect(() => {
    // This should point to your local Drupal instance. Alternatively, for React
    // applications embedded in a Drupal theme or module this could also be set
    // to a relative path.
    const API_ROOT = `${config.drupalBaseUrl}/jsonapi/`
    const url = `${API_ROOT}node/news_story?fields[${NodeResourceType.NewsStory}]=id,path,drupal_internal__nid,title&sort=-created&page[limit]=50`

    const headers = new Headers({
      Accept: 'application/vnd.api+json',
    })

    fetch(url, { headers })
      .then((response) => response.json())
      .then((data) => {
        if (isValidData(data)) {
          setContent(data.data)
        }
      })
      .catch((err) => console.log('There was an error accessing the API', err))
  }, [])

  return (
    <div>
      <h2>NEWS ARTICLES</h2>
      {content ? (
        <>
          <label htmlFor="filter">Type to filter:</label>
          <input
            type="text"
            name="filter"
            placeholder="Start typing ..."
            onChange={(event) => setFilter(event.target.value.toLowerCase())}
          />
          <hr />
          <ul>
            {content
              .filter((item) => {
                if (!filter) {
                  return item
                }
                if (
                  filter &&
                  item.attributes.title.toLowerCase().includes(filter)
                ) {
                  return item
                }
              })
              .map((item) => (
                <NodeItem key={item.id} {...item.attributes} />
              ))}
          </ul>
        </>
      ) : (
        <NoData />
      )}
    </div>
  )
}

export default StoryListOnly
