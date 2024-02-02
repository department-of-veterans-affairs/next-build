/* eslint-disable no-console */
import fs from 'fs'
import core from '@actions/core'
import { program } from 'commander'

const DEFAULT_INPUT_FILE = 'broken-link-report.json'
const DEFAULT_OUTPUT_FILE = 'broken-links-slack-payload.json'
const GROUP_TO_NOTIFY = 'subteam^S010U41C30V|cms-helpdesk' // '<!subteam^S010U41C30V|cms-helpdesk>'
const SERVER_URL = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
const BRANCH_NAME = process.env.GITHUB_REF
const { GITHUB_WORKFLOW } = process.env

// Gather any command line options or provide defaults
program
  .version('1.0.0', '-v, --version') /* Not really necessary... */
  .option('-i, --input-file <input-file>', 'The broken link report to process', DEFAULT_INPUT_FILE)
  .option('-o, --output-file <output-file>', 'The output location of the Slack payload file', DEFAULT_OUTPUT_FILE)
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
    // Failure conditions have not been determined yet.
    const shouldFail = false
      // These are the failure conditions for content-build link checks.
      // brokenLinks.isHomepageBroken ||
      // brokenLinks.brokenLinksCount >
      //   (brokenLinks.maxBrokenLinks ?? maxBrokenLinks)
    const payload = {
      blocks: [],
    }
    const icon = shouldFail ? ':bangbang:' : ':warning:'
    const failMessage = shouldFail
      ? `*${GITHUB_WORKFLOW} has failed. Please fix this ASAP.*\n\n`
      : ''
    payload.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${icon} *<!subteam^S010U41C30V|cms-helpdesk> ${brokenLinks.metrics.brokenLinkCount} broken links found during ${GITHUB_WORKFLOW}*\n\n${failMessage}Workflow run: <${SERVER_URL}>`,
      },
    })
    let sourceIndex = 0
    let linkBlocks = []
    for (const parent of Object.keys(brokenLinks.brokenLinksByParent)) {
      const childLinks = brokenLinks.brokenLinksByParent[parent]
      let problemMarkup = childLinks.map(brokenLink => {
        const destination =
          brokenLink.url.substring(0, 1) === '/'
            ? `https://va.gov${brokenLink.url}`
            : brokenLink.url
        return `*Broken link (error type: ${brokenLink.status}):* ${destination}`
      })
      // If there are more than 5, print 5 and a generic message.
      if (problemMarkup.length > 5) {
        problemMarkup = problemMarkup.slice(0, 5)
        problemMarkup[5] =
          'There are too many broken links on this page to display. Please view the source page.'
      }
      let message = `*Source ${sourceIndex + 1}: ${parent} *\n${problemMarkup.join(
        '\n',
      )}\n\n`
      // If the message is still too long to safely pass, replace the message with a generic.
      // Truncating may break HTML structures or Markdown blocks.
      if (message.length > 2950) {
        message = `*Source ${sourceIndex +
          1}: ${destination} *\nThere are too many broken links to display. Please correct the source page.`
      }
      sourceIndex++
      linkBlocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message,
        },
      })
    }
    const blocksWithDividers = []
    for (let i = 0; i < linkBlocks.length; i += 1) {
      blocksWithDividers.push({
        type: 'divider',
      })
      blocksWithDividers.push(linkBlocks[i])
    }

    payload.blocks = [...payload.blocks, ...blocksWithDividers]
    // Slack's API has a limit of 50 blocks, so limit the number of blocks and
    // splice in a message directing the user to the workflow.
    if (payload.blocks.length > 50) {
      payload.blocks = payload.blocks.slice(0, 49)
      const truncateWarning = {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            'The list is too long to display in its entirety. Please visit the workflow run link above to see the full list.',
        },
      }
      payload.blocks.splice(1, 0, truncateWarning)
    }
    const json = JSON.stringify(payload)
    fs.writeFile(options.outputFile, json, (err) => {
      if (err) {
        console.error(err)
      }
    })
    // console.log(
    //   `${brokenLinks.brokenLinksCount} broken links found. \n ${brokenLinks.summary}`,
    // )
    // core.setOutput('SLACK_BLOCKS', `${JSON.stringify(payload)}`)
    // core.setOutput('BROKEN_LINK_COUNT', brokenLinks.brokenLinksCount)

    // if (!IS_PROD_BRANCH && !contentOnlyBuild) {
    //   // Ignore the results of the broken link checker unless
    //   // we are running either on the main branch or during
    //   // a Content Release. This way, if there is a broken link,
    //   // feature branches aren't affected, so VFS teams can
    //   // continue merging.
    //   return
    // }

    /*
    * Only emit this variable if ran against main branch or during Content Release.
    * Meets the following condition: blocks & attachments & IS_PROD_BRANCH
    */
  //   core.setOutput('UPLOAD_AND_NOTIFY', '1')
  //   if (shouldFail) {
  //     throw new Error('Broken links found')
  //   }
  // } else {
  //   console.log('No broken links found!')
  //   core.setOutput('UPLOAD_AND_NOTIFY', '0')
  //   core.setOutput('BROKEN_LINK_COUNT', 0)
  // }
  }
}


createBrokenLinksSlackPayload();

