/**
 * Next Build content release log script
 *
 * - Fetches workflow runs within a specified date range
 * - Analyzes logs for common CMS failure patterns
 * - Outputs results to both console and CSV
 * - Handles paginated GitHub API responses
 * - Supports workflow log downloads and ZIP extraction
 *
 * Prerequisites:
 * - Node
 * - GitHub Personal Access Token with permissions
 * - Environment variable GITHUB_TOKEN set with your GitHub token
 * - adm-zip - npm install adm-zip --no-save --legacy-peer-deps
 * - Go into scripts directory
 * - Depending on how far back you want to check, you may need to play around  the max-pages parameter
 *
 * Arguments:
 *   start-date: Start date in YYYY-MM-DD format
 *   end-date: End date in YYYY-MM-DD format
 *   max-pages: (Optional) Maximum number of pages to fetch (default: 3)
 *
 * Example:
 *   cd scripts
 *   export GITHUB_TOKEN=your_github_token
 *   node logNextBuildNetworkFailures.cjs 2024-01-25 2024-02-25 4
 *
 * Output:
 * - Prints a table to console showing failures
 * - Generates network-failure-report.csv in the same directory
 *
 * CSV Format:
 * Date, Run ID, Failed Requests, Run URL
 */

const https = require('https')
const fs = require('fs')
const path = require('path')
// you need to install adm-zip - npm install adm-zip --no-save --legacy-peer-deps
// Since this is only used in this script, we can install it without commiting to package.json
const AdmZip = require('adm-zip')
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const OWNER = 'department-of-veterans-affairs'
const REPO = 'next-build'
const WORKFLOW_FILE_NAME = 'content-release-prod.yml'
// Tried to find a list of possible keywords that would indicate a CMS failure
// not an exhaustive list by any means but it's a start especially with the ones in the ticket
const MATCH_PATTERNS = [
  'Failed request (Attempt 6 of 6)',
  'Failed to fetch',
  'FetchError',
  'Network error',
  'Connection refused',
  'Connection reset by peer',
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'EAI_AGAIN',
  'ENOTFOUND',
  'HTTP 502',
  'HTTP 503',
  'HTTP 504',
  'CMS fetch failed',
  'Error fetching from CMS',
  'Timeout accessing Drupal',
  'getNode failed',
  'Content model fetch error',
  'Error getting entities',
]

if (!GITHUB_TOKEN) {
  console.error('Please set your GITHUB_TOKEN environment variable.')
  process.exit(1)
}

const headers = {
  'User-Agent': 'Node.js Script',
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers }, (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => resolve(JSON.parse(data)))
      })
      .on('error', reject)
  })
}

async function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers }, (res) => {
        const { statusCode, headers: resHeaders } = res
        if (statusCode === 302 && resHeaders.location) {
          // Follow redirect manually
          https
            .get(resHeaders.location, (redirectRes) => {
              const data = []
              redirectRes.on('data', (chunk) => data.push(chunk))
              redirectRes.on('end', () => resolve(Buffer.concat(data)))
            })
            .on('error', reject)
          return
        }
        if (statusCode === 404) {
          reject(new Error('HTTP 404 - Logs not found'))
          return
        }
        if (statusCode !== 200) {
          reject(new Error(`HTTP ${statusCode} - Unable to fetch logs`))
          return
        }
        const data = []
        res.on('data', (chunk) => data.push(chunk))
        res.on('end', () => resolve(Buffer.concat(data)))
      })
      .on('error', reject)
  })
}

async function getWorkflowId() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows`
  const res = await fetchJSON(url)
  const wf = res.workflows.find((w) => w.path.endsWith(WORKFLOW_FILE_NAME))
  if (!wf) throw new Error('Workflow not found.')
  return wf.id
}

const [, , startArg, endArg, maxPagesArg] = process.argv
// get the start and end date and the page limit from the command line
const START_DATE = new Date(startArg)
const END_DATE = new Date(endArg)
// again depending on how far back you want to check
// you may need to play around this
const MAX_PAGES = parseInt(maxPagesArg || '3', 10)

async function getWorkflowRuns(workflowId, maxPages = 3) {
  let allRuns = []
  let page = 1
  let done = false
  while (page <= maxPages && !done) {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${workflowId}/runs?per_page=100&page=${page}`
    const res = await fetchJSON(url)
    const runs = res.workflow_runs
    console.log(`Fetched ${runs.length} runs from page ${page}`)
    console.log(
      `First run date: ${runs[0]?.created_at}, Last run date: ${runs[runs.length - 1]?.created_at}`
    )
    for (const run of runs) {
      const runDate = new Date(run.created_at)
      if (runDate >= START_DATE && runDate < END_DATE) {
        allRuns.push(run)
      } else if (runDate < START_DATE) {
        done = true
        break
      }
    }
    if (!runs.length) break
    page++
  }
  return allRuns
}

async function checkLogsForFailure(runId) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/actions/runs/${runId}/logs`
  try {
    const buffer = await fetchBuffer(url)
    const zip = new AdmZip(buffer)
    const entries = zip.getEntries()
    for (const entry of entries) {
      const content = zip.readAsText(entry)
      const matched = MATCH_PATTERNS.filter((pattern) =>
        content.includes(pattern)
      )
      if (matched.length > 0) {
        return { hasFailure: true, matchedPatterns: matched }
      }
    }
    return { hasFailure: false, matchedPatterns: [] }
  } catch (err) {
    console.error(`Failed to read logs for run ${runId}:`, err.message)
    throw err
  }
}
// output the results to a csv file
const outputCsvPath = path.join(__dirname, 'network-failure-report.csv')
const csvHeaders = 'Date,Run ID,Failed Requests,Run URL\n'
fs.writeFileSync(outputCsvPath, csvHeaders)

// main function
;(async () => {
  try {
    const workflowId = await getWorkflowId()
    const runs = await getWorkflowRuns(workflowId, MAX_PAGES)
    console.log(
      `\n Analyzing ${runs.length} recent runs of '${WORKFLOW_FILE_NAME}'...\n`
    )
    console.log('| Date       | Run ID     | Failed Requests | Run URL |')
    console.log('|------------|------------|-----------------|---------|')
    for (const run of runs) {
      const runId = run.id
      const runUrl = run.html_url
      const date = new Date(run.created_at).toISOString().split('T')[0]
      try {
        const { hasFailure, matchedPatterns } = await checkLogsForFailure(runId)
        const flag = hasFailure ? `Yes (${matchedPatterns.join('; ')})` : 'No'
        // Write to console
        console.log(`| ${date} | ${runId} | ${flag} | ${runUrl} |`)
        // Append to CSV
        const csvLine = `"${date}","${runId}","${flag}","${runUrl}"\n`
        fs.appendFileSync(outputCsvPath, csvLine)
      } catch (err) {
        const errorFlag = 'Error reading logs'
        // Write to console
        console.log(`| ${date} | ${runId} | ${errorFlag} | ${runUrl} |`)
        // Append to CSV
        const csvLine = `"${date}","${runId}","${errorFlag}","${runUrl}"\n`
        fs.appendFileSync(outputCsvPath, csvLine)
      }
    }
  } catch (err) {
    console.error('Error:', err.message)
  }
})()
