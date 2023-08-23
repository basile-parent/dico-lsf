import listAllWords from "@/elix/listAllWords";
import * as fs from "fs";
import Logger from "@/common/logger";
import yargs from "yargs/yargs";
import {hideBin} from "yargs/helpers";
import {ElixHelpOptions, helpExamples, helpOptions} from "@/elix/constants";
import chalk from "chalk";

const argv = yargs(hideBin(process.argv))
    .options(helpOptions)
    .example(helpExamples)
    .help()
    .parseSync()

const letter = argv.l as string
const all = argv.a as boolean

console.log("letter", letter)
console.log("all", all)

if (letter && all) {
    Logger.error(`${ chalk.bgRed.whiteBright("ERROR")} You cannot pass both 'letter' and 'all' arguments.`)
    process.exit(1)
}

const letterRegex = /^[a-zA-Z]$/
if (!letterRegex.test(letter)) {
    Logger.error(`${ chalk.bgRed.whiteBright("ERROR")} The 'letter' should be a single character between A-Z (case insensitive). Found: ${ chalk.red(letter || "(empty)") }`)
    process.exit(1)
}

listAllWords(letter).then(allWords => {
    try {
        fs.writeFileSync(`src/data/${letter}.json`, JSON.stringify(allWords));
    } catch (err) {
        Logger.error(err);
    }
})
