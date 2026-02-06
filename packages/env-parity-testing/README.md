# Environment Parity Testing (EPT)

A CLI tool for comparing two live environments (e.g., production vs staging) across a set of URL paths. Unlike traditional visual regression testing that relies on a single baseline, EPT treats both environments as peers and compares them directly.

## Quick Start

```bash
# Build the tool
yarn build:ept

# Run a comparison
node packages/env-parity-testing/bin/ept.js \
  --envA https://www.va.gov \
  --envB https://staging.va.gov \
  --paths ./paths.txt
```

## Installation

The tool is part of the next-build monorepo. Dependencies are installed automatically with `yarn install`.

To build:

```bash
yarn build:ept
```

## Usage

### CLI Options

```
Usage: ept [options]

Options:
  -V, --version          output the version number
  -c, --config <path>    Path to config file (ept.config.ts)
  -p, --paths <path>     Path to paths file (one path per line)
  --envA <url>           Base URL for environment A
  --envB <url>           Base URL for environment B
  --fail-fast            Stop on first failure
  --no-fail-fast         Continue after failures (default)
  --concurrency <n>      Number of parallel comparisons
  -o, --output <dir>     Artifacts output directory
  -h, --help             display help for command
```

### Basic Examples

**Compare two environments with a paths file:**

```bash
node packages/env-parity-testing/bin/ept.js \
  --envA https://www.va.gov \
  --envB https://staging.va.gov \
  --paths ./paths.txt
```

**Use a configuration file:**

```bash
node packages/env-parity-testing/bin/ept.js --config ./ept.config.ts
```

**Override config file settings via CLI:**

```bash
node packages/env-parity-testing/bin/ept.js \
  --config ./ept.config.ts \
  --envB https://dev.va.gov \
  --concurrency 2
```

### Paths File Format

Create a text file with one URL path per line. Lines starting with `#` are treated as comments.

```
# paths.txt
/
/health-care
/health-care/apply
/disability/compensation-rates
```

## Configuration

EPT uses a layered configuration system. Settings are applied in this order (highest precedence wins):

1. CLI arguments
2. Config file (`ept.config.ts`)
3. Built-in defaults

### Config File

Create an `ept.config.ts` file:

```typescript
import type { EPTConfig } from 'env-parity-testing'

export default {
  environments: {
    a: { baseUrl: 'https://www.va.gov' },
    b: { baseUrl: 'https://staging.va.gov' },
  },

  paths: [
    '/',
    '/health-care',
    '/health-care/apply',
    {
      path: '/contact-us',
      waitForSelector: '#main-content',
      timeoutMs: 60000,
    },
  ],

  execution: {
    concurrency: 4,
    failFast: false,
    navigationTimeout: 30000,
    retries: 2,
  },

  visual: {
    viewport: { width: 1280, height: 800 },
    fullPage: true,
    disableAnimations: true,
    colorScheme: 'light',
    reducedMotion: true,
    diffThreshold: 0.1,
    pixelTolerance: 0.01,
  },

  output: {
    artifactsDir: './artifacts',
    reportFile: './report.json',
  },

  hooks: {
    // See "Lifecycle Hooks" section
  },
} satisfies EPTConfig
```

### Configuration Reference

#### `environments`

| Property    | Type     | Description                                                 |
| ----------- | -------- | ----------------------------------------------------------- |
| `a.baseUrl` | `string` | Base URL for environment A (e.g., `https://www.va.gov`)     |
| `b.baseUrl` | `string` | Base URL for environment B (e.g., `https://staging.va.gov`) |

#### `paths`

Paths can be specified as simple strings or objects with per-path options:

**Simple string:**

```typescript
paths: ['/', '/health-care', '/about']
```

**Object with options:**

```typescript
paths: [
  {
    path: '/contact-us',
    waitForSelector: '#main-content', // Wait for this selector before screenshot
    timeoutMs: 60000, // Custom timeout for this path
  },
]
```

| Property          | Type     | Default  | Description                                          |
| ----------------- | -------- | -------- | ---------------------------------------------------- |
| `path`            | `string` | required | URL path to compare                                  |
| `waitForSelector` | `string` | none     | CSS selector to wait for before capturing screenshot |
| `timeoutMs`       | `number` | `30000`  | Timeout for this specific path                       |

#### `execution`

