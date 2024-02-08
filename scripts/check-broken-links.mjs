/* eslint-disable no-console */
import { LinkChecker } from 'linkinator'
import chalk from 'chalk'
import {
  getSitemapLocations,
  splitPagesIntoBatches,
  getPagesSlice,
} from '../playwright/utils/getSitemapLocations.js'
import fs from 'fs'

const OPTIONS = {
  sitemapUrl: process.env.SITE_URL || 'http://www.va.gov/',
  // totalInstances is the number of instances to split work among.
  totalInstances: process.env.TOTAL_INSTANCES || 1,
  // instanceNumber is the specifc instance currently running the check.
  // In this and totalInstances case, the defaults will check the entire set.
  instanceNumber: process.env.INSTANCE_NUMBER || 1,
  // batchSize is the number of pararllel link check processes to run.
  batchSize: process.env.BATCH_SIZE || 32,
  verbose: process.env.VERBOSE || false,
  skipImageLinks: process.env.SKIP_IMAGES || false,

}

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
  linksToSkip: [
    'https://www.googletagmanager.com/',
    'https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js',
    'https://resource.digital.voice.va.gov/wdcvoice/2/onsite/embed.js',
    'www.choicehotels.com',
    'microsoft.com',
    'redroof.com',
    'motel6.com',
    // process.env.SKIP_IMAGES ? '' : null
  ],
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
      console.log(`Retrying ${retryDetails.url}, status: ${retryDetails.status}`)
    })

  // Full array of sitemap defined URLs.
  const allPaths = (await getSitemapLocations(OPTIONS.sitemapUrl))
  const paths = getPagesSlice(allPaths, OPTIONS.totalInstances, OPTIONS.instanceNumber)
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
  let showLogs = false
  let batchesComplete = false

  // Use this setTimeout loop to keep the event loop alive.
  //
  // During testing, we saw that the program would sometimes exit after the
  // batch runs without executing the code below them. This a 'clean' exit,
  // which for Node happens when the event loop empties out.
  //
  // If we could figure out why the batch runs sometimes empty the event loop
  // and thus trigger exit, this keep-alive loop wouldn't be necessary.
  // @TODO this probably needs a second time-based condition.
  function checkAndLoop() {
    if (batchesComplete === true){
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
        const newBatch = batch.slice(0,10)
        for (const path of newBatch) {
          // Where the actual link check happens, uses options defined above
          //if (showLogs) console.log(`Batch ${index}: checking ${path}`)
          try {
            await checker.check({ ...LINKCHECKER_CONFIG, path })
          }
          catch (error) {
            console.log('check error: ', error)
          }
        }
        console.log(
          chalk.yellow(`\n Batch #${counter} of ${OPTIONS.batchSize} complete.`)
        )

        counter++
        if (counter == 29) {
          showLogs = true
        }
      })
    )
  }
  catch (error) {
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

      // // Output which links are broken on what pages.
      // console.log(`\n${chalk.red(url)}`)
      // console.log('  ', 'STATUS:', status)
      // console.log('  ', 'SOURCE:', parent)

      // Group broken links by parent.
      if (parent !== undefined) {
        jsonReport.brokenLinksByParent[parent] = jsonReport.brokenLinksByParent[parent] || []
        jsonReport.brokenLinksByParent[parent].push({
          url,
          status,
        })
      }
      // Group broken links by link.
      if (url !== undefined) {
        jsonReport.brokenLinksByLink[url] = jsonReport.brokenLinksByLink[url] || []
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
}

// Run the script.
checkBrokenLinks()
