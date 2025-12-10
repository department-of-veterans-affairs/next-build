import { NextApiRequest, NextApiResponse } from 'next'
import { chromium } from 'playwright-core'

interface CompareRequest {
  path: string
  environment1: 'dev' | 'staging' | 'prod'
  environment2: 'dev' | 'staging' | 'prod'
  selector: string
}

interface FetchComparisonResult {
  success: boolean
  message?: string
  html1?: string
  html2?: string
  url1?: string
  url2?: string
}

function getUrlForEnvironment(
  path: string,
  environment: 'dev' | 'staging' | 'prod'
): string {
  switch (environment) {
    case 'dev':
      // TODO: Get host/port from env
      return `http://localhost:3999${path}`
    case 'staging':
      return `https://staging.va.gov${path}`
    case 'prod':
      return `https://www.va.gov${path}`
  }
}

async function fetchPageElementHtml(
  url: string,
  selector: string
): Promise<string | null> {
  let browser = null
  try {
    browser = await chromium.launch({
      headless: true,
    })
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    // Wait for the selector to be available
    await page.waitForSelector(selector, { timeout: 10000 })

    // Get the HTML of the element
    const html = await page.$eval(selector, (el: Element) => el.outerHTML)

    return html
  } catch (error) {
    console.error('Error fetching element from %s:', url, error)
    return null
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FetchComparisonResult>
) {
  // This endpoint is only available in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'This endpoint is only available in development mode',
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    })
  }

  try {
    const { path, environment1, environment2, selector } =
      req.body as CompareRequest

    // Validate inputs
    if (!path || !environment1 || !environment2 || !selector) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required fields: path, environment1, environment2, selector',
      })
    }

    if (!['dev', 'staging', 'prod'].includes(environment1)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid environment1. Must be dev, staging, or prod',
      })
    }

    if (!['dev', 'staging', 'prod'].includes(environment2)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid environment2. Must be dev, staging, or prod',
      })
    }

    // Get URLs for both environments
    const url1 = getUrlForEnvironment(path, environment1)
    const url2 = getUrlForEnvironment(path, environment2)

    // Fetch HTML from both pages
    const [html1, html2] = await Promise.all([
      fetchPageElementHtml(url1, selector),
      fetchPageElementHtml(url2, selector),
    ])

    if (!html1) {
      return res.status(500).json({
        success: false,
        message: `Failed to fetch element from ${environment1}. Element may not exist or page failed to load.`,
        url1,
      })
    }

    if (!html2) {
      return res.status(500).json({
        success: false,
        message: `Failed to fetch element from ${environment2}. Element may not exist or page failed to load.`,
        url2,
      })
    }

    // Return the HTML for both environments
    return res.status(200).json({
      success: true,
      html1,
      html2,
      url1,
      url2,
    })
  } catch (error) {
    console.error('Comparison API Error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred during comparison',
    })
  }
}