| Property            | Type      | Default | Description                             |
| ------------------- | --------- | ------- | --------------------------------------- |
| `concurrency`       | `number`  | `4`     | Number of pages to process in parallel  |
| `failFast`          | `boolean` | `false` | Stop execution on first failure         |
| `navigationTimeout` | `number`  | `30000` | Timeout (ms) for page navigation        |
| `retries`           | `number`  | `2`     | Number of retries for failed operations |

#### `visual`

| Property            | Type                                   | Default   | Description                                            |
| ------------------- | -------------------------------------- | --------- | ------------------------------------------------------ |
| `viewport.width`    | `number`                               | `1280`    | Browser viewport width                                 |
| `viewport.height`   | `number`                               | `800`     | Browser viewport height                                |
| `fullPage`          | `boolean`                              | `true`    | Capture full page screenshot (not just viewport)       |
| `disableAnimations` | `boolean`                              | `true`    | Inject CSS to disable animations                       |
| `colorScheme`       | `'light' \| 'dark' \| 'no-preference'` | `'light'` | Emulated color scheme                                  |
| `reducedMotion`     | `boolean`                              | `true`    | Emulate reduced motion preference                      |
| `diffThreshold`     | `number`                               | `0.1`     | Maximum allowed diff percentage (0-100) before failing |
| `pixelTolerance`    | `number`                               | `0.01`    | Per-pixel color tolerance for pixelmatch (0-1)         |

#### `output`

| Property       | Type     | Default           | Description                               |
| -------------- | -------- | ----------------- | ----------------------------------------- |
| `artifactsDir` | `string` | `'./artifacts'`   | Directory for screenshots and diff images |
| `reportFile`   | `string` | `'./report.json'` | Path for JSON report output               |

### Lifecycle Hooks

Hooks allow you to customize behavior at key points in the execution:

```typescript
export default {
  // ...other config

  hooks: {
    // Called before navigating to a page
    async beforeNavigate(page, context) {
      // `page` is a Playwright Page object
      // Set cookies, authenticate, etc.
      await page
        .context()
        .addCookies([{ name: 'session', value: 'abc123', domain: '.va.gov' }])
    },

    // Called after page navigation completes
    async afterNavigate(page, context) {
      // Dismiss modals, interact with page, etc.
      const modal = page.locator('.cookie-banner')
      if (await modal.isVisible()) {
        await modal.locator('button.dismiss').click()
      }
    },

    // Called before running comparison tools on a page
    async beforeComparison(context) {
      console.log(`Starting comparison for: ${context.path}`)
    },

    // Called after each comparison tool completes
    async afterComparison(result, context) {
      if (!result.passed) {
        console.log(`Comparison failed for: ${context.path}`)
      }
    },
  },
} satisfies EPTConfig
```

**Hook Context:**

```typescript
interface HookContext {
  path: string // Current URL path being compared
  envA: { baseUrl: string } // Environment A config
  envB: { baseUrl: string } // Environment B config
  config: ResolvedConfig // Full resolved configuration
}
```

## Output

### Artifacts Directory

Each run creates a fresh artifacts directory with the following structure:

```
artifacts/
├── root/                    # For path "/"
│   ├── envA.png            # Screenshot from environment A
│   ├── envB.png            # Screenshot from environment B
│   └── diff.png            # Visual diff highlighting differences
├── health-care/
│   ├── envA.png
│   ├── envB.png
│   └── diff.png
└── health-care_apply/       # Slashes converted to underscores
    ├── envA.png
    ├── envB.png
    └── diff.png
```

### JSON Report

