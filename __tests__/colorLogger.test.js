import printDiff from '../src/colorLogger'
import { expect } from '@jest/globals'

describe('colorLogger.js', () => {
  it('Prints in color', async () => {
    const diff = `
    + Green
    - Red
    +++ No green
    --- No red
    Default
    `
    printDiff(diff)
  })
})
