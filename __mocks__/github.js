import path from 'path'
import YAML from 'yaml'
import { promises as fs } from "fs";

export default class MockGitHubClient {
  constructor(token) {
    this.token = token
  }

  async getContent(filePath, _) {
    const fixturePrefix = "__tests__/fixture"
    const __dirname = path.resolve();
    const releaseFilePath = path.join(__dirname, fixturePrefix ,filePath)

    try {
      const data = await fs.readFile(releaseFilePath, {encoding: 'utf-8'}, async () => {})
      return {
        data: {
          content: btoa(data)
        }
      }
    }
    catch(err) {
      // Imitate GitHub behaviour
      err.status = 404
      throw err
    }
  }

  async updateFile(filePath, content, branch) {}
}
