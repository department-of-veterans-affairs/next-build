import {
  defineConfig,
  ScreenshotMode,
  TraceMode,
  VideoMode,
  ViewportSize,
} from '@playwright/test'

export default defineConfig({
  testDir: './playwright/tests',
  outputDir: './playwright/test-results',
  reporter: [['html', { outputFolder: './playwright/test-report' }]],
  fullyParallel: !process.env.CI,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: process.env.SITE_URL || 'http://localhost:8001',

    // Whether to ignore HTTPS errors during navigation.
    ignoreHTTPSErrors: true,
    // browser context options
    contextOptions: {
      ignoreHTTPSErrors: true,
    },

    // Collect trace when retrying the failed test.
    trace: (process.env.PW_TRACE as TraceMode) || 'on-first-retry',
    screenshot:
      (process.env.PW_SCREENSHOT as ScreenshotMode) || 'only-on-failure',
    video: (process.env.PW_VIDEO as VideoMode) || 'on-first-retry',
    viewport: ({
      width: Number(process.env.PW_WIDTH_VALUE),
      height: Number(process.env.PW_HEIGHT_VALUE),
    } as ViewportSize) || { width: 1280, height: 720 },
  },

  projects: [
    // Test everything except full sitemap a11y check
    {
      name: 'main',
      testIgnore: /.a11y.spec.js/,
    },
    // Sitemap a11y test only
    {
      name: 'a11y',
      testMatch: /.a11y.spec.js/,
    },
  ],
})
