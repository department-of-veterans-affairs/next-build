/* eslint-disable no-use-before-define */
import fs from 'fs'
import lighthouse from 'lighthouse'
import * as ChromeLauncher from 'chrome-launcher'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { join } = require('path')
const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

const chrome = await ChromeLauncher.launch({
  chromeFlags: [
    '--no-first-run',
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
  ],
})

var urls = [
  {
    url: 'https://dev.va.gov/detroit-health-care/events/70531',
    name: 'event_70531',
  },
  {
    url: 'https://dev.va.gov/chillicothe-health-care/events/70560/',
    name: 'event_70560',
  },
  {
    url: 'https://dev.va.gov/dayton-health-care/events/70576/',
    name: 'event_70576',
  },
  {
    url: 'https://dev.va.gov/birmingham-health-care/events/70581/',
    name: 'event_70581',
  },
  {
    url: 'https://dev.va.gov/birmingham-health-care/events/69409/',
    name: 'event_69409',
  },
  {
    url: 'https://dev.va.gov/poplar-bluff-health-care/events',
    name: 'poplar-bluff',
  },
  {
    url: 'https://dev.va.gov/sioux-falls-health-care/events',
    name: 'sioux-falls',
  },
  {
    url: 'https://dev.va.gov/altoona-health-care/events',
    name: 'altoona-health',
  },
  {
    url: 'https://dev.va.gov/coatesville-health-care/events',
    name: 'coatesville-health',
  },
  {
    url: 'https://dev.va.gov/outreach-and-events/events',
    name: 'outreach-and-events',
  },
]

async function cleanup() {
  await ChromeLauncher.killAll()
}

const options_mobile = {
  logLevel: 'info',
  output: 'html',
  //onlyCategories: ['performance'],
  port: chrome.port,
  formFactor: 'mobile',
}

fs.promises
  .mkdir(join(__dirname + '/lighthouseReports/'), { recursive: true })
  .catch(console.error) //create output dir

for (var url of urls) {
  const runnerResult = await lighthouse(url.url, options_mobile)

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report
  fs.writeFileSync(
    join(__dirname + '/lighthouseReports/' + url.name + '-mobile' + '.html'),
    reportHtml
  )
}

Promise.resolve(cleanup())

const chrome_desktop = await ChromeLauncher.launch({
  chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
})

const options_desktop = {
  logLevel: 'info',
  output: 'html',
  //onlyCategories: ['performance'],
  port: chrome_desktop.port,
  formFactor: 'mobile',
}

for (var url of urls) {
  const runnerResult = await lighthouse(url.url, options_desktop)

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report
  fs.writeFileSync(
    join(__dirname + '/lighthouseReports/' + url.name + '-desktop' + '.html'),
    reportHtml
  )
}

Promise.resolve(cleanup())
