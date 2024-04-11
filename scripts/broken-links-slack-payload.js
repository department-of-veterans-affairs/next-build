/* eslint-disable no-console */
import fs from 'fs'
import core from '@actions/core'
import { program } from 'commander'

const DEFAULT_INPUT_FILE = 'broken-links-report.json'
const DEFAULT_OUTPUT_FILE = 'broken-links-slack-payload.json'
const GROUP_TO_NOTIFY = 'subteam^S010U41C30V|cms-helpdesk' // '<!subteam^S010U41C30V|cms-helpdesk>'
const RUN_URL = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`

// Gather any command line options or provide defaults
program
  .version('1.0.0', '-v, --version') /* Not really necessary... */
  .option(
    '-i, --input-file <input-file>',
    'The broken link report to process',
    DEFAULT_INPUT_FILE
  )
  .option(
    '-o, --output-file <output-file>',
    'The output location of the Slack payload file',
    DEFAULT_OUTPUT_FILE
  )
  .option(
    '-m, --markdown-url <markdown-url>',
    'The URL for the markdown report artifact'
  )
  .option('-c, --csv-url <csv-url>', 'The URL for the CSV report artifact')
  .option('-d, --debug', 'Output debug information')
  .parse(process.argv)

const options = program.opts()

// Wrap up regular and debug logging and only allow if the debug flag is set.
const say = (level, ...args) => {
  if (level === 'debug' && !options.debug) {
    return
  }
  return console.log(...args)
}

// Slack expects messages as structured JSON, with limits on how long an
// individual "block" is allowed to be. This takes the output of a broken link
// report and reworks it for delivery to Slack.
const createBrokenLinksSlackPayload = () => {
  // broken links detected
  const reportPath = options.inputFile
  if (!fs.existsSync(reportPath)) {
    say('info', 'No report file was found. Stopping.')
    return
  } else {
    const brokenLinksReport = fs.readFileSync(reportPath, 'utf8')
    const brokenLinks = JSON.parse(brokenLinksReport)
    const payload = {
      blocks: [],
    }
    const icon = ':warning:'
    payload.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `
          ${icon} *Broken link check* (Workflow run: <${RUN_URL}>)\n
          *Pages scanned:* ${brokenLinks.metrics.pagesScanned}\n
          *Broken links:* *${brokenLinks.metrics.brokenLinkCount}* out of ${brokenLinks.metrics.linksChecked} checked\n\n
          *Markdown report:* ${options.markdownUrl}\n
          *CSV report:* ${options.csvUrl}\n\n
          cc: ${GROUP_TO_NOTIFY}`,
      },
    })

    const json = JSON.stringify(payload)
    fs.writeFile(options.outputFile, json, (err) => {
      if (err) {
        console.error(err)
      }
    })
  }
}

createBrokenLinksSlackPayload()
