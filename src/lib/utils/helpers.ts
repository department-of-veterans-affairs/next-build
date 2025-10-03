import isNil from 'lodash/isNil'
import { slugifyString } from './slug'

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
    timeZone: 'UTC',
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

export const numToWord = (num) => {
  if (num === 0) return 'zero'

  const belowTwenty = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ]
  const tens = [
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ]

  if (num < 20) return belowTwenty[num - 1]
  if (num < 100)
    return (
      tens[Math.floor(num / 10) - 2] +
      (num % 10 ? '-' + belowTwenty[(num % 10) - 1] : '')
    )
}

/**
 * Convert newline characters to HTML <br> tags.
 */
export const newlinesToBr = (content: string): string => {
  return content.replace(/\n/g, '<br>')
}

/**
 * Add IDs to all H2 elements in the provided HTML content if they don't have
 * an ID already.
 */
export const addH2Ids = (content: string): string => {
  return addHeadingIds(content, '2')
}

/**
 * Add IDs to all H3 elements in the provided HTML content if they don't have
 * an ID already.
 */
export const addH3Ids = (content: string): string => {
  return addHeadingIds(content, '3')
}

/**
 * Add IDs to all heading elements in the provided HTML content if they don't have
 * an ID already at the level specified.
 */
export const addHeadingIds = (content: string, level: string): string => {
  if (!content) return content
  const regex = new RegExp(
    `(<h${level})(?![^>]*\\sid=)([^>]*>)(.*?)(</h${level}>)`,
    'gi'
  )
  return content.replace(
    regex,
    (match, openTag, attributes, headingContent, closeTag) => {
      // Extract text content from the heading, removing HTML tags and entities
      const textContent = headingContent
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&\w+;/g, ' ') // Replace HTML entities with spaces
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()

      // Generate kebab-case ID from text content
      const id = slugifyString(textContent)

      if (!id) return match // Return original if we can't generate an ID

      // Construct the new heading tag with the ID, preserving original case and structure
      return `${openTag}${attributes.replace('>', ` id="${id}">`)}${headingContent}${closeTag}`
    }
  )
}

/**
 * Converts action link style defined in wysiwyg to web-component
 */
export const convertActionLinks = (content: string): string => {
  if (!content) return content
  return content.replace(
    /<a([^>]*class="[^"]*vads-c-action-link--(blue|green)[^"]*"[^>]*)>([\s\S]*?)<\/a>/gi,
    (match, attrs, color, inner) => {
      const type = color === 'blue' ? 'secondary' : 'primary'
      // Remove class attribute for either blue or green
      const newAttrs = attrs
        .replace(/class="[^"]*vads-c-action-link--(blue|green)[^"]*"/, '')
        .trim()
      // Strip HTML tags from inner to get only the text
      // Also remove any remaining angle brackets to avoid incomplete tag fragments
      const innerText = inner.replace(/<[^>]+>/g, '').replace(/[<>]/g, '').trim()
      return `<va-link-action ${newAttrs} text="${innerText}" type="${type}" />`
    }
  )
}