The report includes metadata, summary statistics, and per-page results:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environments": {
    "a": "https://www.va.gov",
    "b": "https://staging.va.gov"
  },
  "summary": {
    "total": 10,
    "passed": 8,
    "failed": 2,
    "duration": 45000
  },
  "pages": [
    {
      "path": "/",
      "urlA": "https://www.va.gov/",
      "urlB": "https://staging.va.gov/",
      "passed": true,
      "duration": 3500,
      "results": [
        {
          "tool": "visual",
          "passed": true,
          "data": {
            "diffPercent": 0.02,
            "diffPixels": 1024,
            "totalPixels": 5120000,
            "threshold": 0.1,
            "artifacts": {
              "envA": "./artifacts/root/envA.png",
              "envB": "./artifacts/root/envB.png",
              "diff": "./artifacts/root/diff.png"
            }
          }
        }
      ]
    }
  ]
}
```

## Exit Codes

| Code | Meaning                                      |
| ---- | -------------------------------------------- |
| `0`  | All comparisons passed                       |
| `1`  | One or more comparisons failed               |
| `2`  | Configuration error or unrecoverable failure |

## Extending with New Comparison Tools

EPT is designed to support multiple comparison strategies. While visual regression is the first implemented tool, the architecture supports adding new tools like DOM diffing, accessibility checks, or performance comparisons.

### Creating a New Tool

1. **Create a new tool directory:**

```
src/tools/my-tool/
├── index.ts
└── ... (other implementation files)
```

2. **Implement the `ComparisonTool` interface:**

```typescript
// src/tools/my-tool/index.ts
import type {
  ComparisonTool,
  ComparisonContext,
  ComparisonResult,
} from '../../core/types.js'

export const myComparisonTool: ComparisonTool = {
  name: 'my-tool',

  async compare(context: ComparisonContext): Promise<ComparisonResult> {
    const { pathConfig, urlA, urlB, config, artifactsDir } = context

    try {
      // Implement your comparison logic here
      // ...

      return {
        tool: 'my-tool',
        passed: true,
        data: {
          // Tool-specific result data
        },
      }
    } catch (error) {
      return {
        tool: 'my-tool',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },
}
```

3. **Register the tool in the runner:**

Edit `src/core/runner.ts` to include your tool:

```typescript
import { myComparisonTool } from '../tools/my-tool/index.js'

// In the run() function:
const tools: ComparisonTool[] = [
  visualComparisonTool,
  myComparisonTool, // Add your tool here
]
```

### ComparisonContext Reference

Your tool receives this context:

```typescript
interface ComparisonContext {
  pathConfig: PathConfig // Current path configuration
  urlA: string // Full URL for environment A
  urlB: string // Full URL for environment B
  config: ResolvedConfig // Full resolved configuration
  artifactsDir: string // Directory for this page's artifacts
}
```

### Adding Tool-Specific Configuration

To add configuration options for your tool:

1. **Add types to `src/config/types.ts`:**

```typescript
export interface MyToolConfig {
  someOption: boolean
  threshold: number
}

export interface EPTConfig {
  // ...existing fields
  myTool?: Partial<MyToolConfig>
}
```

2. **Add defaults to `src/config/defaults.ts`:**

```typescript
export const DEFAULT_MY_TOOL: MyToolConfig = {
  someOption: true,
  threshold: 0.5,
}
```

3. **Merge in `src/config/loader.ts`:**

```typescript
const resolved: ResolvedConfig = {
  // ...existing fields
  myTool: {
    ...DEFAULT_MY_TOOL,
    ...fileConfig.myTool,
  },
}
```

## Debugging

Enable debug output with the `DEBUG` environment variable:

```bash
# All debug output
DEBUG=ept:* node packages/env-parity-testing/bin/ept.js ...

# Specific modules
DEBUG=ept:runner,ept:visual node packages/env-parity-testing/bin/ept.js ...
```

Available debug namespaces:

- `ept:runner` - Main execution flow
- `ept:visual` - Visual comparison tool
- `ept:screenshot` - Screenshot capture
- `ept:diff` - Image diffing
- `ept:artifacts` - Artifact file operations
- `ept:report` - Report generation
- `ept:hooks` - Lifecycle hook execution

## Troubleshooting

### Screenshots have different sizes

If the two environments render pages at different heights (due to content differences), the tool will pad the smaller image with transparent pixels before comparing. This ensures the comparison completes, but the size difference will likely cause the comparison to fail.

### Flaky comparisons

If comparisons are inconsistent between runs:

1. **Increase timeout:** Some pages may need more time to fully render

   ```typescript
   execution: {
     navigationTimeout: 60000
   }
   ```

2. **Wait for specific elements:** Use `waitForSelector` for dynamic content

   ```typescript
   paths: [{ path: '/dynamic-page', waitForSelector: '.content-loaded' }]
   ```

3. **Disable animations:** Ensure `disableAnimations: true` (default)

4. **Check for time-sensitive content:** Dates, timestamps, or live data will cause diffs

### Browser fails to launch

Ensure Playwright browsers are installed:

```bash
npx playwright install chromium
```
