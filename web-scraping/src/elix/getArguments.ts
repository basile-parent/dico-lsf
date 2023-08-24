import yargs from "yargs/yargs";
import {hideBin} from "yargs/helpers";
import {helpExamples, helpOptions} from "@/elix/constants";
import Logger from "@/common/logger";
import chalk from "chalk";

const getArguments = () => {
    const argv = yargs(hideBin(process.argv))
        .options(helpOptions)
        .example(helpExamples)
        .help()
        .parseSync()

    const letter = argv.l as string
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