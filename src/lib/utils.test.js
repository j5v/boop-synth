import { joinItems } from './utils.js'

describe('joinItems()', () => {
  it('Joins two items with provided separator', () => {
    const r = joinItems(['a', 'b'], '-');
    expect(r).toBe('a-b');
  });
  it('defaults to ", " separator', () => {
    const r = joinItems(['a', 'b']);
    expect(r).toBe('a, b');
  })
})