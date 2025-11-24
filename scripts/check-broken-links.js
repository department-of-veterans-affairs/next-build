/* eslint-disable no-console */
import { LinkChecker } from 'linkinator'
import chalk from 'chalk'
import {
  getSitemapLocations,
  splitPagesIntoBatches,
  getPagesSlice,
} from '../test/getSitemapLocations.js'
import fs from 'fs'
import crypto from 'crypto'

const OPTIONS = {
  sitemapUrl: process.env.SITE_URL || 'http://www.va.gov/',
  // totalInstances is the number of instances to split work among.
  totalInstances: process.env.TOTAL_INSTANCES || 1,
  // instanceNumber is the specific instance currently running the check.
  // In this and totalInstances case, the defaults will check the entire set.
  instanceNumber: process.env.INSTANCE_NUMBER || 1,
  // sampleSize: -1 means all. Can be set with SAMPLE_SIZE env var.
  sampleSize: process.env.SAMPLE_SIZE ? Number(process.env.SAMPLE_SIZE) : -1,
  // batchSize is the number of parallel link check processes to run.
  batchSize: process.env.BATCH_SIZE || 20,
  verbose: process.env.VERBOSE || false,
}

// List of patterns to skip checking. Most of these are to avoid false positives
// from servers that disallow bot traffic like ours.
// These can be regular expressions; no quotes around them in that case.
const LINKS_TO_SKIP = [
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
  /^\//,
  // process.env.SKIP_IMAGES ? '' : null
]

// Map of states and colors to use when logging link results.
const LOGGER_MAP = {
  OK: chalk.green('.'),
  BROKEN: chalk.red('x'),
  SKIPPED: chalk.yellow('-'),
}

// LinkChecker options.
// See: https://github.com/JustinBeckwith/linkinator?tab=readme-ov-file#linkinatorcheckoptions
const LINKCHECKER_CONFIG = {
  // Links in this array will not be checked. Will report as SKIPPED.
  linksToSkip: LINKS_TO_SKIP,
  timeout: 10000, // Fail a link if it doesn't resolve, otherwise linkinator will hang until it resolves.
  urlRewriteExpressions: [
    // { pattern: '', replacement: '' }
  ],
  // recurse: true, // not recursing through links that are checked because we scan the full known sitemap
  retryErrors: true,
  retryErrorsCount: 3,
}

/**
 * This function tests every link on a collection of pages for a successful response.
 * The pageroutes to be tested are sourced via a site's sitemap.xml file. Indexed
 * sitemaps are OK, the full list of <loc>'s from all indexed sitemaps will be flattened.
 *
 * To run this script, use this format:
 *   $ SITE_URL=https://www.va.gov node scripts/check-broken-links.mjs
 *
 * SITE_URL can be replaced with any website url that provides a sitemap. Trailing slashes
 * are OK.
 *
 * This will output dot notation to the terminal for each link as it is checked, plus
 * a list of broken links. A JSON file with the run's metrics is also output to
 * <repo root>/broken-links-report.json
 */
