import scrapLetter from "@/elix/scrapLetter";
import * as fs from "fs";
import Logger from "@/common/logger";
import getArguments from "@/elix/getArguments";
import chalk from "chalk";
import scrapWord from "@/elix/scrapWord";

const argv = getArguments()

const letter = argv.l as string
const word = argv.w as string

if (letter) {
    scrapLetter(letter).then(allWords => {
        try {
            const filePath = `src/data/${letter}.json`;
            fs.writeFileSync(filePath, JSON.stringify(allWords));
            Logger.info(`Wrote ${ chalk.blue(allWords.length) } words in the ${ chalk.blue(filePath) } file`)
        } catch (err) {
            Logger.error(err);
        }
    })
} else if (word) {
    scrapWord(word).then(allWords => {
        try {
            const filePath = `src/data/${word}.json`;
            fs.writeFileSync(filePath, JSON.stringify(allWords));
            Logger.info(`Wrote ${ chalk.blue(allWords.length) } words in the ${ chalk.blue(filePath) } file`)
        } catch (err) {
            Logger.error(err);
        }
    })
} else {
    Logger.info("The 'all' option hasn't been implemented yet.")
}