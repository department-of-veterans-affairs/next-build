import type { Browser, Page } from 'playwright'
import { chromium } from 'playwright'
import type { VisualConfig, PathConfig } from '../../config/types.js'
import Debug from 'debug'

const debug = Debug('ept:screenshot')

/**
 * CSS to inject for disabling animations and ensuring determinism
 */
const DETERMINISM_CSS = `
  *,
  *::before,
  *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }
`

/**
 * Browser instance manager (singleton for reuse)
 */
let browserInstance: Browser | null = null

export async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    debug('Launching browser')
    browserInstance = await chromium.launch({
      headless: true,
    })
  }
  return browserInstance
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    debug('Closing browser')
    await browserInstance.close()
    browserInstance = null
  }
}

/**
 * Configure page for deterministic screenshots
 */
async function configurePage(page: Page, config: VisualConfig): Promise<void> {
  // Set viewport
  await page.setViewportSize(config.viewport)

  // Emulate color scheme
  await page.emulateMedia({
    colorScheme: config.colorScheme,
    reducedMotion: config.reducedMotion ? 'reduce' : 'no-preference',
  })

  // Inject determinism CSS if animations should be disabled
  if (config.disableAnimations) {
    await page.addStyleTag({ content: DETERMINISM_CSS })
  }
}

/**
 * Wait for page to be ready for screenshot
 */
async function waitForReady(
  page: Page,
  pathConfig: PathConfig,
  timeout: number
): Promise<void> {
  // Wait for network to be idle
  await page.waitForLoadState('domcontentloaded', { timeout })

  // Wait for specific selector if configured
  if (pathConfig.waitForSelector) {
    debug(`Waiting for selector: ${pathConfig.waitForSelector}`)
    await page.waitForSelector(pathConfig.waitForSelector, {
      timeout: pathConfig.timeoutMs || timeout,
    })
  }
}

export interface ScreenshotOptions {
  url: string
  outputPath: string
  config: VisualConfig
  pathConfig: PathConfig
  timeout: number
}

/**
 * Capture a screenshot of a URL with determinism controls
 */
export async function captureScreenshot(
  options: ScreenshotOptions
): Promise<void> {
  const { url, outputPath, config, pathConfig, timeout } = options

  debug(`Capturing screenshot: ${url}`)

  const browser = await getBrowser()
  const context = await browser.newContext({
    viewport: config.viewport,
    colorScheme: config.colorScheme,
    reducedMotion: config.reducedMotion ? 'reduce' : 'no-preference',
  })

  const page = await context.newPage()

  try {
    // Navigate to URL
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout,
    })

    // Configure page for determinism
    await configurePage(page, config)

    // Wait for page to be ready
    await waitForReady(page, pathConfig, timeout)

    // Capture screenshot
    await page.screenshot({
      path: outputPath,
      fullPage: config.fullPage,
    })

    debug(`Screenshot saved: ${outputPath}`)
  } finally {
    await context.close()
  }
}
