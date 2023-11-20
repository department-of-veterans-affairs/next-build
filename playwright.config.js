const { devices } = require('@playwright/test')

module.exports = {
  testDir: './playwright/tests',

  use: {
    baseURL: process.env.SITE_URL || 'http://localhost:8001',
  },
}
