/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import { spawn, spawnSync } from 'child_process'
import { load } from 'cheerio'
import { Command } from 'commander'

// --- CLI parsing (commander) with env-var fallback ---
const program = new Command()
program
  .option('-n, --sample-size <n>', 'Number of URLs to scan (use -1 for all)')
  .option('--urls-file <path>', 'Path to urls.txt (default ./urls.txt)')
  .option('--lychee-chunk-size <n>', 'Number of URLs per lychee invocation')
  .option(
    '--batch-concurrency <n>',
    'Number of parallel lychee processes to run'
  )
  .option(
    '--lychee-max-concurrency <n>',
    'Value passed to lychee --max-concurrency'
  )
  .option('--lychee-timeout <n>', 'Lychee timeout in seconds')
  .option('--lychee-retries <n>', 'Lychee max retries')
  .option(
    '--exclude <list>',
    'Comma-separated list of excludes to pass to lychee'
  )
  .option('--fail-on-lychee-error', 'Make lychee spawn/parse errors fatal')
  .option(
    '--fail-on-missing-tools',
    'Fail at startup if lychee/cheerio are missing'
  )
  .option('--parent-fetch-retries <n>', 'Retries for fetching parent HTML')
  .option(
    '--parent-fetch-retry-delay-ms <n>',
    'Base delay ms between parent fetch retries'
  )
  .option(
    '--extra-lychee-args <args...>',
    'Extra args to append to lychee invocations'
  )
  .parse(process.argv)

const opts = program.opts()

// Helper to read numeric option with fallback
function readNumber(optVal, envName, fallback) {
  if (typeof optVal !== 'undefined') return Number(optVal)
  if (process.env[envName]) return Number(process.env[envName])
  return fallback
}

const CONFIG = {
  sampleSize:
    typeof opts.sampleSize !== 'undefined'
      ? Number(opts.sampleSize)
      : process.env.SAMPLE_SIZE
        ? Number(process.env.SAMPLE_SIZE)
        : -1,
  urlsFile: opts.urlsFile || process.env.URLS_FILE || './urls.txt',
  lycheeChunkSize: readNumber(opts.lycheeChunkSize, 'LYCHEE_CHUNK_SIZE', 500),
  batchConcurrency: readNumber(opts.batchConcurrency, 'BATCH_CONCURRENCY', 3),
  lycheeMaxConc:
    opts.lycheeMaxConcurrency ||
    process.env.LYCHEE_MAX_CONCURRENCY ||
    process.env.LYCHEE_CONCURRENCY ||
    '20',
  lycheeTimeout: readNumber(opts.lycheeTimeout, 'LYCHEE_TIMEOUT', 10),
  lycheeRetries: readNumber(opts.lycheeRetries, 'LYCHEE_RETRIES', 3),
  lycheeExclude: opts.exclude || process.env.LYCHEE_EXCLUDE || null,
  failOnLycheeError:
    Boolean(opts.failOnLycheeError) ||
    Boolean(process.env.FAIL_ON_LYCHEE_ERROR),
  failOnMissingTools:
    Boolean(opts.failOnMissingTools) ||
    Boolean(process.env.FAIL_ON_MISSING_TOOLS),
  parentFetchRetries: readNumber(
    opts.parentFetchRetries,
    'PARENT_FETCH_RETRIES',
    2
  ),
  parentFetchRetryDelayMs: readNumber(
    opts.parentFetchRetryDelayMs,
    'PARENT_FETCH_RETRY_DELAY_MS',
    250
  ),
  extraLycheeArgs:
    opts.extraLycheeArgs ||
    (process.env.EXTRA_LYCHEE_ARGS
      ? process.env.EXTRA_LYCHEE_ARGS.split(' ')
      : []),
}

// Fetch parent HTML and extract anchor text.
const parentHtmlCache = new Map()
async function fetchParentHtml(url) {
  if (parentHtmlCache.has(url)) return parentHtmlCache.get(url)
  const maxRetries = Number(CONFIG.parentFetchRetries || 2)
  const retryDelayMs = Number(CONFIG.parentFetchRetryDelayMs || 250)
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, { redirect: 'follow' })
      const text = await res.text()
      parentHtmlCache.set(url, text)
      return text
    } catch (e) {
      if (attempt < maxRetries) {
        // Small backoff.
        await new Promise((r) => setTimeout(r, retryDelayMs * (attempt + 1)))
        continue
      }
      console.warn(`Failed to fetch parent HTML for ${url}:`, e.message)
      parentHtmlCache.set(url, null)
      return null
    }
  }
  // Should be unreachable.
  parentHtmlCache.set(url, null)
  return null
}

