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

// Note: Default output paths are computed relative to the package root in loader.ts
// These values are only used when a config file specifies partial output config
export const DEFAULT_OUTPUT: OutputConfig = {
  artifactsDir: './artifacts',
  reportFile: './artifacts/report.json',
}

export const DEFAULT_HOOKS: LifecycleHooks = {}
