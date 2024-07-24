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
  onlyCategories: ['performance'],
  port: chrome.port,
}
const runnerResult = await lighthouse(
  'https://dev.va.gov/detroit-health-care/events/70531',
  options
)

// `.report` is the HTML report as a string
const reportHtml = runnerResult.report
fs.writeFileSync('lhreport.html', reportHtml)

chrome.kill()
