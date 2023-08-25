import { ElixBasicLink, ElixWord } from "./types"
import Requestor from "@/common/requestor"
import { getWordType, VideoLink, WordType } from "@/common/word"
import Logger from "@/common/logger"
import chalk from "chalk"
import Config from "@/common/config"
import elixUtils from "@/elix/elixUtils"

export const listAllDetailLinksFromSearchPage = async (searchPageLink: ElixBasicLink): Promise<ElixBasicLink[]> => {
  const $ = await Requestor.getData(searchPageLink.link)
  if (!$) {
    throw new Error("Cannot get data from url " + searchPageLink.link)
  }

  return (
    $("section.word .meaning")
      .map((_idx, elt) => {
        const title = $(elt).siblings(".word__title").text()
        const link = $(elt).find(".infos a.button").attr("href")
        return {
          title,
          link: Config.env.ELIX.BASE_URL + link,
          traceLink: searchPageLink.link
        } as ElixBasicLink
      })
      .get()
      // Remove duplicates
      .filter((item, pos, self) => self.findIndex((basicLink) => basicLink.link === item.link) === pos)
  )
}

export const extractWordFromDetailPage = async (detailLink: ElixBasicLink): Promise<ElixWord | null> => {
  Logger.debug(`${chalk.grey("Extracting word:")} ${detailLink.title} (${detailLink.link})`)
  const $signVideos = await Requestor.getData(detailLink.link)

  if (!$signVideos) {
    return null
  }

  if (!isCorrectWordPage($signVideos)) {
    Logger.warn(
      `The url for the word ${chalk.blue.bold(detailLink.title)} seems to lead to an uncorrect page: ${detailLink.link}`
    )
    return null
  }

  const $definitionVideos = await Requestor.getData(detailLink.link + "/definition")

  const [word, type] = parseTitle($signVideos("h1").text())
  const definition = $signVideos(".definition").text()

  const links = getAllPageVideos($signVideos)
  const definitionLinks = $definitionVideos ? getAllPageVideos($definitionVideos) : undefined

  const sources = [detailLink.link]

  return { word, type, definition, links, definitionLinks, sources }
}

const extractWord = async (searchWordLink: ElixBasicLink): Promise<ElixWord[]> => {
  const detailLinks = await listAllDetailLinksFromSearchPage(searchWordLink)
  const words = [] as ElixWord[]

  if (!detailLinks.length) {
    Logger.warn(
      `Seems to not have any detail page for word "${chalk.blue(searchWordLink.title)}" at url ${searchWordLink.link}`
    )
    return []
  }

  for (const detailLink of detailLinks) {
    const extractedWord = await extractWordFromDetailPage(detailLink)
    extractedWord && words.push(extractedWord)
  }

  return words
}

const scrapWord = async (word: string | ElixBasicLink): Promise<ElixWord[]> => {
  const wordLink = (word as ElixBasicLink).title
    ? (word as ElixBasicLink)
    : ({ title: word, link: elixUtils.buidSearchPageUrl(word as string) } as ElixBasicLink)

  Logger.info(`Scraping Elix for all definitions of the word "${chalk.blue.bold(wordLink.title)}".`)

  const words = await extractWord(wordLink)

  Logger.info(
    `Found ${chalk.blue.bold(words.length)} different word definitions for the word ${chalk.blue.bold(wordLink.link)}.`
  )

  return words
}

const parseTitle = (text: string): [string, WordType[]] => {
  return [
    text.substring(0, text.indexOf("(")).trim(),
    getWordType(text.substring(text.indexOf("(") + 1, text.indexOf(")")).trim())
  ]
}

const getAllPageVideos = ($signVideos: cheerio.Root) => {
  const allVideoLinks = $signVideos(".meaning-videos li")
    .map((_idx, elt) => $signVideos(elt).find("video").attr("src"))
    .get() as string[]
  return allVideoLinks.map((link) => ({ source: "Elix", type: "website_resource", link })) as VideoLink[]
}

const isCorrectWordPage = (data): boolean => {
  return !!data(".meaning-videos").length
}

export default scrapWord
