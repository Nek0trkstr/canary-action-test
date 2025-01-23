import PR from './models/pr'
import * as github from '@actions/github'

export default class GitHubClient {
  constructor(token, owner = 'Nek0trkstr', repo = 'canary-action-test') {
    this.client = new github.getOctokit(token)
    this.owner = owner
    this.repo = repo
  }

  async getContent(filePath, branch = 'master') {
    const result = await this.client.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      ref: branch,
      path: filePath
    })

    return result
  }

  async createBranch(branchName) {
    const shaRef = await this.client.rest.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: 'heads/master'
    })

    try {
      await this.client.rest.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${branchName}`,
        sha: shaRef.data.object.sha
      })
    } catch (err) {
      if (
        err.response.data.status == 422 &&
        err.response.data.message == 'Reference already exists'
      ) {
        console.log(`Branch ${branchName} already exists - skipping`)
        return
      }
    }
  }

  async updateFile(filePath, content, branch = 'master') {
    const originalFile = await this.client.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      ref: branch,
      path: filePath
    })

    const originalFileSHA = originalFile.data.sha

    await this.client.rest.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      branch: branch,
      path: filePath,
      message: 'test-update',
      content: btoa(content),
      sha: originalFileSHA,
      committer: {
        name: 'Michael Shebeko',
        email: 'mshebeko@gmail.com'
      },
      author: {
        name: 'Michael Shebeko',
        email: 'mshebeko@gmail.com'
      }
    })
  }

  async openPR(title, body, headBranch, baseBranch = 'master') {
    let targetPR
    let PRCreated = false
    const openedPRs = await this.client.request(
      'GET /repos/{owner}/{repo}/pulls',
      {
        owner: this.owner,
        repo: this.repo,
        state: 'open'
      }
    )

    openedPRs.data.forEach((pr) => {
      const headBranchPR = pr.head.ref
      if (headBranchPR == headBranch) {
        PRCreated = true
        targetPR = pr
      }
    })

    if (PRCreated) {
      console.log('PR is already created - skipping PR creation')
    } else {
      targetPR = await this.client.rest.pulls.create({
        owner: this.owner,
        repo: this.repo,
        head: headBranch,
        base: baseBranch,
        title: title,
        body: body
      }).data
    }

    const prNumber = targetPR.number
    const prLink = targetPR._links.html.href
    const diffResp = await this.client.rest.pulls.get({
      owner: this.owner,
      repo: this.repo,
      pull_number: prNumber,
      mediaType: {
        format: 'diff'
      }
    })
    const prDiff = diffResp.data

    return new PR(prNumber, prDiff, prLink)
  }
}
