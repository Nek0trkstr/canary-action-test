import * as core from '@actions/core'
import * as github from '@actions/github'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const env = core.getInput('environment')
    const merchant = core.getInput('merchant')
    const version = core.getInput('version')
    const token = core.getInput('token')

    const octokit = new github.getOctokit(token)

    const result = await octokit.rest.repos.getContent({
      owner: 'payrails',
      repo: 'infrastructure',
      path: 'deployments/clusters/staging/merchant01/sandbox-backend/release.yaml'
    })

    const content = Buffer.from(result.data.content, 'base64').toString()
    core.info(content)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
