import listAllLetterRefLinks from "./listAllLetterRefLinks"
import {ElixBasicLink, ElixWord} from "./types";
import Requestor from "@/common/requestor";
import {getWordType, VideoLink, WordType} from "@/common/word";
import Logger from "@/common/logger";
import chalk from "chalk";
import {SITE_PREFIX} from "./constants";

const getAllDetailledLinks = async letter => {
    const detailledLinks = [] as ElixBasicLink[]
    const allLetterRefLinks = await listAllLetterRefLinks(letter)

    for (const refLink of allLetterRefLinks) {
        Logger.debug(`${ chalk.grey("Searching reflinks word:")} ${ refLink.title } (${refLink.link})`)
        const $ = await Requestor.getData(refLink.link)
        if (!$) {
            continue
        }

        $("section.word").each((_idx, elt) => {
            const title = $(elt).find(".word__title").text()
            const link = $(elt).find(".infos a.button").attr("href")
            if (!detailledLinks.find(existingLink => existingLink.link === link)) {
                detailledLinks.push({title, link: SITE_PREFIX + link})
            }
        })
    }

    return detailledLinks;
}

const parseTitle = (text: string): [ string, WordType[] ] => {
    return [
        text.substring(0, text.indexOf("(")).trim(),
        getWordType(text.substring(text.indexOf("(") + 1, text.indexOf(")")).trim())
    ]
}

const listAllWords = async (letter): Promise<ElixWord[]> => {
    Logger.info(`Scraping Elix for the letter ${chalk.blue.bold(letter)}.`)
    const detailledLinks = await getAllDetailledLinks(letter);
    const words = [] as ElixWord[]

    for (const detailLink of detailledLinks) {
        Logger.debug(`${ chalk.grey("Scraping word:")} ${ detailLink.title } (${detailLink.link})`)
        const $signVideos = await Requestor.getData(detailLink.link)

        if (!$signVideos) {
            continue
        }

        if (!isCorrectWordPage($signVideos)) {
            Logger.warn(`${ chalk.bgRed("WARN:") } The url for the word ${ chalk.blue.bold(detailLink.title) } seems to lead to an uncorrect page: ${ detailLink.link }`)
            continue
        }

        const $definitionVideos = await Requestor.getData(detailLink.link + "/definition")

        if (!$definitionVideos) {
            continue
        }

        const [word, type] = parseTitle($signVideos("h1").text())
        const definition = $signVideos(".definition").text()

        const links = getAllPageVideos($signVideos);
        const definitionLinks = getAllPageVideos($definitionVideos);

        words.push({ word, type, definition, links, definitionLinks })
    }

    Logger.info(`Found ${chalk.blue.bold(words.length)} different word definitions for the letter ${chalk.blue.bold(letter)}.`)

    return words
}

const getAllPageVideos = ($signVideos: cheerio.Root) => {
    const allVideoLinks = $signVideos(".meaning-videos li").map((_idx, elt) => $signVideos(elt).find("video").attr("src")).get() as string[]
    return allVideoLinks.map(link => ({source: "Elix", type: "website_resource", link})) as VideoLink[];
};

const isCorrectWordPage = (data): boolean => {
    return !!data(".meaning-videos").length
}

export default listAllWords