async function checkBrokenLinks() {
  const start = Date.now()
  const checker = new LinkChecker()

  // Reporting arrays
  const brokenLinks = []
  const pagesChecked = []
  const linksChecked = []

  // Set up event listeners for the link checker
  checker
    .on('pagestart', (url) => pagesChecked.push(url))
    // After a page is scanned, sort & report result
    .on('link', (result) => {
      if (OPTIONS.verbose) {
        // Prints . - or x for each link checked.
        process.stdout.write(LOGGER_MAP[result.state])
      }

      linksChecked.push(result)

      // 403, 0 and blank errors returned to the crawler by and large work for web users.
      if (result.state === 'BROKEN' && result.status !== 403) {
        brokenLinks.push(result)
      }
    })
    .on('retry', (retryDetails) => {
      console.log(
        `Retrying ${retryDetails.url} ; status: ${retryDetails.status}`
      )
    })

  // Full array of sitemap defined URLs.
  const allPaths = await getSitemapLocations(OPTIONS.sitemapUrl)

  // Hash function to convert a string to a fraction between 0 and 1.
  function hashToFraction(u) {
    const h = crypto
      .createHash('sha256')
      .update(String(u))
      .digest('hex')
      .slice(0, 8)
    const v = parseInt(h, 16)
    return v / 0xffffffff
  }

  // Deterministic sampling function: given an array and a number n,
  // return a sample of n items from the array, selected deterministically
  // via hashing.
  function deterministicSampleExact(arr, n) {
    if (n <= 0 || n >= arr.length) return Array.from(arr)
    // Create array of {u, v} pairs where "u" is the item and "v" is its hash-derived fraction.
    const pairs = arr.map((u) => ({ u, v: hashToFraction(u) }))
    // Sort pairs by the hash-derived fraction.
    pairs.sort((a, b) => a.v - b.v)
    // Return the first n items from the sorted pairs.
    return pairs.slice(0, n).map((p) => p.u)
  }

  let sampledPaths = allPaths
  // Anything > -1 means sampling is enabled.
  // Otherwise we use the full set of sitemap URLs.
  if (Number(OPTIONS.sampleSize) > -1) {
    const n = Number(OPTIONS.sampleSize)
    // Sampling: take a deterministic sample of the sitemap
    // before partitioning work across instances. Deterministic sampling uses a
    // sha256-derived fraction so the same URLs are selected each run.
    sampledPaths = deterministicSampleExact(allPaths, n)
    console.log(
      `Sampling enabled: selected ${chalk.yellow(sampledPaths.length)} of ${chalk.yellow(
        allPaths.length
      )} sitemap URLs (SAMPLE_SIZE=${n})`
    )
  }

  // Partition sampled paths across instances so each instance scans a unique slice.
  const paths = getPagesSlice(
    sampledPaths,
    OPTIONS.totalInstances,
    OPTIONS.instanceNumber
  )
  console.log(`Number of pages to check: ${chalk.yellow(paths.length)}`)
  const initialPathCount = paths.length

  // Wow! That's probably a lot of pages. Split it into batches for efficiency.
  console.log(
    `Splitting page list into ${chalk.yellow(
      OPTIONS.batchSize
    )} batches for processing.`
  )
  const batches = splitPagesIntoBatches(paths, OPTIONS.batchSize)
  // A fake counter for the illusion of sequential completion.
  let counter = 1

  // Use this setTimeout loop to keep the event loop alive.
  //
  // During testing, we saw that the program would sometimes exit after the
  // batch runs without executing the code below them. This was a 'clean' exit,
  // which for Node happens when the event loop empties out.
  //
  // If we could figure out why the batch runs sometimes empty the event loop
  // and thus trigger exit, this keep-alive loop wouldn't be necessary.
  // @TODO this probably needs a second time-based condition, though GHA timeout
  // can also prevent this from sitting forever.
  let batchesComplete = false
  function checkAndLoop() {
    if (batchesComplete === true) {
      console.log('Batches complete, exiting the loop.')
    } else {
      setTimeout(checkAndLoop, 5000)
    }
  }
  checkAndLoop()

  // Request each batch at once. This takes a little bit of time depending on the size
  // of the sitemap. VA.gov builds a large one.
  try {
    await Promise.all(
      batches.map(async (batch) => {
        // truncate the batch for testing purposes
        for (const path of batch) {
          // Where the actual link check happens, uses options defined above
          //if (showLogs) console.log(`Batch ${index}: checking ${path}`)
          try {
            await checker.check({ ...LINKCHECKER_CONFIG, path })
          } catch (error) {
            console.log('check error: ', error)
          }
        }
        console.log(
          chalk.yellow(`\n Batch #${counter} of ${OPTIONS.batchSize} complete.`)
        )
        counter++
      })
    )
  } catch (error) {
    console.log(`Checking failed: `, error)
  }
  batchesComplete = true
  const end = Date.now()

  const time = new Date(end - start)
  const parts = [time.getMinutes(), time.getSeconds()]
  const formattedTime = parts.map((s) => String(s).padStart(2, '0')).join(':')

  // How many links did we scan?
  console.log(`\n All batches complete in ${chalk.yellow(formattedTime)}!`)
  console.log(
    `Of an initial ${initialPathCount} pages, scanned total of ${chalk.yellow(
      linksChecked.length
    )} links on ${chalk.yellow(pagesChecked.length)} pages!`
  )
  console.log(
    `Detected ${
      brokenLinks.length > 0 ? chalk.red(brokenLinks.length) : chalk.green(0)
    } broken links.`
  )

  const jsonReport = {
    metrics: {
      domain: OPTIONS.sitemapUrl,
      initialPathCount: initialPathCount,
      pagesScanned: pagesChecked.length,
      linksChecked: linksChecked.length,
      brokenLinkCount: brokenLinks.length,
      time: formattedTime,
    },
    brokenLinksByParent: {},
    brokenLinksByLink: {},
  }

  if (brokenLinks.length > 0) {
    for (const brokenLink of brokenLinks) {
      const { url, status, parent } = brokenLink

      // Group broken links by parent.
      if (parent !== undefined) {
        jsonReport.brokenLinksByParent[parent] =
          jsonReport.brokenLinksByParent[parent] || []
        jsonReport.brokenLinksByParent[parent].push({
          url,
          status,
        })
      }
      // Group broken links by link.
      if (url !== undefined) {
        jsonReport.brokenLinksByLink[url] =
          jsonReport.brokenLinksByLink[url] || []
        jsonReport.brokenLinksByLink[url].push({
          parent,
          status,
        })
      }
    }
  }

  // Write finished report to file.
  const json = JSON.stringify(jsonReport)
  fs.writeFile('broken-links-report.json', json, (err) => {
    if (err) {
      console.error(err)
    }
  })

  console.log(
    `\n Report file written to: ${chalk.green(
      process.cwd() + '/broken-links-report.json'
    )}`
  )
  // We are seeing situations where the node process does not stop, even if this
  // point in the script is reached. We have been unable to determine what
  // process(es) are keeping the event loop open, and why it only happens
  // in limited cases.
  // Using process.exit() here is extremely ugly and I do not like it. If you
  // see this and are moved to examine this, remove it or comment it out and see
  // if you can figure out why the node process hangs sometimes.
  // In any event, if this part of the script is reached, we are done, so
  // manually exiting is acceptable.
  setTimeout(() => process.exit(), 15000)
}

// Run the script.
checkBrokenLinks()
