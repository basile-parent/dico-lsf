import scrapLetter from "./scrapLetter"
import * as fs from "fs"
import Logger from "@/common/logger"
import getArguments from "./getArguments"
import chalk from "chalk"

const argv = getArguments()

const letter = argv.l as string

if (letter) {
  scrapLetter(letter).then((allWords) => {
    try {
      const filePath = `src/data/lsfplus-${letter}.json`
      fs.writeFileSync(filePath, JSON.stringify(allWords))
      Logger.info(`Wrote ${chalk.blue(allWords.length)} words in the ${chalk.blue(filePath)} file`)
    } catch (err) {
      Logger.error(err)
    }
  })
} else {
  Logger.info("The 'all' option hasn't been implemented yet.")
}
