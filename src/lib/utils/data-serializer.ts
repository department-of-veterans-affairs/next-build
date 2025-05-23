import { v4 as uuidv4 } from 'uuid'

export interface DereferencedData<T> {
  data: T
  include: Record<string, unknown>
}

export interface Reference {
  refId: string
}

export function serialize<T>(input: T): DereferencedData<T> {
  const seen = new Map<unknown, { refId: string; isDuplicate: boolean }>()
  const include: DereferencedData<T>['include'] = {}
  const serializing = new Set<string>()

  function findDuplicates(value: unknown) {
    if (typeof value !== 'object' || value === null) return

    const existing = seen.get(value)
    if (existing) {
      existing.isDuplicate = true
      return
    } else {
      seen.set(value, { refId: uuidv4(), isDuplicate: false })
    }

    if (Array.isArray(value)) {
      for (const item of value) findDuplicates(item)
    } else {
      for (const val of Object.values(value)) {
        findDuplicates(val)
      }
    }
  }

  function walk(value: unknown): unknown {
    if (typeof value !== 'object' || value === null) return value

    const entry = seen.get(value)
    if (entry?.isDuplicate) {
      if (!(entry.refId in include)) {
        if (serializing.has(entry.refId)) {
          return { refId: entry.refId }
        }

        serializing.add(entry.refId)

        // Recursively walk and build the included object
        const result: Record<string, unknown> = {}
        for (const [key, val] of Object.entries(value)) {
          result[key] = walk(val)
        }

        include[entry.refId] = Array.isArray(value)
          ? (value as unknown[]).map(walk)
          : result

        serializing.delete(entry.refId)
      }

      return { refId: entry.refId }
    }

    if (Array.isArray(value)) {
      return value.map(walk)
    }

    const output: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      output[key] = walk(val)
    }
    return output
  }

  findDuplicates(input)
  const data = walk(input) as T
  return { data, include }
}

export function deserialize<T>(data: DereferencedData<T>): T {
  const { data: root, include } = data
  const cache = new Map<string, unknown>()

  function resolve(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map(resolve)
    }

    if (typeof value === 'object' && value !== null) {
      if ('refId' in value && typeof value.refId === 'string') {
        const refId = (value as Reference).refId
        if (cache.has(refId)) {
          return cache.get(refId)
        }

        const refData = include[refId]
        if (refData === undefined) {
          throw new Error(`Reference id ${refId} not found in include map`)
        }

        // Placeholder before recursion to support circular refs
        const shell: Record<string, unknown> = {}
        cache.set(refId, shell)

        const resolved = resolve(refData)
        Object.assign(shell, resolved)

        return shell
      }

      const result: Record<string, unknown> = {}
      for (const [key, val] of Object.entries(value)) {
        result[key] = resolve(val)
      }
      return result
    }

    return value
  }

  return resolve(root) as T
}
