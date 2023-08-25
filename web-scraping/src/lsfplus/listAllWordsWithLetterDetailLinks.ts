import { BasicLink } from "@/common/types"
import Requestor from "@/common/requestor"
import Config from "@/common/config"

const getLetterIndexPageLink = (letter): string => Config.env.LSFPLUS.LETTER_INDEX_URL.replace("[letter]", letter)

const listAllIndexPages = async (letter): Promise<BasicLink[]> => {
  const allIndexPageLinks = [] as BasicLink[]
  const letterIndexPageLink = getLetterIndexPageLink(letter)
  const $ = await Requestor.getData(letterIndexPageLink)

  if (!$) {
    return []
  }

  allIndexPageLinks.push({ title: "Page 1", link: letterIndexPageLink })
  $("ul.pager .pager-item a, ul.pager .pager-current a").each((_idx, el) => {
    const title = $(el).text()
    const link = $(el).attr("href")
    allIndexPageLinks.push({ title: "Page " + title, link: Config.env.LSFPLUS.BASE_URL + link })
  })

  return allIndexPageLinks
}

const listAllWordsWithLetterDetailLinks = async (letter): Promise<BasicLink[]> => {
  const dictionnaryReferenceLink = [] as BasicLink[]
  const indexPages = await listAllIndexPages(letter)
  for (const indexPage of indexPages) {
    const $ = await Requestor.getData(indexPage.link)

    if (!$) {
      continue
    }

    $(".views-row").each((_idx, el) => {
      const title = $(el).find(".views-field-name").text()
      const link = $(el).find("a").attr("href")
      dictionnaryReferenceLink.push({
        title,
        link: Config.env.LSFPLUS.BASE_URL + link
      })
    })
  }

  return dictionnaryReferenceLink
}

export default listAllWordsWithLetterDetailLinks
