/* eslint-disable no-use-before-define */
import fs from 'fs'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
})
const options = {
  logLevel: 'info',
  output: 'html',
  //onlyCategories: ['performance'],
  port: chrome.port,
}

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

for (var url of urls) {
  const runnerResult = await lighthouse(url.url, options)

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report
  fs.writeFileSync(url.name + '.html', reportHtml)
}
chrome.kill()
