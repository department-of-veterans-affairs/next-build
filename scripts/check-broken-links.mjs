/* eslint-disable no-console */
import { LinkChecker } from 'linkinator'
import chalk from 'chalk'
import getSitemapLocations from '../playwright/utils/getSitemapLocations.js';
import fs from 'fs'

// LinkChecker options.
// See: https://github.com/JustinBeckwith/linkinator?tab=readme-ov-file#linkinatorcheckoptions
const OPTIONS = {
  // recurse: true, // not recursing because we check the full known sitemap
  verbosity: "error",
  // Links in this array will not be checked. Will report as SKIPPED.
  linksToSkip: [
    'https://www.googletagmanager.com/',
    'https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js',
    // TODO: include the list of URLs ignored by the CMS link checker here as well
    // config/sync/node_link_report.settings.yml in va.gov-cms repo
  ]
}

// Map of states and colors to use when logging link results.
const LOGGER_MAP = {
  OK: chalk.green("."),
  BROKEN: chalk.red("!"),
  SKIPPED: chalk.yellow("?"),
};

async function checkBrokenLinks() {
  const checker = new LinkChecker();

  // Reporting arrays
  const brokenLinks = [];
  const pagesChecked = [];
  const linksChecked = []

  const paths = await getSitemapLocations(process.env.SITE_URL)

  // Set up event listeners for the link checker
  checker
    .on('pagestart', url => pagesChecked.push(url))
    // After a page is scanned, sort & report result
    .on('link', result => {
      // Prints . ? or ! for each link checked.
      process.stdout.write(LOGGER_MAP[result.state]);

      linksChecked.push(result)

      if (result.state === 'BROKEN') {
        brokenLinks.push(result)
      }
    });

  // Full array of sitemap defined URLs.
  console.log(`Number of pages to check: ${chalk.yellow(paths.length)}`)
  for (const path of paths) {
    // Where the actual link check happens, uses options defined above
    await checker.check({...OPTIONS, path})
  }

  // Slim array for debugging this script.
  // const slim = paths.slice(0, 10)
  // console.log(`Number of pages to check: ${slim.length}`)
  // for (const path of slim) {
    // Where the actual link check happens, uses options defined above
  // await checker.check({...OPTIONS, path})
  // }


  // How many links did we scan?
  console.log(`\nScanned total of ${chalk.yellow(linksChecked.length)} links on ${chalk.yellow(pagesChecked.length)} pages!`);
  console.log(`Detected ${brokenLinks.length > 0 ? chalk.red(brokenLinks.length) : chalk.green(0)} broken links.`);

  const jsonReport =
  {
    metrics: {
      domain: process.env.SITE_URL,
      pagesScanned: pagesChecked.length,
      linksChecked: linksChecked.length,
      brokenLinkCount: brokenLinks.length
    },
    brokenLinks: []
  }

  if (brokenLinks.length > 0) {
    for (const brokenLink of brokenLinks) {
      const { url, status, parent } = brokenLink
      const source = new URL(parent).pathname

      // Output which links are broken on what pages.
      console.log(`\n${chalk.red(url)}`);
      console.log("  ", "STATUS:", status);
      console.log("  ", "SOURCE:", source);

      // Trim item to just essentials for JSON output.
      jsonReport.brokenLinks.push({
        url,
        status,
        source
      })
    }
  }

  // Write finished report to file.
  const json = JSON.stringify(jsonReport)
  fs.writeFile('broken-link-report.json', json, err => {
    if (err) {
      console.error(err)
    }
  })

  return console.log(`\n Report file written to: ${chalk.green(process.cwd() + 'broken-link-report.json')}`)
}

checkBrokenLinks()
