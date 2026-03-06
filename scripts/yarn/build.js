import { processEnv } from 'env-loader'
import Debug from 'debug'

const buildLog = Debug('next-build:build')

const buildStartMs = Date.now()
buildLog('Starting static page generation...')

await processEnv('next build --turbopack')

const buildDurationMs = Date.now() - buildStartMs
const buildDurationMin = (buildDurationMs / 60_000).toFixed(1)
buildLog(
  `Static page generation completed in ${buildDurationMs}ms (${buildDurationMin} min)`
)
