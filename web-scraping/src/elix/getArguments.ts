import yargs from "yargs/yargs";
import {hideBin} from "yargs/helpers";
import Logger from "@/common/logger";
import chalk from "chalk";
import {HelpExamples, HelpOptions} from "@/common/types";

const helpOptions: HelpOptions = {
    l: { type: "string", description: "The letter to scrap (cannot be used with 'all' argument)", alias: [ "letter" ] },
    a: { type: "boolean", description: "Scrap all letters (cannot be used with 'letter' argument)", default: false, alias: [ "all" ] },
    c: { type: "boolean", description: "Override configuration file", alias: [ "config" ] },
}

const helpExamples: HelpExamples = [
    [ `npm run elix:scrap -- ${chalk.bold("-l=a")}`, "Scrap the website for the letter A" ],
    [ `npm run elix:scrap -- ${chalk.bold("-a")}`, "Scrap the website for all letters" ],
]

const getArguments = () => {
    const argv = yargs(hideBin(process.argv))
        .options(helpOptions)
        .example(helpExamples)
        .help()
        .parseSync()

    const letter = argv.l as string
    const word = argv.w as string
    const all = argv.a as boolean

    if (letter && all) {
        Logger.error(`You cannot pass both 'letter' and 'all' arguments.`)
        process.exit(1)
    }

    const letterRegex = /^[a-zA-Z]$/
    if (!letterRegex.test(letter)) {
        Logger.error(`The 'letter' should be a single character between A-Z (case insensitive). Found: ${ chalk.red(letter || "(empty)") }`)
        process.exit(1)
    }

    return argv
}

export default getArguments