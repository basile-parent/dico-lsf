import listAllWordsWithLetterSearchLinks from "./listAllWordsWithLetterSearchLinks"
import { ElixWord } from "./types"
import Logger from "@/common/logger"
import chalk from "chalk"
import { extractWord } from "@/elix/scrapWord"

const scrapLetter = async (letter: string): Promise<ElixWord[]> => {
  Logger.info(`Scraping Elix for the letter "${chalk.blue.bold(letter)}".`)
  const allLetterRefLinks = await listAllWordsWithLetterSearchLinks(letter)
  const words = (await Promise.all(allLetterRefLinks.map(async (word) => await extractWord(word)))).flatMap((w) => w)

  Logger.info(
    `Found ${chalk.blue.bold(words.length)} different word definitions for the letter ${chalk.blue.bold(letter)}.`
  )

  return words
}

export default scrapLetter
