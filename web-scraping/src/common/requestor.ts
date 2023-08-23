import axios, {AxiosError, AxiosResponse} from "axios";
import cheerio from "cheerio";
import Logger from "@/common/logger";
import chalk from "chalk";

class Requestor {
    getData = async (url: string): Promise<cheerio.Root | null> => {
        return axios.get(url)
            .then((response: AxiosResponse) => {
                const {data} = response
                return cheerio.load(data)
            })
            .catch((reason: AxiosError | Error) => {
                Logger.error(`${ chalk.bgRed.whiteBright("ERROR")} Error while trying to fetch data from url ${ url }`, (reason as AxiosError).response || reason.message)
                return null
            })
    }
}

export default new Requestor()