import Deployer from "../src/deployer";
import { expect } from "@jest/globals";
import MockGitHubClient from "../__mocks__/github";

describe('deployer.js', () => {
  it('Verifies that canary is enabled', async () => {
    const ghClient = new MockGitHubClient("secret_token")
    const deployer = new Deployer(ghClient, "staging", "canary01", "acme", "backend")

    const canaryEnabled = await deployer.isCanaryEnabled()
    expect(canaryEnabled).toBeTruthy()
  })

  it('Verifies that canary is not enabled', async () => {
    const ghClient = new MockGitHubClient("secret_token")
    const deployer = new Deployer(ghClient, "staging", "notcanary01", "acme", "backend")

    const canaryEnabled = await deployer.isCanaryEnabled()
    expect(canaryEnabled).toBeFalsy()
  })

  it('Updates the release', async () => {
    const ghClient = new MockGitHubClient("secret_token")
    const deployer = new Deployer(ghClient, "staging", "canary01", "acme", "backend")

    const newVersion = "vAmazingVersion"
    const updatedRelease = await deployer.updateRelease(newVersion, "canary")
    expect(updatedRelease).toMatch(newVersion)
  })
})
