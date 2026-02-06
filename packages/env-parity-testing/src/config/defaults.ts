import type {
  ExecutionConfig,
  VisualConfig,
  OutputConfig,
  LifecycleHooks,
} from './types.js'

export const DEFAULT_EXECUTION: ExecutionConfig = {
  concurrency: 4,
  failFast: false,
  navigationTimeout: 30000,
  retries: 2,
}

export const DEFAULT_VISUAL: VisualConfig = {
  viewport: { width: 1280, height: 800 },
  fullPage: true,
  disableAnimations: true,
  colorScheme: 'light',
  reducedMotion: true,
  diffThreshold: 0.1,
  pixelTolerance: 0.01,
}

export const DEFAULT_OUTPUT: OutputConfig = {
  artifactsDir: './artifacts',
  reportFile: './report.json',
}

export const DEFAULT_HOOKS: LifecycleHooks = {}
