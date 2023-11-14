const { devices } = require('@playwright/test')

module.exports = {
  testDir: './playwright/tests', // point to your new test directory
  // ... other configuration settings
  use: {
    baseURL: process.env.SITE_URL || 'http://localhost:8001',
  },
}
