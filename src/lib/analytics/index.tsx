import TagManager from 'react-gtm-module'
import { environments } from '@/lib/constants/environment'

export const GTM_ID = process.env.GOOGLE_TAG_MANAGER_ID
export const TAG_MANAGER_ARGS = {
  gtmId: process.env.GOOGLE_TAG_MANAGER_ID,
  auth: process.env.GOOGLE_TAG_MANAGER_AUTH,
  preview: process.env.GOOGLE_TAG_MANAGER_PREVIEW,
}

/**
 * ### Overview
 * log the pageview with its URL
 **/
export const pageview = (url) => {
  TagManager.dataLayer({
    dataLayer: {
      event: 'pageview',
      page: url,
    },
  })
}

/**
 * ### Overview
 * log specific event
 **/
export const event = (data) => {
  TagManager.dataLayer({
    dataLayer: data,
  })
}
