import {ElixBasicLink} from "./types";
import Logger from "@/common/logger";
import chalk from "chalk";
import {SITE_PREFIX} from "./constants";
import Requestor from "@/common/requestor";

const getLetterIndexPageLink = (letter) => `https://dico.elix-lsf.fr/index-alphabetique/${letter}`

const listAllIndexPages = async (letter): Promise<ElixBasicLink[]> => {
    const allIndexPageLinks = [] as ElixBasicLink[]
    const $ = await Requestor.getData(getLetterIndexPageLink(letter))

    if (!$) {
        return []
    }

    $("nav.pagination a").each((_idx, el) => {
        const title = $(el).text()
        const link = $(el).attr("href")
        allIndexPageLinks.push({title: "Page " + title, link: SITE_PREFIX + link})
    })

    return allIndexPageLinks
}

const listAllLetterRefLinks = async (letter): Promise<ElixBasicLink[]> => {
    const dictionnaryReferenceLink = [] as ElixBasicLink[]
    const indexPages = await listAllIndexPages(letter)
    for (const indexPage of indexPages) {
        const $ = await Requestor.getData(indexPage.link)

        if (!$) {
            continue
        }

        $("ul.words > li > a").each((_idx, el) => {
            const title = $(el).text()
            const link = $(el).attr("href")
            dictionnaryReferenceLink.push({title, link: SITE_PREFIX + link})
        })
    }

    Logger.debug(`Found ${chalk.blue.bold(dictionnaryReferenceLink.length)} links for the letter ${chalk.blue.bold(letter)}.`)
    return dictionnaryReferenceLink
}

export default listAllLetterRefLinks

