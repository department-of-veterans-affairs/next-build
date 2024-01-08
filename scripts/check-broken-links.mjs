/* eslint-disable no-console */
import { LinkChecker } from 'linkinator'
import chalk from 'chalk'
import {
  getSitemapLocations,
  splitPagesIntoSegments,
} from '../playwright/utils/getSitemapLocations.js'
import fs from 'fs'

// # of batches to parallelize checking of full sitemap.
const BATCH_SIZE = process.env.BATCH_SIZE || 20

// Map of states and colors to use when logging link results.
const LOGGER_MAP = {
  OK: chalk.green('.'),
  BROKEN: chalk.red('!'),
  SKIPPED: chalk.yellow('?'),
}

// LinkChecker options.
// See: https://github.com/JustinBeckwith/linkinator?tab=readme-ov-file#linkinatorcheckoptions
const OPTIONS = {
  // Links in this array will not be checked. Will report as SKIPPED.
  linksToSkip: [
    'https://www.googletagmanager.com/',
    'https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js',
    // TODO: include the list of URLs ignored by the CMS link checker here as well
    // config/sync/node_link_report.settings.yml in va.gov-cms repo
  ],
  timeout: 5000, // Fail a link if it doesn't resolve within 5s, otherwise linkinator will hang until it resolves.
  urlRewriteExpressions: [
    // { pattern: '', replacement: '' }
  ],
  // recurse: true, // not recursing because we check the full known sitemap
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
 * <repo root>/broken-link-report.json
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
      // Prints . ? or ! for each link checked.
      process.stdout.write(LOGGER_MAP[result.state])

      linksChecked.push(result)

      if (result.state === 'BROKEN') {
        brokenLinks.push(result)
      }
    })

  // Full array of sitemap defined URLs.
  const paths = await getSitemapLocations(process.env.SITE_URL)
  console.log(`Number of pages to check: ${chalk.yellow(paths.length)}`)

  // Wow! That's probably a lot of pages. Split it into batches for efficiency.
  console.log(
    `Splitting page list into ${chalk.yellow(
      BATCH_SIZE
    )} batches for processing.`
  )
  const batches = splitPagesIntoSegments(paths, BATCH_SIZE)

  // Request each batch at once. This takes a little bit of time depending on the size
  // of the sitemap. VA.gov builds a large one.
  await Promise.all(
    batches.map(async (batch, i) => {
      for (const path of batch) {
        // Where the actual link check happens, uses options defined above
        await checker.check({ ...OPTIONS, path })
      }
      console.log(chalk.yellow(`Batch #${i + 1} of ${BATCH_SIZE} complete.`))
    })
  )

  // Tiny array of paths for debugging this script.
  // const slim = paths.slice(0, 10)
  // console.log(`Smaller number of pages to check: ${slim.length}`)
  // for (const path of slim) {
  //   await checker.check({...OPTIONS, path})
  // }

  const end = Date.now()

  const time = new Date(end - start)
  const parts = [time.getMinutes(), time.getSeconds()]
  const formattedTime = parts.map((s) => String(s).padStart(2, '0')).join(':')

  // How many links did we scan?
  console.log(`\n All batches complete in ${chalk.yellow(formattedTime)}!`)
  console.log(
    `Scanned total of ${chalk.yellow(
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
      domain: process.env.SITE_URL,
      pagesScanned: pagesChecked.length,
      linksChecked: linksChecked.length,
      brokenLinkCount: brokenLinks.length,
      time: formattedTime,
    },
    brokenLinks: [],
  }

  if (brokenLinks.length > 0) {
    for (const brokenLink of brokenLinks) {
      const { url, status, parent } = brokenLink
      const source = new URL(parent).pathname

      // Output which links are broken on what pages.
      console.log(`\n${chalk.red(url)}`)
      console.log('  ', 'STATUS:', status)
      console.log('  ', 'SOURCE:', source)

      // Trim item to just essentials for JSON output.
      jsonReport.brokenLinks.push({
        url,
        status,
        source,
      })
    }
  }

  // Write finished report to file.
  const json = JSON.stringify(jsonReport)
  fs.writeFile('broken-link-report.json', json, (err) => {
    if (err) {
      console.error(err)
    }
  })

  return console.log(
    `\n Report file written to: ${chalk.green(
      process.cwd() + 'broken-link-report.json'
    )}`
  )
}

// Run the script.
checkBrokenLinks()
