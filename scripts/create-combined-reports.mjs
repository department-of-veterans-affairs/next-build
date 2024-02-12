/* eslint-disable no-console */
import fs from 'fs'
import chalk from 'chalk'

const createCombinedReports = () => {
  // List any report files.
  let combinedJson =
    {
      "metrics": {
        "initialPathCount": 0,
        "pagesScanned": 0,
        "linksChecked": 0,
        "brokenLinkCount": 0,
      },
      "brokenLinksByParent": {
      },
      "brokenLinksByLink": {
      },
    }
  const files = fs.readdirSync('.').filter((filename) => filename.match(/^broken-links-report-run.*?\.json/))
  for (let i = 0; i < files.length; i++) {
    const fileJson = JSON.parse(fs.readFileSync(files[i], 'utf8'))
    // Add together the numbers. We drop the non-numeric metrics here.
    for (const metric in fileJson.metrics) {
      if (typeof fileJson.metrics[metric] == 'number') {
        combinedJson.metrics[metric] += fileJson.metrics[metric]
      }
    }
    // Iterate over source pages and then destination, making sure to not lose
    // any data in the combination.
    for (const parentLink in fileJson.brokenLinksByParent) {
      if (!combinedJson.brokenLinksByParent[parentLink]) {
        combinedJson.brokenLinksByParent[parentLink] = []
      }
      combinedJson.brokenLinksByParent[parentLink] =
        combinedJson.brokenLinksByParent[parentLink].concat(fileJson.brokenLinksByParent[parentLink])
    }
    for (const parentLink in fileJson.brokenLinksByLink) {
      if (!combinedJson.brokenLinksByLink[parentLink]) {
        combinedJson.brokenLinksByLink[parentLink] = []
      }
      combinedJson.brokenLinksByLink[parentLink] =
        combinedJson.brokenLinksByLink[parentLink].concat(fileJson.brokenLinksByLink[parentLink])
    }
  }
  // Write finished report to file.
  fs.writeFile('broken-links-report-combined.json', JSON.stringify(combinedJson), (err) => {
    if (err) {
      console.error(err)
    }
  })

    console.log(
    `\n Combined report file written to: ${chalk.green(
      process.cwd() + '/broken-links-report-combined.json'
    )}`
  )

  let markDownReport = ''

  // Output a markdown report for easy readability.
  markDownReport += `# VA.gov broken link report\n`
  markDownReport += `Found ${combinedJson.metrics.brokenLinkCount} broken links on ${combinedJson.metrics.pagesScanned} pages.\n`
  const dateTime = new Date().toString()
  markDownReport += `Report generated: ${dateTime}\n\n`

  // First group by source page
  markDownReport += `## Broken links grouped by source page\n`
  for (const parent of Object.keys(combinedJson.brokenLinksByParent)) {
    markDownReport += `Source: ${parent}\n`
    for (const child of combinedJson.brokenLinksByParent[parent]) {
      markDownReport += `- ${child.url}, response code ${child.status}\n`
    }
    markDownReport += `\n`
  }
  markDownReport += `\n`

  // Group by broken link.
  markDownReport += `## Broken links grouped by destination\n`
  markDownReport += `Each broken link and all the pages it appears on.\n\n`
  for (const child of Object.keys(combinedJson.brokenLinksByLink)) {
    markDownReport += `Broken destination: ${child}\n`
    for (const parent of combinedJson.brokenLinksByLink[child]) {
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

  // Generate a CSV report
  let csvReport = `Parent Link, Child Link, Error Code\n`
  for (const parent of Object.keys(combinedJson.brokenLinksByParent)) {
    const sanitizedParent = parent.replace(/,/g, ',,')
    for (const child of combinedJson.brokenLinksByParent[parent]) {
      const sanitizedChildUrl = child.url.replace(/,/g, ',,')
      csvReport += `${sanitizedParent},${sanitizedChildUrl},${child.status}\n`
    }
  }

  // Write markdown report to file
  fs.writeFile('broken-links-report.csv', csvReport, (err) => {
    if (err) {
      console.error(err)
    }
  })

  console.log(
    `\n Report CSV file written to: ${chalk.green(
      process.cwd() + '/broken-links-report.csv'
    )}`
  )

}

createCombinedReports()
