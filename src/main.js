import * as core from '@actions/core'
import { printDiff, printColorful } from './colorLogger'
import GitHubClient from './github'
import Deployer from './deployer'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const repositoryOwner = core.getInput('repositoryOwner')
    const repository = core.getInput('repository')
    const env = core.getInput('environment')
    const merchant = core.getInput('merchant')
    const version = core.getInput('version')
    const cluster = core.getInput('cluster')
    const service = core.getInput('service')
    const stage = core.getInput('stage')
    const token = core.getInput('token')

    const ghClient = new GitHubClient(token, repositoryOwner, repository)
    const deployer = new Deployer(ghClient, env, cluster, merchant, service)

    const canaryEnabled = await deployer.isCanaryEnabled()
    if (!canaryEnabled) {
      throw Error(
        `Canary is not available for ${env}/${cluster}. Make sure canary is supported by the cluster and .canary-enabled file exists`
      )
    }

    const prName = `Release ${merchant}-${service} ${version}`
    const branchName = prName.toLowerCase().replaceAll(' ', '-')

    const newRelease = await deployer.updateRelease(version, stage)
    const pr = await deployer.proposeChange(newRelease, prName, branchName)

    printDiff(pr.diff)
    printColorful(
      `:rocket: PR ${pr.number} was opened sucesfully ${pr.link} :rocket:`
    )
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
