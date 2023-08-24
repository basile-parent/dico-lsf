import axios from "axios"
import cheerio from "cheerio"
import Logger from "@/common/logger"

class Requestor {
  getData = async (url: string): Promise<cheerio.Root | null> => {
      try {
          const {data} = await axios.get(url)
          return cheerio.load(data)
      } catch (error) {
          Logger.error(`Error while trying to fetch data from url ${url}`, error.message)
          return null
      }
  }
}

export default new Requestor()
