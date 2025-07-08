/* eslint-disable no-console */
import { getFetcher } from 'proxy-fetcher'
import { getSitemapLocations } from '../test/getSitemapLocations.js'

const SITE_URL = process.env.SITE_URL || 'http://www.va.gov/'
const allPaths = await getSitemapLocations(SITE_URL)

const fetcher = getFetcher(SITE_URL)

const slim = allPaths.slice(0, 100)

slim.forEach(async (path) => {
  const response = await fetcher(path)

  console.log(response.status)
})
