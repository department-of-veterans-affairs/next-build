/* eslint-disable no-console */
import { LinkChecker } from 'linkinator'
import chalk from 'chalk'
import {
  getSitemapLocations,
  splitPagesIntoSegments,
} from '../playwright/utils/getSitemapLocations.js'
import fs from 'fs'

const OPTIONS = {
  sitemapUrl: process.env.SITE_URL || 'http://www.va.gov/',
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
     // if (showLogs) console.log(`Received result for ${result.parent}`)

      linksChecked.push(result)

      // 403 errors returned to the crawler by and large work for web users.
      if (result.state === 'BROKEN' && result.status !== 403) {
        brokenLinks.push(result)
      }
    })
    .on('retry', (retryDetails) => {
      console.log(retryDetails)
    })

  // Full array of sitemap defined URLs.
  //const paths = await getSitemapLocations(OPTIONS.sitemapUrl)
  // Tiny array of paths for debugging this script.

  const sliceSize = 500
  const allPaths = (await getSitemapLocations(OPTIONS.sitemapUrl))
  const maxStart = allPaths.length - sliceSize
  const randStart = Math.floor(Math.random() * (maxStart))
  const paths = allPaths.slice(17722, 18222) //allPaths.slice(randStart, randStart + sliceSize)
  console.log(randStart, randStart + sliceSize)
  console.log(`Number of pages to check: ${chalk.yellow(paths.length)}`)

  const initialPathCount = paths.length

  // Wow! That's probably a lot of pages. Split it into batches for efficiency.
  console.log(
    `Splitting page list into ${chalk.yellow(
      OPTIONS.batchSize
    )} batches for processing.`
  )
  const batches = splitPagesIntoSegments(paths, OPTIONS.batchSize)
  // A fake counter for the illusion of sequential completion.
  let counter = 1
  let showLogs = false
  // Request each batch at once. This takes a little bit of time depending on the size
  // of the sitemap. VA.gov builds a large one.
  try {
    await Promise.all(
      batches.map(async (batch, index) => {
        for (const path of batch) {
          // Where the actual link check happens, uses options defined above
          //if (showLogs) console.log(`Batch ${index}: checking ${path}`)
          try {
            await checker.check({ ...LINKCHECKER_CONFIG, path })
          }
          catch (error) {
            console.log('check error', error)
          }
        }
        console.log(
          chalk.yellow(`\n Batch #${counter} of ${OPTIONS.batchSize} complete.`)
        )
        console.log(chalk.yellow(`\n Actual batch #: ${index}.`))

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

  let markDownReport = ''

  // Output a markdown report for easy readability.
  markDownReport += `# VA.gov broken link report\n`
  markDownReport += `Found ${jsonReport.metrics.brokenLinkCount} broken links on ${jsonReport.metrics.pagesScanned} pages.\n`
  const dateTime = new Date().toString()
  markDownReport += `Report generated: ${dateTime}\n\n`

  // First group by source page
  markDownReport += `## Broken links grouped by source page\n`
  for (const parent of Object.keys(jsonReport.brokenLinksByParent)) {
    markDownReport += `**Source: ${parent}**\n`
    for (const child of jsonReport.brokenLinksByParent[parent]) {
      markDownReport += `- ${child.url}, response code ${child.status}\n`
    }
    markDownReport += `\n`
  }
  markDownReport += `\n`

  // Group by broken link.
  markDownReport += `## Broken links grouped by destination\n`
  markDownReport += `Each broken link and all the pages it appears on.\n\n`
  for (const child of Object.keys(jsonReport.brokenLinksByLink)) {
    markDownReport += `**Broken destination: ${child}**\n`
    for (const parent of jsonReport.brokenLinksByLink[child]) {
      markDownReport += `- ${parent.parent}\n`
    }
    markDownReport += `\n`
  }

  // Write markdown report to file
  fs.writeFile('broken-links-report.md', markDownReport, (err) => {
    if (err) {
      console.error(err)
    }
  })

  console.log(
    `\n Report Markdown file written to: ${chalk.green(
      process.cwd() + '/broken-links-report.md'
    )}`
  )
}

// Run the script.
checkBrokenLinks()
