import yargs from "yargs/yargs"
import { hideBin } from "yargs/helpers"
import Logger from "@/common/logger"
import chalk from "chalk"
import { HelpExamples, HelpOptions } from "@/common/types"

const helpOptions: HelpOptions = {
  l: {
    type: "string",
    description: `Scrap a letter: all words starting with this letter (cannot be used with "all" argument)`,
    alias: ["letter"]
  },
  w: {
    type: "string",
    description: `Scrap a word and all it's definitions (cannot be used with "all" argument)`,
    default: false,
    alias: ["word"]
  },
  a: {
    type: "boolean",
    description: `Scrap all letters (cannot be used with "letter" or "word" argument)`,
    default: false,
    alias: ["all"]
  },
  c: { type: "string", description: "Override configuration file", alias: ["config"] }
}

const helpExamples: HelpExamples = [
  [`npm run scrap:elix -- ${chalk.bold("-l=a")}`, "Scrap the website for the letter A"],
  [
    `npm run scrap:elix -- ${chalk.bold(`--word="eau de bouchain"`)}`,
    `Scrap the website for the word "eau de bouchain"`
  ],
  [`npm run scrap:elix -- ${chalk.bold("-a")}`, "Scrap the website for all letters"]
]

const getArguments = () => {
  const argv = yargs(hideBin(process.argv)).options(helpOptions).example(helpExamples).help().parseSync()

  const letter = argv.l as string
  const word = argv.w as string
  const all = argv.a as boolean

  if ((letter || word) && all) {
    Logger.error(`You cannot pass both "letter" and "all" arguments.`)
    process.exit(1)
  }

  const letterRegex = /^[a-zA-Z]$/
  if (letter && !letterRegex.test(letter)) {
    Logger.error(
      `The "letter" should be a single character between A-Z (case insensitive). Found: ${chalk.red(
        letter || "(empty)"
      )}`
    )
    process.exit(1)
  }

  return argv
}

export default getArguments
