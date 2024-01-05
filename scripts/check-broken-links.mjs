/* eslint-disable no-console */
import { LinkChecker } from 'linkinator'
import chalk from 'chalk'
import getSitemapLocations from '../playwright/utils/getSitemapLocations.js';

// LinkChecker options.
// See: https://www.npmjs.com/package/linkinator#linkinatorcheckoptions
const OPTIONS = {
  // recurse: true, // not recursing because we check the full known sitemap
  verbosity: "error"
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
    // After a page is scanned, check out the results!
    .on('link', result => {
      process.stdout.write(LOGGER_MAP[result.state]);
      linksChecked.push(result)

      if (result.state === 'BROKEN') {
        brokenLinks.push(result)
      }
    });

  // const result = await checker.check({...OPTIONS, path: `${process.env.SITE_URL}/butler-health-care/stories/`})
  // const slim = paths.slice(0, 100)
  console.log(`Number of pages to check: ${paths.length}`)
  for (const path of paths) {
    await checker.check({...OPTIONS, path})
  }
  // paths.forEach(async path => await checker.check({...OPTIONS, path}))

  // How many links did we scan?
  console.log('')
  console.log(`Scanned total of ${linksChecked.length} links on ${pagesChecked.length} pages!`);

  // The final result will contain the list of checked links, and the pass/fail);
  console.log(`Detected ${brokenLinks.length} broken links.`);

  // if (brokenLinks.length > 0) {
  //   for (const brokenLink of brokenLinks) {
  //     console.log("");
  //     console.log(chalk.red(brokenLink.url));
  //     console.log("  ", "STATUS:", brokenLink.status);
  //     console.log("  ", "SOURCE:", new URL(brokenLink.parent).pathname);
  //   }
  // }

}

checkBrokenLinks()
