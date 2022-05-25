import config from '../../config'

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
