import path from 'path'
import type {
  ComparisonTool,
  ComparisonContext,
  ComparisonResult,
  VisualComparisonData,
} from '../../core/types.js'
import { captureScreenshot } from './screenshot.js'
import { compareImages } from './diff.js'
import Debug from 'debug'

const debug = Debug('ept:visual')

/**
 * Visual regression testing comparison tool
 *
 * Captures screenshots of both environments and compares them
 * using pixel-level diffing.
 */
export const visualComparisonTool: ComparisonTool = {
  name: 'visual',

  async compare(context: ComparisonContext): Promise<ComparisonResult> {
    const { pathConfig, urlA, urlB, config, artifactsDir } = context
    const { visual, execution } = config

    const envAPath = path.join(artifactsDir, 'envA.png')
    const envBPath = path.join(artifactsDir, 'envB.png')
    const diffPath = path.join(artifactsDir, 'diff.png')

    try {
      debug(`Starting visual comparison for: ${pathConfig.path}`)

      // Capture screenshots in parallel
      await Promise.all([
        captureScreenshot({
          url: urlA,
          outputPath: envAPath,
          config: visual,
          pathConfig,
          timeout: execution.navigationTimeout,
        }),
        captureScreenshot({
          url: urlB,
          outputPath: envBPath,
          config: visual,
          pathConfig,
          timeout: execution.navigationTimeout,
        }),
      ])

      // Compare images
      const diffResult = compareImages({
        imageAPath: envAPath,
        imageBPath: envBPath,
        diffOutputPath: diffPath,
        threshold: visual.pixelTolerance,
      })

      // Determine pass/fail based on threshold
      const passed = diffResult.diffPercent <= visual.diffThreshold

      const data: VisualComparisonData = {
        diffPercent: diffResult.diffPercent,
        diffPixels: diffResult.diffPixels,
        totalPixels: diffResult.totalPixels,
        threshold: visual.diffThreshold,
        artifacts: {
          envA: envAPath,
          envB: envBPath,
          diff: diffPath,
        },
      }

      debug(
        `Visual comparison complete: ${diffResult.diffPercent.toFixed(2)}% diff (${passed ? 'PASS' : 'FAIL'})`
      )

      return {
        tool: 'visual',
        passed,
        data,
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error during visual comparison'

      debug(`Visual comparison failed: ${message}`)

      return {
        tool: 'visual',
        passed: false,
        error: message,
      }
    }
  },
}
