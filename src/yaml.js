import YAML from 'yaml'
import { promises as fs } from "fs";
import path from 'path'

export async function readConfig(configFile) {
  const __dirname = path.resolve();
  const filePath = path.join(__dirname, configFile)

  const data = await fs.readFile(filePath, {encoding: 'utf-8'}, async (err, data) => {
    if (!err) {
      console.log('received data: ' + data);
    } else {
      console.log(err);
    }
  })

  const parsedYaml = YAML.parse(data)
  return parsedYaml
}