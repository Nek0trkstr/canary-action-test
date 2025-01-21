import * as github from '@actions/github'

export default class GitHubClient {
  constructor(token, owner = 'Nek0trkstr', repo = 'canary-action-test') {
    this.client = new github.getOctokit(token)
    this.owner = owner
    this.repo = repo
  }

  async getContent(filePath, branch) {
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
      ref: 'heads/main'
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
        return
      }
    }
  }

  async updateFile(filePath, content, branch) {
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

  async openPR(title, body, headBranch, baseBranch = 'main') {
    let PRCreated = false
    const openedPRs = await this.client.request(
      'GET /repos/{owner}/{repo}/pulls',
      {
        owner: 'Nek0trkstr',
        repo: 'canary-action-test',
        state: 'open'
      }
    )

    openedPRs.data.forEach((pr) => {
      const headBranchPR = pr.head.ref
      if (headBranchPR == headBranch) {
        PRCreated = true
      }
    })

    if (PRCreated) {
      console.log('PR is already created - skipping PR creation')
      return
    }

    await this.client.rest.pulls.create({
      owner: 'Nek0trkstr',
      repo: 'canary-action-test',
      head: headBranch,
      base: baseBranch,
      title: title,
      body: body
    })
  }
}
