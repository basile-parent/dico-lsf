import yargs from "yargs/yargs"
import { hideBin } from "yargs/helpers"
import Logger from "@/common/logger"
import chalk from "chalk"
import { HelpExamples, HelpOptions } from "@/common/types"
import * as fs from "fs"

const helpOptions: HelpOptions = {
  f: {
    type: "string",
    description: "The JSON file to inject into the DB",
    alias: ["filepath"]
  },
  c: { type: "string", description: "Override configuration file", alias: ["config"] }
}

const helpExamples: HelpExamples = [
  [`npm run inject -- ${chalk.bold("-f=src/data/a.json")}`, "Inject the a.json file into the DB"],
  [`npm run inject -- ${chalk.bold("--filepath=src/data/a.json")}`, "Inject the a.json file into the DB"]
]

const getArguments = async () => {
  const argv = yargs(hideBin(process.argv)).options(helpOptions).example(helpExamples).help().parseSync()

  const filepath = argv.f as string

  if (!filepath) {
    Logger.error(`You have to pass a "filepath" argument.`)
    process.exit(1)
  }

  const fileExists = await existsAsync(filepath)
  if (!fileExists) {
    Logger.error(`The file specified does not exists ${chalk.red(filepath)}`)
    process.exit(1)
  }

  return argv
}

const existsAsync = (path: string): Promise<boolean> =>
  new Promise((resolve) => {
    fs.exists(path, (exists) => {
      resolve(exists)
    })
  })

export default getArguments
