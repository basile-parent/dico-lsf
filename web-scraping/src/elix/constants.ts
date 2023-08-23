import {HelpExamples, HelpOptions} from "@/common/types";
import chalk from "chalk";

export const SITE_PREFIX = "https://dico.elix-lsf.fr"

export type ElixHelpOptions = HelpOptions & {
    l: string
    a: boolean
}
export const helpOptions: HelpOptions = {
    l: { type: "string", description: "The letter to scrap (cannot be used with 'all' argument)", alias: [ "letter" ] },
    a: { type: "boolean", description: "Scrap all letters (cannot be used with 'letter' argument)",  default: false, alias: [ "all" ] },
}

export const helpExamples: HelpExamples = [
    [ `npm run elix:scrap -- ${chalk.bold("-l=a")}`, "Scrap the website for the letter A" ],
    [ `npm run elix:scrap -- ${chalk.bold("-a")}`, "Scrap the website for all letters" ],
]