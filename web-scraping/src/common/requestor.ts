import axios from "axios";
import cheerio from "cheerio";

class Requestor {
    getData = async (url: string): Promise<cheerio.Root> => {
        const {data} = await axios.get(url)
        return cheerio.load(data)
    }
}

export default new Requestor()