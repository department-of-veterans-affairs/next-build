type AsyncMapper<TInput, TOutput> = (
  value: TInput,
  index: number
) => Promise<TOutput>

/**
 * Maps values with a bounded number of in-flight async tasks.
 */
export async function mapWithConcurrency<TInput, TOutput>(
  values: TInput[],
  concurrency: number,
  mapper: AsyncMapper<TInput, TOutput>
): Promise<TOutput[]> {
  if (values.length === 0) {
    return []
  }

  const safeConcurrency = Math.max(1, Math.floor(concurrency) || 1)
  const result = new Array<TOutput>(values.length)
  let nextIndex = 0

  const worker = async () => {
    while (nextIndex < values.length) {
      const currentIndex = nextIndex
      nextIndex += 1
      result[currentIndex] = await mapper(values[currentIndex], currentIndex)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(safeConcurrency, values.length) }, () =>
      worker()
    )
  )

  return result
}
