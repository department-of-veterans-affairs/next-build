import { chromium } from 'playwright-core'

async function runRUMTest() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const context = await browser.newContext({
    // Simulate real user
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 },
  })

  const page = await context.newPage()

  try {
    //console.log('Starting page load...');
    const startTime = Date.now()

    // Navigate to your website
    await page.goto('https://dev.va.gov', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    // Wait for Datadog RUM to initialize
    await page.waitForTimeout(2000)

    // Scroll to trigger viewport events
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    // Check for JavaScript errors (these show up in RUM)
    const errors = await page.evaluate(() => {
      return window.errors || []
    })

    if (errors.length > 0) {
      //console.log('JavaScript errors detected:', errors);
    }

    const endTime = Date.now()
    //console.log(`Page load completed in ${endTime - startTime}ms`);

    // Wait for RUM data to be sent
    await page.waitForTimeout(3000)
  } catch (error) {
    //console.error('Error during test:', error);
  } finally {
    await browser.close()
  }
}

// Run the test
async function runContinuousMonitoring() {
  //console.log('Starting continuous RUM monitoring...');

  while (true) {
    try {
      await runRUMTest()
      //console.log('Test completed, waiting before next run...');

      // Wait 5 minutes between runs (adjust as needed)
      await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000))
    } catch (error) {
      console.error('Error in monitoring loop:', error)
      await new Promise((resolve) => setTimeout(resolve, 30 * 1000)) // Wait 30s on error
    }
  }
}

// Run single test or continuous monitoring
if (process.argv.includes('--continuous')) {
  runContinuousMonitoring()
} else {
  runRUMTest()
}
