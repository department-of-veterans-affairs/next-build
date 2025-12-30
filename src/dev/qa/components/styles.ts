/**
 * CSS utility helper for combining class names with variants
 */

import styles from './SideBySideCompare.module.css'

/**
 * Combines a base class with optional variant classes
 * @param base - Base class name(s)
 * @param variants - Object of variant names to boolean conditions
 * @returns Combined className string
 *
 * @example
 * cx('cell', { hovered: true, different: false })
 * // Returns: styles.cell + ' ' + styles.cellHovered
 *
 * @example
 * cx(['cell', 'textContent'], { hovered: isHovered })
 * // Returns: styles.cell + ' ' + styles.textContent + (conditional hovered)
 */
export function cx(
  base: string | string[],
  variants?: Record<string, boolean | undefined>
): string {
  const bases = Array.isArray(base) ? base : [base]
  const classes = bases.map((b) => styles[b as keyof typeof styles])

  if (variants) {
    Object.entries(variants).forEach(([variant, condition]) => {
      if (condition) {
        // Convert 'hovered' to 'cellHovered' if base is 'cell'
        const variantKey =
          bases.length === 1
            ? `${bases[0]}${variant.charAt(0).toUpperCase()}${variant.slice(1)}`
            : variant
        const variantClass = styles[variantKey as keyof typeof styles]
        if (variantClass) {
          classes.push(variantClass)
        }
      }
    })
  }

  return classes.filter(Boolean).join(' ')
}

export { styles }
