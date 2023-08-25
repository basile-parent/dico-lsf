import { BasicLink } from "@/common/types"
import Requestor from "@/common/requestor"
import Config from "@/common/config"

const getLetterIndexPageLink = (letter): string => Config.env.ELIX.LETTER_INDEX_URL.replace("[letter]", letter)

const listAllIndexPages = async (letter): Promise<BasicLink[]> => {
  const allIndexPageLinks = [] as BasicLink[]
  const $ = await Requestor.getData(getLetterIndexPageLink(letter))

  if (!$) {
    return []
  }

  $("nav.pagination a").each((_idx, el) => {
    const title = $(el).text()
    const link = $(el).attr("href")
    allIndexPageLinks.push({ title: "Page " + title, link: Config.env.ELIX.BASE_URL + link })
  })

  return allIndexPageLinks
}

const listAllWordsWithLetterSearchLinks = async (letter): Promise<BasicLink[]> => {
  const dictionnaryReferenceLink = [] as BasicLink[]
  const indexPages = await listAllIndexPages(letter)
  for (const indexPage of indexPages) {
    const $ = await Requestor.getData(indexPage.link)

    if (!$) {
      continue
    }

    $("ul.words > li > a").each((_idx, el) => {
      const title = $(el).text()
      const link = $(el).attr("href")
      dictionnaryReferenceLink.push({ title, link: Config.env.ELIX.BASE_URL + link })
    })
  }

  return dictionnaryReferenceLink
}

export default listAllWordsWithLetterSearchLinks
