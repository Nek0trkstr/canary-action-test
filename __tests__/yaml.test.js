/**
 * Unit tests for src/yaml.js
 */
import { expect } from '@jest/globals';
import { readConfig } from '../src/yaml.js'

describe('yaml.js', () => {
  it('Reads File', async () => {
    const yaml = await readConfig('./__tests__/fixture/configuration.yaml')
    expect(yaml).not.toBeNull();
    expect(yaml).not.toBeUndefined();
  })

  it('Parses file correctly', async () => {
    const yaml = await readConfig('./__tests__/fixture/configuration.yaml')
    expect(yaml.version).toBe("testValue")
  })
})

