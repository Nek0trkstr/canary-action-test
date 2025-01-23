import chalk from 'chalk'

export default function printDiff(diff) {
  diff.split('\n').forEach((line) => {
    line = line.trimStart()
    if (line.startsWith('+') && !line.startsWith('+++')) {
      console.log(chalk.green(line))
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      console.log(chalk.red(line))
    } else {
      console.log(line)
    }
  })
}