function extractAnchorTextFromHtml(html, parentUrl, targetUrl) {
  if (!html) return ''
  try {
    const $ = load(html)
    for (const a of $('a[href]').toArray()) {
      const raw = $(a).attr('href') || ''
      let resolved = raw
      try {
        resolved = new URL(raw, parentUrl).toString()
      } catch (_) {}
      if (
        resolved === targetUrl ||
        resolved.replace(/\/$/, '') === String(targetUrl).replace(/\/$/, '') ||
        String(targetUrl).includes(resolved) ||
        resolved.includes(String(targetUrl))
      ) {
        return $(a).text().trim()
      }
    }
  } catch (e) {
    console.warn(
      'cheerio parse failed in extractAnchorTextFromHtml:',
      e.message
    )
  }
  return ''
}

// Count anchors helper.
function countAnchors(html) {
  if (!html) return 0
  try {
    const $ = load(html)
    return $('a[href]').length
  } catch (e) {
    console.warn('cheerio parse failed in countAnchors:', e.message)
    // Fallback conservative guess of 0.
    return 0
  }
}

const URLS_TXT = path.resolve(CONFIG.urlsFile || './urls.txt')
const OUT_DIR = path.resolve('./lychee-pages')
const COMBINED_JSON = path.resolve('./lychee-pages-combined.json')
const COMBINED_CSV = path.resolve('./lychee-pages-combined.csv')

// Startup validation: ensure lychee is available (if not, show actionable message).
function checkLycheeAvailable() {
  try {
    const res = spawnSync('lychee', ['--version'], { stdio: 'pipe' })
    if (res.error) throw res.error
    if (res.status !== 0) {
      console.warn('lychee returned non-zero status:', res.status)
    }
    return true
  } catch (e) {
    console.error(
      'lychee binary not found or not runnable. Please install lychee on PATH or set PATH appropriately.'
    )
    return false
  }
}

// Validate cheerio at startup (fail fast).
function checkCheerio() {
  try {
    // Load should be usable; call with simple HTML to ensure no runtime error.
    const $ = load('<a href="/"></a>')
    return true
  } catch (e) {
    console.error('Cheerio did not initialize correctly:', e.message)
    return false
  }
}

// Fail early if required tools are missing (configurable).
if (process.env.CI || CONFIG.failOnMissingTools) {
  if (!checkLycheeAvailable()) process.exit(2)
  if (!checkCheerio()) process.exit(2)
}

// Lychee runtime configuration (can set LYCHEE_EXCLUDE="domain.com,other.com" env var).
const LYCHEE_CONFIG = {
  // Comma-separated in env/opts or fall back to this default list.
  exclude: CONFIG.lycheeExclude
    ? String(CONFIG.lycheeExclude)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [
        'caregiver.va.gov',
        'dap.digitalgov.gov/Universal-Federated-Analytics-Min.js',
        'desertpacific.va.gov',
        'epilepsy.va.gov',
        'exclusions.oig.hhs.gov',
        'instagram.com',
        'microsoft.com',
        'motel6.com',
        'oefoif.va.gov',
        'patientportal.myhealth.va.gov',
        'prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com',
        'ptsd.va.gov',
        'redroof.com',
        'resource.digital.voice.va.gov',
        's3-us-gov-west-1.amazonaws.com/content.www.va.gov',
        'sci.va.gov',
        'sciencedirect.com',
        'southeast.va.gov',
        'twitter.com',
        'va-ams.intelliworxit.com',
        'va.gov/Geriatrics',
        'va.gov/wholehealth',
        'vetcenter.va.gov',
        'volunteer.va.gov',
        'warrelatedillness.va.gov',
        'womenshealth.va.gov',
        'www.choicehotels.com',
        'www.googletagmanager.com',
        /visn\d+.*?\.va\.gov/,
        /fb\.(com|me|watch)/,
        /www\.facebook\.com/,
      ],
  // Optional defaults (not required for exclude-only use).
  timeout: Number(CONFIG.lycheeTimeout || 10),
  retries: Number(CONFIG.lycheeRetries || 3),
}

