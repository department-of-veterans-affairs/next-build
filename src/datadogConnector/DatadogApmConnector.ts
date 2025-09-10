import tracer from 'dd-trace'

const DatadogApmConnector = () => {
  tracer.init({
    service: process.env.DD_SERVICE || 'vagov-next-build',
    env: process.env.DD_ENV || process.env.NODE_ENV || 'development',
    version: process.env.DD_VERSION || '1.0.0',

    // EKS agent configuration
    hostname: process.env.DD_AGENT_HOST,
    port: process.env.DD_TRACE_AGENT_PORT || 8126,

    runtimeMetrics: true,
    profiling: process.env.NODE_ENV === 'production',
    logInjection: true,

    tags: {
      'service.name': process.env.DD_SERVICE || 'vagov-next-build',
      'service.version': process.env.DD_VERSION,
      'next.version': '15.5',
    },
  })
}

export default DatadogApmConnector
