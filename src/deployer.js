import YAML from 'yaml'

export default class Deployer {
  constructor(client, environment, cluster, merchant, service) {
    this.client = client
    this.environment = environment
    this.cluster = cluster
    this.merchant = merchant
    this.service = service
    this.releaseFileLocation = `deployments/clusters/${this.environment}/${this.cluster}/${this.merchant}-${this.service}/release.yaml`
  }

  async isCanaryEnabled() {
    const canaryFile = `deployments/clusters/${this.environment}/${this.cluster}/.canary-enabled`

    console.log(`Checking ${canaryFile}`)
    try {
      await this.client.getContent(canaryFile)
    } catch (err) {
      if (err.status == 404) {
        return false
      }

      throw err
    }

    return true
  }

  async updateRelease(version, stage) {
    const releaseFile = await this.client.getContent(this.releaseFileLocation)
    const oldRelease = Buffer.from(
      releaseFile.data.content,
      'base64'
    ).toString()
    let releaseYaml = YAML.parse(oldRelease)
    releaseYaml['spec']['values']['stage'][stage]['image']['tag'] = version
    return YAML.stringify(releaseYaml)
  }

  async proposeChange(updatedRelease, version) {
    const prName = `Release ${this.merchant}-${this.service} ${version}`
    const branchName = prName.toLowerCase().replaceAll(' ', '-')
    this.client.updateFile(this.releaseFileLocation, updatedRelease, branchName)
    this.client.openPR(prName, prName, branchName)
  }
}
