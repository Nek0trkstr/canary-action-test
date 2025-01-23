import chalk from 'chalk'

export default function printDiff(diff) {
  diff.split('\n').forEach((line) => {
    const trimmedLine = line.trimStart()
    if (trimmedLine.startsWith('+') && !trimmedLine.startsWith('+++')) {
      console.log(chalk.green(line))
    } else if (trimmedLine.startsWith('-') && !trimmedLine.startsWith('---')) {
      console.log(chalk.red(line))
    } else {
      console.log(line)
    }
  })
}
