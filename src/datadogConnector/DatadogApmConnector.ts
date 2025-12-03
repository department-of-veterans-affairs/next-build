import tracer from 'dd-trace'

tracer.init({
  logInjection: process.env.DD_LOGS_INJECTION === 'true',
  runtimeMetrics: process.env.DD_RUNTIME_METRICS === 'true',
  profiling: process.env.DD_PROFILING === 'true',
  env: process.env.APP_ENV || 'development',
  service: process.env.DD_SERVICE || 'next-build',
  version: process.env.GIT_HASH || 'unknown',
  sampleRate: process.env.DD_SAMPLE_RATE
    ? parseFloat(process.env.DD_SAMPLE_RATE)
    : 0.1,
})

export default tracer
