/* eslint-disable no-console */
import fs from 'fs'
import chalk from 'chalk'
import { load } from 'cheerio'

// Fetch parent and parse anchor text.
const resolveLinkText = async (parentUrl, targetUrl) => {

  try {
    const response = await fetch(parentUrl, { timeout: 10000 })
    if (!response.ok) return ''
    const html = await response.text()
    const $ = load(html)
    // Try to find anchors whose href matches targetUrl (exact or relative)
    const normTarget = targetUrl.replace(/#.*$/, '')
    let found = ''
    $('a').each((i, el) => {
      if (found) return
      const href = $(el).attr('href') || ''
      if (!href) return
      // Normalize potential absolute/relative hrefs by comparing pathnames when possible
      if (href === targetUrl || href === normTarget) {
        found = $(el).text().trim()
        return
      }
      // Handle relative links that end with the target path
      try {
        const resolved = new URL(href, parentUrl).toString().replace(/#.*$/, '')
        if (resolved === normTarget || resolved === targetUrl) {
          found = $(el).text().trim()
          return
        }
      } catch (e) {
        // ignore invalid URLs
      }
    })
    return found
  } catch (e) {
    return ''
  }
}

const createCombinedReports = async () => {
  // List any report files.
  let combinedJson = {
    metrics: {
      initialPathCount: 0,
      pagesScanned: 0,
      linksChecked: 0,
      brokenLinkCount: 0,
    },
    brokenLinksByParent: {},
    brokenLinksByLink: {},
  }
  const files = fs
    .readdirSync('.')
    .filter((filename) => filename.match(/^broken-links-report-run.*?\.json/))
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
        combinedJson.brokenLinksByParent[parentLink].concat(
          fileJson.brokenLinksByParent[parentLink]
        )
    }
    for (const parentLink in fileJson.brokenLinksByLink) {
      if (!combinedJson.brokenLinksByLink[parentLink]) {
        combinedJson.brokenLinksByLink[parentLink] = []
      }
      combinedJson.brokenLinksByLink[parentLink] =
        combinedJson.brokenLinksByLink[parentLink].concat(
          fileJson.brokenLinksByLink[parentLink]
        )
    }
  }
  // Iterate over combinedJson to look up link text.
  for (const parentLink in combinedJson.brokenLinksByParent) {
    for (const brokenLink of combinedJson.brokenLinksByParent[parentLink]) {
      brokenLink.linkText = await resolveLinkText(
        parentLink,
        brokenLink.url
      )
    }
  }
  // Helper: safe CSV escape for a single field
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return ''
    const s = String(val)
    // If the field contains a quote, comma, or newline, wrap in double quotes and escape inner quotes
    if (/[",\n]/.test(s)) {
      return '"' + s.replace(/"/g, '""') + '"'
    }
    return s
  }

  // Write finished report to file.
  fs.writeFile(
    'broken-links-report-combined.json',
    JSON.stringify(combinedJson),
    (err) => {
      if (err) {
        console.error(err)
      }
    }
  )

  console.log(
    `\n Combined report file written to: ${chalk.green(
      process.cwd() + '/broken-links-report-combined.json'
    )}`
  )

  // Generate a CSV report with Link Text column. We'll resolve link text if available in the combined JSON entry,
  // otherwise attempt to fetch the parent page and extract the anchor text (best-effort).
  let csvReport = `Source,Broken Link,Error Code,Link Text\n`
  const parents = Object.keys(combinedJson.brokenLinksByParent)
  for (const parent of parents) {
    const items = combinedJson.brokenLinksByParent[parent]
    for (const child of items) {
      // Ensure child has link_text in combined JSON (best-effort resolution)
      if (!child.link_text) {
        // Collect promises and resolve them before writing file. To keep simple, attach a promise to the child and resolve them below.
        child._link_text_promise = resolveLinkText(parent, child.url)
      }
    }
  }

  // Resolve all promises
  const allPromises = []
  for (const parent of parents) {
    for (const child of combinedJson.brokenLinksByParent[parent]) {
      if (child._link_text_promise) {
        const p = child._link_text_promise.then((v) => {
          child.link_text = v || ''
          delete child._link_text_promise
        })
        allPromises.push(p)
      }
    }
  }

  await Promise.all(allPromises)

  for (const parent of parents) {
    const sanitizedParent = escapeCsv(parent)
    for (const child of combinedJson.brokenLinksByParent[parent]) {
      const sanitizedChildUrl = escapeCsv(child.url)
      const code = escapeCsv(child.status)
      const linkText = escapeCsv(child.link_text || '')
      csvReport += `${sanitizedParent},${sanitizedChildUrl},${code},${linkText}\n`
    }
  }

  // Write csv report to file
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

// Run the async main
;(async () => {
  await createCombinedReports()
})()
