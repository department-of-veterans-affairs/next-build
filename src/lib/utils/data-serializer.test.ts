import { serialize, deserialize } from './data-serializer'

describe('data-serializer', () => {
  it('serializes and deserializes a simple object', () => {
    const input = { name: 'Alice', age: 30 }
    const roundTrip = deserialize(serialize(input))
    expect(roundTrip).toEqual(input)
  })

  it('handles nested objects', () => {
    const input = { user: { name: 'Bob' }, active: true }
    const roundTrip = deserialize(serialize(input))
    expect(roundTrip).toEqual(input)
  })

  it('handles arrays of primitives and objects', () => {
    const input = {
      list: [1, 2, { a: 'x' }, { b: 'y' }],
    }
    const roundTrip = deserialize(serialize(input))
    expect(roundTrip).toEqual(input)
  })

  it('deduplicates repeated references', () => {
    const shared = { value: 42 }
    const input = { a: shared, b: shared }
    const result = serialize(input)

    const uuids = Object.keys(result.include)
    expect(uuids.length).toBe(1)
    expect(result.data.a).toEqual({ refId: uuids[0] })
    expect(result.data.b).toEqual({ refId: uuids[0] })

    const roundTrip = deserialize(result)
    expect(roundTrip.a).toBe(roundTrip.b)
    expect(roundTrip.a).toEqual(shared)
  })

  it('handles circular references', () => {
    const obj: Record<string, unknown> = { name: 'Selfie' }
    obj.self = obj

    const result = serialize(obj)
    const uuids = Object.keys(result.include)
    expect(uuids.length).toBe(1)

    const roundTrip = deserialize(result)
    expect(roundTrip.self).toBe(roundTrip)
  })

  it('handles deeply nested circular references', () => {
    const parent: Record<string, unknown> = { name: 'parent' }
    const child: Record<string, unknown> = { name: 'child', parent }
    parent.child = child

    const result = serialize(parent)
    const uuids = Object.keys(result.include)
    expect(uuids.length).toBe(2)

    const roundTrip = deserialize(result)
    expect(roundTrip.child.parent).toBe(roundTrip)
  })
})
