import { BasicLink } from "@/common/types"
import Requestor from "@/common/requestor"
import { Word } from "@/common/word"
import Logger from "@/common/logger"
import Config from "@/common/config"

const extractWordsFromDetailPage = async (wordLink: BasicLink): Promise<Word[]> => {
  const $ = await Requestor.getData(wordLink.link)

  if (!$) {
    Logger.error(`Impossible to get HTML data from URL ${wordLink.link}.`)
    return []
  }

  return $(".views-row")
    .map((_idx, elt) => {
      const wordTitle = $(elt).find(".views-field-name .field-content").text()
      const word = wordTitle.substring(wordTitle.indexOf(":") + 2)

      const link = Config.env.LSFPLUS.BASE_URL + $(elt).find(".views-field-field-lien-video source").first().attr("src")

      return {
        word: word,
        type: [],
        definition: undefined,
        sources: [wordLink.link],
        links: link
          ? [
              {
                link,
                type: "website_resource",
                source: "LSFPlus"
              }
            ]
          : []
      }
    })
    .get()
}

export default extractWordsFromDetailPage
