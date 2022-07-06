import config from '../../config'
import isNil from 'lodash/isNil'

export function truncateWordsOrChar(
  str: string,
  length: number,
  truncateWords: boolean,
  suffix = '...'
) {
  if (truncateWords) {
    return str.split(' ').splice(0, length).join(' ') + suffix
  } else {
    if (str.length < length) {
      return str
    }
    return str.slice(0, length) + suffix
  }
}

export function absoluteURL(uri: string) {
  return `${config.drupalBaseUrl}${uri}`
}

export function formatDate(input: string): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function isRelative(url: string) {
  return !new RegExp('^(?:[a-z]+:)?//', 'i').test(url)
}

export function isValidData(data) {
  if (isNil(data)) {
    return false
  }
  return true
}
// Carried over from content-build do we need this? This
export const drupalToVaPath = (content) => {
  let replaced = content
  if (content) {
    replaced = content.replace(/href="(.*?)(png|jpg|jpeg|svg|gif)"/g, (img) =>
      img
        .replace('http://va-gov-cms.lndo.site/sites/default/files', '/img')
        .replace('http://dev.cms.va.gov/sites/default/files', '/img')
        .replace('http://staging.cms.va.gov/sites/default/files', '/img')
        .replace('http://prod.cms.va.gov/sites/default/files', '/img')
        .replace('https://prod.cms.va.gov/sites/default/files', '/img')
        .replace('http://cms.va.gov/sites/default/files', '/img')
        .replace('https://cms.va.gov/sites/default/files', '/img')
    )

    replaced = replaced.replace(/href="(.*?)(doc|docx|pdf|txt)"/g, (file) =>
      file
        .replace('http://va-gov-cms.lndo.site/sites/default/files', '/files')
        .replace('http://dev.cms.va.gov/sites/default/files', '/files')
        .replace('http://staging.cms.va.gov/sites/default/files', '/files')
        .replace('http://prod.cms.va.gov/sites/default/files', '/files')
        .replace('https://prod.cms.va.gov/sites/default/files', '/files')
        .replace('http://cms.va.gov/sites/default/files', '/files')
        .replace('https://cms.va.gov/sites/default/files', '/files')
    )
  }

  return replaced
}
