import Config from "@/common/config"

const buidSearchPageUrl = (search: string) => encodeURI(Config.env.ELIX.SEARCH_URL.replace("[search]", search))

export default {
  buidSearchPageUrl
}
