import type { Page } from 'playwright'
import type { LifecycleHooks, HookContext } from '../config/types.js'
import type { ComparisonResult } from './types.js'
import Debug from 'debug'

const debug = Debug('ept:hooks')

/**
 * Execute a lifecycle hook if defined
 */
async function executeHook<T extends unknown[]>(
  hookName: string,
  hook: ((...args: T) => Promise<void>) | undefined,
  ...args: T
): Promise<void> {
  if (!hook) return

  debug(`Executing hook: ${hookName}`)
  try {
    await hook(...args)
    debug(`Hook completed: ${hookName}`)
  } catch (error) {
    debug(`Hook failed: ${hookName}`, error)
    throw error
  }
}

/**
 * Hook executor with bound hooks from config
 */
export class HookExecutor {
  constructor(private hooks: LifecycleHooks) {}

  async beforeNavigate(page: Page, context: HookContext): Promise<void> {
    await executeHook(
      'beforeNavigate',
      this.hooks.beforeNavigate,
      page,
      context
    )
  }

  async afterNavigate(page: Page, context: HookContext): Promise<void> {
    await executeHook('afterNavigate', this.hooks.afterNavigate, page, context)
  }

  async beforeComparison(context: HookContext): Promise<void> {
    await executeHook('beforeComparison', this.hooks.beforeComparison, context)
  }

  async afterComparison(
    result: ComparisonResult,
    context: HookContext
  ): Promise<void> {
    await executeHook(
      'afterComparison',
      this.hooks.afterComparison,
      result,
      context
    )
  }
}
