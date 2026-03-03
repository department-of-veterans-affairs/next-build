import tracer from 'dd-trace'

function parseSampleRate(rateString: string | undefined): number | undefined {
  const rate = parseFloat(rateString)
  if (isNaN(rate)) {
    return undefined
  }
  return rate
}

tracer.init({
  logInjection: process.env.DD_LOGS_INJECTION === 'true',
  runtimeMetrics: process.env.DD_RUNTIME_METRICS === 'true',
  profiling: process.env.DD_PROFILING === 'true',
  env: process.env.APP_ENV || 'development',
  service: process.env.DD_SERVICE || 'next-build',
  version: process.env.GIT_HASH || 'unknown',
  sampleRate: parseSampleRate(process.env.DD_SAMPLE_RATE) ?? 10,
})

export default tracer