// Small util: make a filesystem-safe name from a URL (base64url).
function safeName(url) {
  return Buffer.from(String(url))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// CSV escape helper: escape double-quotes by doubling them (CSV-safe).
function csvEscape(value) {
  const s = String(value || '')
  const escaped = s.replace(/"/g, '""')
  // If the field contains a comma, quote, or newline, wrap it in quotes.
  if (/[",\r\n]/.test(s)) {
    return `"${escaped}"`
  }
  return escaped
}

if (!fs.existsSync(URLS_TXT)) {
  console.error('Missing urls.txt in repo root')
  process.exit(1)
}
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR)

// Empty OUT_DIR so every run starts fresh.
const entries = fs.readdirSync(OUT_DIR, { withFileTypes: true })
for (const ent of entries) {
  const full = path.join(OUT_DIR, ent.name)
  try {
    fs.rmSync(full, { recursive: true, force: true })
  } catch (e) {
    console.warn(`Failed to remove ${full}:`, e.message)
  }
}
console.log(`Cleared ${OUT_DIR} (${entries.length} items)`)

// Read urls and limit to sampleSize (default -1 = all).
const allUrls = fs.readFileSync(URLS_TXT, 'utf8').split(/\r?\n/).filter(Boolean)
const urls =
  Number(CONFIG.sampleSize) === -1
    ? allUrls
    : allUrls.slice(0, Number(CONFIG.sampleSize))
console.log(
  `Will scan ${urls.length} pages (first ${urls.length} of ${allUrls.length}).`
)
// Record start time for the whole run.
const startTime = Date.now()
console.log(`Started at ${new Date(startTime).toISOString()}`)

// Run lychee once for all URLs and let lychee handle concurrency (--max-concurrency).
// This writes per-page JSON files (always overwrites) so the existing combine/augment step can proceed unchanged.
async function runLycheeBatch(allUrlsToScan) {
  // Config: number of URLs per lychee invocation and parallel lychee processes.
  const chunkSize = Math.max(50, Number(CONFIG.lycheeChunkSize || 500))
  const batchConcurrency = Math.max(1, Number(CONFIG.batchConcurrency || 3))
  const lycheeMaxConc = CONFIG.lycheeMaxConc || CONFIG.lycheeMaxConc || '20'

  // Split into chunks.
  const chunks = []
  for (let i = 0; i < allUrlsToScan.length; i += chunkSize) {
    chunks.push(allUrlsToScan.slice(i, i + chunkSize))
  }
  console.log(
    `Running lychee in ${chunks.length} chunk(s) (chunkSize=${chunkSize}) with batch concurrency ${batchConcurrency}`
  )

  async function runChunk(chunk, idx) {
    return new Promise((resolve) => {
      // Build exclude args from config.
      const excludeArgs = []
      for (const pat of LYCHEE_CONFIG.exclude || []) {
        // Allow regex strings or plain strings.
        excludeArgs.push('--exclude', String(pat))
      }
      // Put options before inputs and use -- to separate inputs from options
      const optionArgs = [
        '--format',
        'json',
        '--max-concurrency',
        String(lycheeMaxConc),
        '--timeout',
        String(LYCHEE_CONFIG.timeout),
        '--max-retries',
        String(LYCHEE_CONFIG.retries),
        ...excludeArgs,
        ...CONFIG.extraLycheeArgs,
      ]
      const args = [...optionArgs, '--', ...chunk]
      console.log(
        `lychee chunk ${idx + 1}/${chunks.length}: ${chunk.length} urls`
      )
      const child = spawn('lychee', args, { stdio: ['ignore', 'pipe', 'pipe'] })
      let stdout = ''
      let stderr = ''
      child.stdout.on('data', (c) => {
        stdout += c.toString()
      })
      child.stderr.on('data', (c) => {
        stderr += c.toString()
      })
      child.on('error', (err) => {
        console.error(`lychee spawn error for chunk ${idx + 1}:`, err.message)
        if (CONFIG.failOnLycheeError) return resolve(Promise.reject(err))
        return resolve()
      })
      child.on('close', (code) => {
        if (!stdout || !stdout.trim()) {
          console.warn(
            `lychee chunk ${idx + 1} produced no JSON. exit=${code}`,
            stderr ? `stderr: ${stderr.trim()}` : ''
          )
          return resolve()
        }
        let parsed
        try {
          parsed = JSON.parse(stdout)
        } catch (e) {
          console.error(
            `Failed to parse lychee JSON for chunk ${idx + 1}:`,
            e.message
          )
          const debugPath = path.join(
            OUT_DIR,
            `lychee-chunk-${idx + 1}-raw.json`
          )
          fs.writeFileSync(debugPath, stdout, 'utf8')
          console.log('Wrote raw lychee output to', debugPath)
          if (CONFIG.failOnLycheeError) return resolve(Promise.reject(e))
          return resolve()
        }
        // Split results into per-page files.
        if (Array.isArray(parsed)) {
          for (const entry of parsed) {
            const pageUrl = entry.page_url || entry.url || entry.page || null
            if (!pageUrl) continue
            if (!entry.page_url) entry.page_url = pageUrl
            const name = safeName(pageUrl)
            const outPath = path.join(OUT_DIR, `lychee-${name}.json`)
            fs.writeFileSync(outPath, JSON.stringify(entry, null, 2), 'utf8')
          }
        } else {
          if (!parsed.page_url && parsed.error_map) {
            for (const k of Object.keys(parsed.error_map || {})) {
              const obj = {
                page_url: k,
                error_map: { [k]: parsed.error_map[k] },
              }
              const name = safeName(k)
              const outPath = path.join(OUT_DIR, `lychee-${name}.json`)
              fs.writeFileSync(outPath, JSON.stringify(obj, null, 2), 'utf8')
            }
          } else {
            const debugPath = path.join(OUT_DIR, `lychee-chunk-${idx + 1}.json`)
            fs.writeFileSync(debugPath, JSON.stringify(parsed, null, 2), 'utf8')
          }
        }
        console.log(`lychee chunk ${idx + 1} done`)
        resolve()
      })
    })
  }

  // Run chunks with limited concurrency using a Set to track in-flight promises.
  // We remove each promise from the set in a .finally() handler, so we always know
  // which promises are still pending.
  const running = new Set()
  for (let i = 0; i < chunks.length; i++) {
    // attach a finally that removes the promise from the set when settled
    const p = runChunk(chunks[i], i).finally(() => {
      running.delete(p)
    })
    running.add(p)

    // Throttle concurrency: wait until at least one in-flight promise settles.
    if (running.size >= batchConcurrency) {
      // Promise.race accepts an iterable of promises; convert Set -> Array
      await Promise.race(Array.from(running)).catch(() => {})
      // The settled promise's .finally() should have removed it from the set.
    }
  }

  // Wait for any remaining in-flight chunks to finish.
  if (running.size) await Promise.all(Array.from(running)).catch(() => {})
  console.log('All lychee chunks finished; per-page files written to', OUT_DIR)
}

// Combine per-page outputs (async so we can await fetchParentHtml).
;(async function combineAndAugment() {
  // Let lychee handle concurrency for all URLs.
  await runLycheeBatch(urls)

  // Metrics to include in combined report.
  const metrics = {
    initialPageCount: Array.isArray(allUrls) ? allUrls.length : 0,
    pagesScanned: 0,
    linksChecked: 0,
    brokenLinkCount: 0,
  }
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.json'))
  // PagesScanned should reflect how many pages we attempted in this run.
  // Use `urls.length` (sample size / -1 => all) — fall back to files.length if urls is not present.
  metrics.pagesScanned = Array.isArray(urls) ? urls.length : files.length
  const combined = []
  for (const f of files) {
    const p = path.join(OUT_DIR, f)
    try {
      const raw = fs.readFileSync(p, 'utf8')
      const json = JSON.parse(raw)
      // Deduce page URL / title / links shape (handle .links or .error_map forms).
      let pageUrl = json.page_url || json.url || json.page || null
      let pageTitle = json.title || ''
      let links = []

      if (Array.isArray(json)) {
        // Array of page objects: flatten entry.links / entry.results
        for (const entry of json) {
          if (!pageUrl && entry.url) pageUrl = entry.url
          const entryLinks = entry.links || entry.results || []
          if (Array.isArray(entryLinks)) links = links.concat(entryLinks)
        }
      } else if (json.links || json.results || json.failed) {
        links = json.links || json.results || json.failed || []
      } else if (json.error_map && typeof json.error_map === 'object') {
        // error_map: { "<page-url>": [ { url, status }, ... ] , ... }
        // Prefer parsed.page_url if present; otherwise use the first key.
        const keys = Object.keys(json.error_map)
        const keyToUse = pageUrl || keys[0]
        if (!pageUrl && keyToUse) pageUrl = keyToUse
        const errorEntries = []
        for (const k of keys) {
          const arr = json.error_map[k] || []
          for (const it of arr) {
            // Normalize to link object shape like lychee.link entries.
            errorEntries.push({
              // Keep the original target URL.
              url: it.url || it.target || '',
              status: it.status || it.reason || it.error || {},
              // Attach the parent page that contained the link (k).
              _parent_page: k,
            })
          }
        }
        links = errorEntries
      }

      // Collect broken links for this page.
      const broken = []
      for (const l of links || []) {
        // Determine link URL and status.
        const linkUrl = l.url || l.link || l.target || ''
        // Status may be an object or scalar.
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
        // Consider non-2xx as broken.
        const isBroken =
          (String(statusCode || '').length &&
            !String(statusCode).startsWith('2')) ||
          (!statusCode && statusText && !statusText.match(/^OK|^2/))
        if (isBroken) {
          broken.push({
            url: linkUrl,
            status_text: statusText || '',
            code: statusCode || '',
            final_url: l.redirected_to || l.redirectedTo || l.final || linkUrl,
            // If this row came from error_map, include the exact parent page key.
            parent_from_error_map: l._parent_page || undefined,
            link_text: '', // to be filled in below
          })
        }
      }

      if (broken.length > 0) {
        // Gather unique parents to minimize requests.
        const parents = {}
        for (const br of broken) {
          const parentKey = br.parent_from_error_map || pageUrl
          if (!parents[parentKey]) parents[parentKey] = []
          parents[parentKey].push(br)
        }
        for (const [parentUrlKey, rows] of Object.entries(parents)) {
          const html = await fetchParentHtml(parentUrlKey)
          if (html) {
            // Count anchors once per parent for metrics.
            const anchorCount = countAnchors(html)
            metrics.linksChecked += Number(anchorCount || 0)
            for (const r of rows) {
              const txt = extractAnchorTextFromHtml(html, parentUrlKey, r.url)
              if (txt) r.link_text = txt
            }
          } else {
            // Fallback: we at least checked the broken links we know about
            metrics.linksChecked += rows.length
          }
        }
        // Compute combined page value (prefer pageUrl, otherwise first parent_from_error_map).
        const pageForCombined =
          pageUrl || (broken[0] && broken[0].parent_from_error_map) || null
        combined.push({ page: pageForCombined, title: pageTitle || '', broken })
        // Update broken count metric.
        metrics.brokenLinkCount += broken.length
      }
    } catch (e) {
      console.warn('Failed to parse', p, e.message)
    }
  }

  // Write combined JSON.
  fs.writeFileSync(
    COMBINED_JSON,
    JSON.stringify(
      { generated_at: new Date().toISOString(), metrics, pages: combined },
      null,
      2
    ),
    'utf8'
  )
  console.log('Wrote combined JSON:', COMBINED_JSON)

  // Write CSV.
  const headers = [
    'page_path',
    'link_url',
    'link_text',
    'http_status_code',
    'http_status',
    'final_url',
  ]
  const lines = [headers.join(',')]
  for (const page of combined) {
    for (const b of page.broken) {
      const row = [
        // Use parent_from_error_map when present as the authoritative page path.
        csvEscape(b.parent_from_error_map || ''),
        csvEscape(b.url || ''),
        csvEscape(b.link_text || ''),
        csvEscape(b.code || ''),
        csvEscape(b.status_text || ''),
        csvEscape(b.final_url || ''),
      ]
      lines.push(row.join(','))
    }
  }
  fs.writeFileSync(COMBINED_CSV, lines.join('\n'), 'utf8')
  console.log('Wrote CSV:', COMBINED_CSV)
  // Log end time and duration.
  const endTime = Date.now()
  const durationMs = endTime - startTime
  console.log(`Finished at ${new Date(endTime).toISOString()}`)
  console.log(`Total duration: ${(durationMs / 1000).toFixed(1)} seconds`)
})()
