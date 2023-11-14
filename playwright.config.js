module.exports = {
  testDir: './playwright/tests',

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: process.env.SITE_URL || 'http://localhost:8001',

    // Collect trace when retrying the failed test.
    trace: 'on-first-retry'
  },
}
