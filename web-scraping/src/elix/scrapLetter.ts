import listAllWordsWithLetterSearchLinks from "./listAllWordsWithLetterSearchLinks"
import {ElixWord} from "./types"
import Logger from "@/common/logger"
import chalk from "chalk"
import {extractWordFromDetailPage, listAllDetailLinksFromSearchPage} from "@/elix/scrapWord"

const scrapLetter = async (letter: string): Promise<ElixWord[]> => {
    Logger.info(`Scraping Elix for the letter "${chalk.blue.bold(letter)}".`)

    const allLetterSearchLinks = await listAllWordsWithLetterSearchLinks(letter)
    Logger.debug(
        `Found ${chalk.blue.bold(allLetterSearchLinks.length)} links for the letter ${chalk.blue.bold(letter)}.`
    )

    const allWordsDetailLinks =
        (await Promise.all(allLetterSearchLinks
            .map(async (searchLink) => await listAllDetailLinksFromSearchPage(searchLink))))
            .flatMap((l) => l)

    // Remove duplicates
    const cleanedDetailLinks = allWordsDetailLinks
        .filter((detailLink, index) => allWordsDetailLinks.findIndex(l => l.link === detailLink.link) === index)
    Logger.debug(`Found ${chalk.blue.bold(cleanedDetailLinks.length)} detail links (without duplicates - of totla ${allWordsDetailLinks.length}).`)
    if (cleanedDetailLinks.length !== allWordsDetailLinks.length) {
        const duplicateLinks = allWordsDetailLinks
            .sort((a, b) => a.title.localeCompare(b.title))
            .filter((detailLink, index) => allWordsDetailLinks.findIndex(l => l.link === detailLink.link) !== index)
        Logger.debug(`The removed duplicated are:`)
        duplicateLinks.forEach(duplicate => {
            Logger.debug(`\t- ${duplicate.title}: ${duplicate.link} ${duplicate.traceLink ? `(from ${duplicate.traceLink})` : ""}`)
        })
    }

    const words = (await Promise.all(cleanedDetailLinks.map(async (word) => await extractWordFromDetailPage(word)))).flatMap((w) => w)

    Logger.info(
        `Found ${chalk.blue.bold(words.length)} different word definitions for the letter ${chalk.blue.bold(letter)}.`
    )

    return words
}

export default scrapLetter
