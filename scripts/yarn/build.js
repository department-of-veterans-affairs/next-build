import { processEnv } from 'env-loader'
import Debug from 'debug'

const buildLog = Debug('next-build:build')

const buildStartMs = Date.now()
buildLog('Starting static page generation...')

// processEnv spawns `next build` and calls process.exit() on completion,
// so code after await never runs. Use process.on('exit') to log timing.
process.on('exit', () => {
  const buildDurationMs = Date.now() - buildStartMs
  const buildDurationMin = (buildDurationMs / 60_000).toFixed(1)
  // Use console.log directly — Debug may not flush async stderr during exit
  console.log(
    `\n  next-build:build Static page generation completed in ${buildDurationMs}ms (${buildDurationMin} min)\n`
  )
})

await processEnv('next build --turbopack')
