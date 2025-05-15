export interface LiquidAnalysis {
  lineCount: number
  cyclomaticComplexity: number
  decisionPoints: {
    if: number
    elsif: number
    unless: number
    for: number
    case: number
    when: number
  }
}

export function analyzeLiquidTemplate(content: string): LiquidAnalysis {
  const lines = content.split(/\r?\n/)

  const decisionCounts = {
    if: 0,
    elsif: 0,
    unless: 0,
    for: 0,
    case: 0,
    when: 0,
  }

  const patterns: Record<keyof typeof decisionCounts, RegExp> = {
    if: /{%\s*if\b/,
    elsif: /{%\s*elsif\b/,
    unless: /{%\s*unless\b/,
    for: /{%\s*for\b/,
    case: /{%\s*case\b/,
    when: /{%\s*when\b/,
  }

  for (const line of lines) {
    for (const [key, regex] of Object.entries(patterns)) {
      if (regex.test(line)) {
        decisionCounts[key as keyof typeof decisionCounts]++
      }
    }
  }

  const complexity =
    1 + Object.values(decisionCounts).reduce((sum, n) => sum + n, 0)

  return {
    lineCount: lines.length,
    cyclomaticComplexity: complexity,
    decisionPoints: decisionCounts,
  }
}
