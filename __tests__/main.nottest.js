/**
 * Unit tests for the action's main functionality, src/main.js
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as GitHubClient from '../src/github.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
// jest.unstable_mockModule('../src/github.js', () => GitHubClient)
jest.mock('./src/github.js')
// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.js', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation(function (argument) {
      switch (argument) {
        case 'environment':
          return 'staging'
        case 'merchant':
          return 'acme'
        case 'version':
          return 'v777'
        case 'cluster':
          return 'canary'
        case 'service':
          return 'backend'
        case 'stage':
          return 'canary'
        case 'token':
          return 'secretToken'
        default:
          return 'UNKNOWN_ARGUMENT'
      }
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets a failed status', async () => {
    // Clear the getInput mock and return an invalid value.
    core.getInput.mockClear().mockReturnValueOnce('this is not a number')

    await run()

    expect(GitHubClient).toHaveBeenCalled()
  })
})
