/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'

const URLS_TXT = path.resolve('./urls.txt')
const OUT_DIR = path.resolve('./lychee-pages')
const COMBINED_JSON = path.resolve('./lychee-pages-combined.json')
const COMBINED_CSV = path.resolve('./lychee-pages-combined.csv')

// small util: make a filesystem-safe name from a URL (base64url)
function safeName(url) {
  return Buffer.from(String(url))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

if (!fs.existsSync(URLS_TXT)) {
  console.error('Missing urls.txt in repo root')
  process.exit(1)
}
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR)

// read urls and limit to SAMPLE_SIZE (default 1000)
const SAMPLE_SIZE = process.env.SAMPLE_SIZE
  ? parseInt(process.env.SAMPLE_SIZE, 10)
  : 100
const allUrls = fs.readFileSync(URLS_TXT, 'utf8').split(/\r?\n/).filter(Boolean)
const urls = allUrls.slice(0, SAMPLE_SIZE)
console.log(
  `Will scan ${urls.length} pages (first ${urls.length} of ${allUrls.length}).`
)

// run lychee per-page (sequential for reliability)
for (let i = 0; i < urls.length; i++) {
  const url = urls[i]
  const name = safeName(url)
  const outPath = path.join(OUT_DIR, `lychee-${name}.json`)
  // Run lychee and capture JSON on stdout. Write per-page file only if there are failures.
  const args = [url, '--format', 'json']
  const res = spawnSync('lychee', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  if (res.error) {
    console.warn(`lychee failed to start for ${url}:`, res.error.message)
    continue
  }

  const stdout = (res.stdout || '').toString()
  const stderr = (res.stderr || '').toString().trim()
  if (!stdout || !stdout.trim()) {
    console.warn(
      `lychee produced no JSON for ${url}. exit=${res.status}`,
      stderr ? `stderr: ${stderr}` : ''
    )
    continue
  }

  // Try to parse and only write when there are errors
  let parsed
  try {
    parsed = JSON.parse(stdout)
  } catch (e) {
    console.warn(
      `Failed to parse lychee JSON for ${url}: ${e.message}. Writing raw output for debugging.`
    )
    fs.writeFileSync(outPath, stdout, 'utf8')
    continue
  }
  const hasErrors =
    (typeof parsed.errors === 'number' && parsed.errors > 0) ||
    (parsed.error_map && Object.keys(parsed.error_map).length > 0)

  if (hasErrors) {
    // ensure the page URL is recorded inside the per-page JSON for later merging
    if (!parsed.page_url) parsed.page_url = url
    fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), 'utf8')
    console.log(`Wrote failures to ${outPath}`)
  } else {
    console.log(`No failures for ${url} — skipping file write`)
  }
}

// combine per-page outputs
const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.json'))
const combined = []
for (const f of files) {
  const p = path.join(OUT_DIR, f)
  try {
    const raw = fs.readFileSync(p, 'utf8')
    const json = JSON.parse(raw)
    // deduce page URL / title / links shape (handle .links or .error_map forms)
    let pageUrl = json.page_url || json.url || json.page || null
    let pageTitle = json.title || ''
    let links = []

    if (Array.isArray(json)) {
      // array of page objects: flatten entry.links / entry.results
      for (const entry of json) {
        if (!pageUrl && entry.url) pageUrl = entry.url
        const entryLinks = entry.links || entry.results || []
        if (Array.isArray(entryLinks)) links = links.concat(entryLinks)
      }
    } else if (json.links || json.results || json.failed) {
      links = json.links || json.results || json.failed || []
    } else if (json.error_map && typeof json.error_map === 'object') {
      // error_map: { "<page-url>": [ { url, status }, ... ] , ... }
      // prefer parsed.page_url if present; otherwise use the first key
      const keys = Object.keys(json.error_map)
      const keyToUse = pageUrl || keys[0]
      if (!pageUrl && keyToUse) pageUrl = keyToUse
      const errorEntries = []
      for (const k of keys) {
        const arr = json.error_map[k] || []
        for (const it of arr) {
          // normalize to link object shape like lychee.link entries
          errorEntries.push({
            // keep the original target URL
            url: it.url || it.target || '',
            status: it.status || it.reason || it.error || {},
            // attach the parent page that contained the link (k)
            _parent_page: k,
          })
        }
      }
      links = errorEntries
    }

    // collect broken links for this page
    const broken = []
    for (const l of links || []) {
      // determine link URL and status
      const linkUrl = l.url || l.link || l.target || ''
      // status may be an object or scalar
      let statusText = ''
      let statusCode = ''
      if (l.status) {
        if (typeof l.status === 'object') {
          statusText = l.status.text || ''
          statusCode = l.status.code || l.status.status || ''
        } else {
          statusText = String(l.status)
        }
      } else if (l.error) {
        statusText = String(l.error)
      }
      // consider non-2xx as broken
      const isBroken =
        (String(statusCode || '').length &&
          !String(statusCode).startsWith('2')) ||
        (!statusCode && statusText && !statusText.match(/^OK|^2/))
      if (isBroken) {
        broken.push({
          // prefer the explicit parent recorded by the per-page error_map; fall back to pageUrl
          page: l._parent_page || pageUrl,
          page_title: pageTitle || '',
          url: linkUrl,
          status_text: statusText || '',
          code: statusCode || '',
          final_url: l.redirected_to || l.redirectedTo || l.final || linkUrl,
          response_time_ms: l.time || l.duration || '',
          notes: l.error || l.reason || '',
          // if this row came from error_map include the exact parent page key
          parent_from_error_map: l._parent_page || undefined,
        })
      }
    }

    if (broken.length > 0) {
      // compute a sensible page value for the combined JSON:
      // prefer pageUrl, otherwise take parent_from_error_map from the first broken entry
      const pageForCombined =
        pageUrl || (broken[0] && broken[0].parent_from_error_map) || null
      combined.push({ page: pageForCombined, title: pageTitle || '', broken })
    }
  } catch (e) {
    console.warn('Failed to parse', p, e.message)
  }
}

// write combined JSON
fs.writeFileSync(
  COMBINED_JSON,
  JSON.stringify(
    { generated_at: new Date().toISOString(), pages: combined },
    null,
    2
  ),
  'utf8'
)
console.log('Wrote combined JSON:', COMBINED_JSON)

// write CSV (tab-separated)
const headers = [
  'page_title',
  'page_path',
  'link_url',
  'link_text',
  'http_status',
  'final_url',
  'response_time_ms',
  'notes',
]
const lines = [headers.join('\t')]
for (const page of combined) {
  for (const b of page.broken) {
    const row = [
      `"${String(page.title || '').replace(/"/g, '""')}"`,
      // use parent_from_error_map when present as the authoritative page path
      `"${String(b.parent_from_error_map || b.page || '').replace(/"/g, '""')}"`,
      `"${String(b.url || '').replace(/"/g, '""')}"`,
      `""`, // link_text not provided by lychee (you can augment later)
      `"${String(b.status_text || '').replace(/"/g, '""')}"`,
      `"${String(b.final_url || '').replace(/"/g, '""')}"`,
      `"${String(b.response_time_ms || '').replace(/"/g, '""')}"`,
      `"${String(b.notes || '').replace(/"/g, '""')}"`,
    ]
    lines.push(row.join('\t'))
  }
}
fs.writeFileSync(COMBINED_CSV, lines.join('\n'), 'utf8')
console.log('Wrote CSV:', COMBINED_CSV)

console.log('Done.')
