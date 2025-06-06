/**
 * A reference to an object stored in the `include` section of a
 * `DereferencedData` structure.
 */
export interface Reference {
  __refId: string
}

/**
 * Recursive helper type
 */
export type Flattened<T> = T extends (infer U)[] // If T is an array
  ? Flattened<U>[] | Reference
  : T extends object // If T is an object
    ? { [K in keyof T]: Flattened<T[K]> } | Reference
    : T // Otherwise (primitive), leave as is

/**
 * Represents a serialized object structure where circular/repeated references
 * are replaced with `{ __refId }` and the full objects are provided in the
 * `include` map.
 */
export interface FlattenedGraph<T> {
  data: Flattened<T>
  include: Record<string, unknown>
}

/**
 * Serializes an object containing circular and/or repeated references into a
 * JSON-safe format by extracting duplicates into an `include` map.
 */
export function deflateObjectGraph<T>(input: T): FlattenedGraph<T> {
  // Map of all seen objects. Each object gets an ID and a flag for whether
  // it's reused.
  const seen = new Map<unknown, Reference & { isDuplicate: boolean }>()

  // The final store of extracted objects that will be referenced by `{ __refId }`
  const include: FlattenedGraph<T>['include'] = {}

  // Guards against infinite recursion by tracking active __refIds during
  // serialization
  const serializing = new Set<Reference['__refId']>()

  /**
   * First pass: detects duplicates and assigns IDs to all objects. Only marks
   * objects as `isDuplicate` if seen more than once.
   */
  function findDuplicates(value: unknown) {
    if (typeof value !== 'object' || value === null) return

    const existing = seen.get(value)
    if (existing) {
      existing.isDuplicate = true
      return // Make sure we don't recurse infinitely
    } else {
      seen.set(value, { __refId: seen.size.toString(), isDuplicate: false })
    }

    if (Array.isArray(value)) {
      for (const item of value) findDuplicates(item)
    } else {
      for (const val of Object.values(value)) {
        findDuplicates(val)
      }
    }
  }

  /**
   * Second pass: recursively walks the data and replaces duplicate objects
   * with `{ __refId }`. If an object is marked as a duplicate, it is added to
   * `include` and referenced by ID.
   */
  function replaceDuplicateRefs(value: unknown): unknown {
    if (typeof value !== 'object' || value === null) return value

    const entry = seen.get(value)
    if (entry?.isDuplicate) {
      if (!(entry.__refId in include)) {
        // If we're currently serializing this __refId (due to circularity), just
        // return the ref
        if (serializing.has(entry.__refId)) {
          return { __refId: entry.__refId }
        }

        serializing.add(entry.__refId)

        // Recursively walk object or array content
        let result: unknown
        if (Array.isArray(value)) {
          result = value.map(replaceDuplicateRefs)
        } else {
          const obj: Record<string, unknown> = {}
          for (const [key, val] of Object.entries(value)) {
            obj[key] = replaceDuplicateRefs(val)
          }
          result = obj
        }

        include[entry.__refId] = result
        serializing.delete(entry.__refId)
      }

      return { __refId: entry.__refId }
    }

    // Not a duplicate, serialize normally
    if (Array.isArray(value)) {
      return value.map(replaceDuplicateRefs)
    }

    const output: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      output[key] = replaceDuplicateRefs(val)
    }
    return output
  }

  findDuplicates(input)
  const data = replaceDuplicateRefs(input) as Flattened<T>
  return { data, include }
}

/**
 * Reconstructs the original object from its serialized form, resolving all
 * `{ __refId }` references. Preserves object identity and circular structure by
 * caching resolved references.
 *
 * NOTE: The return value is type-asserted, so be careful with the type you
 * assign to it!
 */
export function inflateObjectGraph<T>(data: FlattenedGraph<T>): T {
  const { data: root, include } = data
  const cache = new Map<Reference['__refId'], unknown>() // Used to maintain shared/circular reference identity

  /**
   * Recursively resolves `{ __refId }` references into actual object instances.
   * Uses a cache to prevent reprocessing and to rebuild cycles correctly.
   */
  function resolve(value: unknown): unknown {
    if (typeof value !== 'object' || value === null) return value

    if (Array.isArray(value)) {
      return value.map(resolve)
    }

    // Only objects are left by this point
    if ('__refId' in value && typeof value.__refId === 'string') {
      const __refId = (value as Reference).__refId

      // Return from cache if already resolved (handles shared/circular refs)
      if (cache.has(__refId)) {
        return cache.get(__refId)
      }

      const refData = include[__refId]
      if (refData === undefined) {
        throw new Error(`Reference id ${__refId} not found in include map`)
      }

      // Create placeholder to support circular references
      if (Array.isArray(refData)) {
        const shell: unknown[] = []
        cache.set(__refId, shell)

        const resolved = refData.map(resolve)
        shell.push(...resolved)

        return shell
      } else {
        const shell: Record<string, unknown> = {}
        cache.set(__refId, shell)

        const resolved = resolve(refData)
        Object.assign(shell, resolved)

        return shell
      }
    }

    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      result[key] = resolve(val)
    }
    return result
  }

  return resolve(root) as T
}
