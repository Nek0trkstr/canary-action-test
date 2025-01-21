import GitHubClient from '../src/github'

const ghToken = process.env.GH_TOKEN
const ghClient = new GitHubClient(ghToken)

describe('github.js', () => {
  it('Gets content', async () => {
    const content = await ghClient.getContent('LICENSE')
    expect(content).not.toBeUndefined()
    expect(content).not.toBeNull()
  })

  it('Create a branch', async () => {
    await ghClient.createBranch('test-action')
  })

  it('Update a file', async () => {
    const content = await ghClient.getContent('LICENSE', 'test-action')
    const textContent = Buffer.from(content.data.content, 'base64').toString()
    const updateTextContent = textContent + '\nTEST'
    await ghClient.updateFile('LICENSE', updateTextContent, 'test-action')
  })

  it('Open a PR', async () => {
    await ghClient.openPR('Test octokit', 'Without files', 'test-action')
  })
})
