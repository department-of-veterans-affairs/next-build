import isNil from 'lodash/isNil'

export function truncateWordsOrChar(
  str: string,
  length: number,
  truncateWords: boolean,
  suffix = '...'
) {
  if (truncateWords) {
    const words = str.split(' ')
    if (words.length <= length) {
      return str
    }
    return words.splice(0, length).join(' ') + suffix
  } else {
    if (str.length <= length) {
      return str
    }
    return str.slice(0, length) + suffix
  }
}

// used to get a base url path of a health care region from entityUrl.path
export function regionBaseURL(path: string) {
  if (!path) return
  return path.split('/')[1]
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

export const phoneLinks = (data) => {
  // Change phone to tap to dial.
  const replacePattern =
    /\(?(\d{3})\)?[- ]?(\d{3}-\d{4})(?!([^<]*>)|(((?!<a).)*<\/a>))/g
  if (data) {
    return data.replace(
      replacePattern,
      '<a target="_blank" href="tel:$1-$2">$1-$2</a>'
    )
  }
  return data
}

export const drupalToVaPath = (content) => {
  let replaced = content
  if (content) {
    replaced = content.replace(/href="(.*?)(png|jpg|jpeg|svg|gif)"/g, (img) =>
      img
        .replace(
          /https?:\/\/(test\.)?((dev\.|staging\.|prod\.)?cms\.)?va\.gov\/sites\/default\/files/,
          '/img'
        )
        .replace('http://va-gov-cms.ddev.site/sites/default/files', '/img')
        .replace('https://va-gov-cms.ddev.site/sites/default/files', '/img')
    )

    replaced = replaced.replace(/href="(.*?)(doc|docx|pdf|txt)"/g, (file) =>
      file
        .replace(
          /https?:\/\/(test\.)?((dev\.|staging\.|prod\.)?cms\.)?va\.gov\/sites\/default\/files/,
          '/files'
        )
        .replace('http://va-gov-cms.ddev.site/sites/default/files', '/files')
        .replace('https://va-gov-cms.ddev.site/sites/default/files', '/files')
    )
  }

  return replaced
}

export const toString = (text) => {
  return text === null || typeof text === 'undefined' ? '' : String(text)
}

export const escape = (input) => {
  return toString(input)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Returns an object that conditionally includes attrKey
 * for passing to a JSX element
 *
 * E.g.
 * <input {...conditionalAttr(!editable, 'readonly')} />
 *   If (editable): <input />
 *   Else: <input readonly />
 *
 * <my-custom-element {...conditionalAttr(includeCustomProp, 'custom-prop', 'custom-value')} />
 *   If (includeCustomProp): <my-custom-element custom-prop="custom-value" />
 *   Else: <my-custom-element />
 */
export const conditionalAttr = (
  condition: boolean | (() => boolean),
  attrKey,
  attrValue: string | boolean = ''
) => {
  const includeAttr = typeof condition === 'function' ? condition() : condition
  return includeAttr
    ? {
        [attrKey]: attrValue,
      }
    : {}
}
