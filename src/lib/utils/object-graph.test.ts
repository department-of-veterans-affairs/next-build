import { flattenObjectGraph, inflateObjectGraph } from './object-graph'

describe('data-serializer', () => {
  it('serializes and deserializes a simple object', () => {
    const input = { name: 'Alice', age: 30 }
    const roundTrip = inflateObjectGraph(flattenObjectGraph(input))
    expect(roundTrip).toEqual(input)
  })

  it('handles nested objects', () => {
    const input = { user: { name: 'Bob' }, active: true }
    const roundTrip = inflateObjectGraph(flattenObjectGraph(input))
    expect(roundTrip).toEqual(input)
  })

  it('handles arrays of primitives and objects', () => {
    const input = {
      list: [1, 2, { a: 'x' }, { b: 'y' }],
    }
    const roundTrip = inflateObjectGraph(flattenObjectGraph(input))
    expect(roundTrip).toEqual(input)
  })

  it('deduplicates repeated references', () => {
    const shared = { value: 42 }
    const input = { a: shared, b: shared }
    const result = flattenObjectGraph(input)

    const uuids = Object.keys(result.include)
    expect(uuids.length).toBe(1)
    expect(result.data.a).toEqual({ __refId: uuids[0] })
    expect(result.data.b).toEqual({ __refId: uuids[0] })

    const roundTrip = inflateObjectGraph(result)
    expect(roundTrip.a).toBe(roundTrip.b)
    expect(roundTrip.a).toEqual(shared)
  })

  it('handles circular references', () => {
    const obj: Record<string, unknown> = { name: 'Selfie' }
    obj.self = obj

    const result = flattenObjectGraph(obj)
    const uuids = Object.keys(result.include)
    expect(uuids.length).toBe(1)

    const roundTrip = inflateObjectGraph(result)
    expect(roundTrip.self).toBe(roundTrip)
  })

  it('handles deeply nested circular references', () => {
    type Parent = { name: string; child: Child }
    type Child = { name: string; parent: Parent }

    // @ts-expect-error Child can't be defined yet; that's what the circular
    // reference is all about
    const parent: Parent = { name: 'parent' }
    const child: Child = { name: 'child', parent }
    parent.child = child

    const result = flattenObjectGraph(parent)
    const uuids = Object.keys(result.include)
    expect(uuids.length).toBe(1)

    const roundTrip = inflateObjectGraph(result)
    expect(roundTrip.child.parent).toBe(roundTrip)
  })

  it('does not create includes for primitives', () => {
    const input = { a: 1, b: true, c: 'text' }
    const result = flattenObjectGraph(input)

    expect(Object.keys(result.include)).toHaveLength(0)
    expect(inflateObjectGraph(result)).toEqual(input)
  })

  it('preserves repeated references in arrays', () => {
    const shared = { thing: 'yo' }
    const input = [shared, shared]
    const result = flattenObjectGraph(input)

    expect(Object.keys(result.include)).toHaveLength(1)
    expect(result.data[0]).toEqual(result.data[1])
    const deserializedData = inflateObjectGraph(result)
    expect(deserializedData[0]).toBe(deserializedData[1])
  })

  it('deduplicates shared leaf objects', () => {
    const leaf = { id: 999 }
    const input = {
      left: { leaf },
      right: { leaf },
    }

    const result = flattenObjectGraph(input)
    expect(Object.keys(result.include)).toHaveLength(1)
    const roundTrip = inflateObjectGraph(result)

    expect(roundTrip.left.leaf).toBe(roundTrip.right.leaf)
  })

  it('handles complex shared and circular structures', () => {
    const shared = { val: 123 }
    const a: Record<string, unknown> = { name: 'A', shared }
    const b: Record<string, unknown> = { name: 'B', shared }
    a.b = b
    b.a = a

    const result = flattenObjectGraph(a)
    const roundTrip = inflateObjectGraph(result)

    // TS gets a little (reasonably) annoyed that we're not more specific with
    // the static types. We know they're there.
    //
    // @ts-expect-error It's really there; trust me
    expect(roundTrip.b.a).toBe(roundTrip)
    // @ts-expect-error It's really there; trust me
    expect(roundTrip.shared).toBe(roundTrip.b.shared)
  })

  it('handles circular references inside nested arrays', () => {
    const node: Record<string, unknown> = { id: 1 }
    node.children = [node]

    const result = flattenObjectGraph(node)
    const roundTrip = inflateObjectGraph(result)

    expect(roundTrip.children[0]).toBe(roundTrip)
  })

  it('handles null and skips undefined', () => {
    const input = {
      a: null,
      b: undefined,
      c: { d: undefined, e: null },
    }

    const result = flattenObjectGraph(input)
    const roundTrip = inflateObjectGraph(result)

    expect(roundTrip.a).toBeNull()
    expect(roundTrip.b).toBeUndefined()
    expect(roundTrip.c.e).toBeNull()
    expect('d' in roundTrip.c).toBe(true) // optional: assert 'undefined' is retained
  })
})
