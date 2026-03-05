/**
 * Configuration types for the Environment Parity Testing tool
 */

export interface EnvironmentConfig {
  baseUrl: string
}

export interface Viewport {
  width: number
  height: number
}

export interface VisualConfig {
  viewport: Viewport
  fullPage: boolean
  disableAnimations: boolean
  colorScheme: 'light' | 'dark' | 'no-preference'
  reducedMotion: boolean
  diffThreshold: number
  pixelTolerance: number
}

export interface ExecutionConfig {
  concurrency: number
  failFast: boolean
  navigationTimeout: number
  retries: number
}

export interface OutputConfig {
  artifactsDir: string
  reportFile: string
}

/**
 * Path configuration - can be a simple string or an object with overrides
 */
export interface PathConfig {
  path: string
  waitForSelector?: string
  timeoutMs?: number
  diffThreshold?: number
}

export type PathInput = string | PathConfig

/**
 * Lifecycle hooks for extensibility
 */
export interface LifecycleHooks {
  beforeNavigate?: (page: unknown, context: HookContext) => Promise<void>
  afterNavigate?: (page: unknown, context: HookContext) => Promise<void>
  beforeComparison?: (context: HookContext) => Promise<void>
  afterComparison?: (result: unknown, context: HookContext) => Promise<void>
}

export interface HookContext {
  path: string
  envA: EnvironmentConfig
  envB: EnvironmentConfig
  config: ResolvedConfig
}

/**
 * Full configuration as defined in ept.config.ts files
 */
export interface EPTConfig {
  environments?: {
    a?: EnvironmentConfig
    b?: EnvironmentConfig
  }
  paths?: PathInput[]
  execution?: Partial<ExecutionConfig>
  visual?: Partial<VisualConfig>
  output?: Partial<OutputConfig>
  hooks?: LifecycleHooks
}

/**
 * CLI options that can override config file settings
 */
export interface CLIOptions {
  config?: string
  paths?: string
  envA?: string
  envB?: string
  failFast?: boolean
  concurrency?: number
  output?: string
}

/**
 * Fully resolved configuration with all defaults applied
 */
export interface ResolvedConfig {
  environments: {
    a: EnvironmentConfig
    b: EnvironmentConfig
  }
  paths: PathConfig[]
  execution: ExecutionConfig
  visual: VisualConfig
  output: OutputConfig
  hooks: LifecycleHooks
}
