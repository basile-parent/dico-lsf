import listAllWords from "@/elix/listAllWords";
import * as fs from "fs";
import Logger from "@/common/logger";
import getArguments from "@/elix/getArguments";

const argv = getArguments()

const letter = argv.l as string

if (letter) {
    listAllWords(letter).then(allWords => {
        try {
            fs.writeFileSync(`src/data/${letter}.json`, JSON.stringify(allWords));
        } catch (err) {
            Logger.error(err);
        }
    })
} else {
    Logger.info("The 'all' option hasn't been implemented yet.")
}