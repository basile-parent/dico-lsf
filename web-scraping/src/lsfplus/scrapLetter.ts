import Logger from "@/common/logger"
import chalk from "chalk"
import listAllWordsWithLetterDetailLinks from "@/lsfplus/listAllWordsWithLetterDetailLinks"
import { Word } from "@/common/word"
import extractWordsFromDetailPage from "@/lsfplus/extractWordsFromDetailPage"

const scrapLetter = async (letter: string): Promise<Word[]> => {
  Logger.info(`Scraping LSF plus for the letter "${chalk.blue.bold(letter)}".`)

  const allLetterDetailLinks = await listAllWordsWithLetterDetailLinks(letter)
  Logger.debug(`Found ${chalk.blue.bold(allLetterDetailLinks.length)} links for the letter ${chalk.blue.bold(letter)}.`)

  return (await Promise.all(allLetterDetailLinks.map(extractWordsFromDetailPage))).flatMap((w) => w)
}

export default scrapLetter
