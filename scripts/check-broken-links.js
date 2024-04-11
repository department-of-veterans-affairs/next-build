/* eslint-disable no-console */
import { LinkChecker } from 'linkinator'
import chalk from 'chalk'
import {
  getSitemapLocations,
  splitPagesIntoBatches,
  getPagesSlice,
} from '../test/getSitemapLocations.js'
import fs from 'fs'

const OPTIONS = {
  sitemapUrl: process.env.SITE_URL || 'http://www.va.gov/',
  // totalInstances is the number of instances to split work among.
  totalInstances: process.env.TOTAL_INSTANCES || 1,
  // instanceNumber is the specifc instance currently running the check.
  // In this and totalInstances case, the defaults will check the entire set.
  instanceNumber: process.env.INSTANCE_NUMBER || 1,
  // batchSize is the number of pararllel link check processes to run.
  batchSize: process.env.BATCH_SIZE || 20,
  verbose: process.env.VERBOSE || false,
}

// List of patterns to skip checking. Most of these are to avoid false positives
// from servers that disallow bot traffic like ours.
// These can be regular expressions; no quotes around them in that case.
const LINKS_TO_SKIP = [
  'www.googletagmanager.com',
  'dap.digitalgov.gov/Universal-Federated-Analytics-Min.js',
  'resource.digital.voice.va.gov',
  'www.choicehotels.com',
  'microsoft.com',
  'redroof.com',
  'motel6.com',
  'vetcenter.va.gov',
  /visn\d+.*?\.va\.gov/,
  'instagram.com',
  'caregiver.va.gov',
  'desertpacific.va.gov',
  'ptsd.va.gov',
  'exclusions.oig.hhs.gov',
  'patientportal.myhealth.va.gov',
  'prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com',
  's3-us-gov-west-1.amazonaws.com/content.www.va.gov',
  'va-ams.intelliworxit.com',
  'epilepsy.va.gov',
  'sciencedirect.com',
  'twitter.com',
  'volunteer.va.gov',
  'womenshealth.va.gov',
  'oefoif.va.gov',
  'sci.va.gov',
  'southeast.va.gov',
  'va.gov/Geriatrics',
  'va.gov/wholehealth',
  'warrelatedillness.va.gov',
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

      // 403 errors returned to the crawler by and large work for web users.
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
  const paths = getPagesSlice(
    allPaths,
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
