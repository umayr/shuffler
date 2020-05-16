import { renderHook, act } from '@testing-library/react-hooks'

import useShuffler, { shuffler } from './useShuffler'

test('shuffles the list', () => {
  const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const r0 = shuffler(list)
  const r1 = shuffler(list)
  const r2 = shuffler(list)
  const r3 = shuffler(list)

  expect(r0).not.toEqual(list)
  expect(r1).not.toEqual(list)
  expect(r2).not.toEqual(list)
  expect(r3).not.toEqual(list)
  expect(r0).not.toEqual(r1)
  expect(r0).not.toEqual(r2)
  expect(r0).not.toEqual(r3)
  expect(r1).not.toEqual(r2)
  expect(r1).not.toEqual(r3)
  expect(r2).not.toEqual(r3)
})

test('shuffles without any changes', () => {
  const list = [1, 2, '3']

  const result = shuffler(list)

  expect(new Set([...list])).toEqual(new Set([...result]))
})

test('returns shuffled list', () => {
  const initial = [1, 2, 3, 4, 5]
  const { result } = renderHook(() => useShuffler(initial))

  const [list] = result.current

  expect(list).not.toEqual(initial)
})
