import * as fs from "fs";
import WordModel, {DBWord} from "@/dbInjector/models/wordModel";
import {Word} from "@/common/word";
import Logger from "@/common/logger";
import _ from "lodash";
import chalk from "chalk";
import {s} from "@/utils/stringUtils";

// Note: the file existence has already been checked
const injectFromFile = async (jsonFilePath: string) => {
    Logger.info(`Injecting file ${chalk.blue(jsonFilePath.substring(jsonFilePath.lastIndexOf("/") + 1))} into the database.`)
    const data = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"))
        .filter(data => data.word === "Zambien") as Word[]

    const stats = {
        inserted: 0,
        updated: 0
    }

    for (let datum of data) {
        const existingWords = await WordModel.find({word: datum.word})

        Logger.debug(`Injecting '${datum.word}' (${datum.type.join(",")}): found ${existingWords.length} corresponding word(s)`)

        if (!existingWords.length) {
            // await WordModel.create(datum)
            stats.inserted++
            Logger.debug(`\tWord '${datum.word}' inserted in DB`)
        } else {
            const existingWord = findExistingWord(existingWords, datum)
            if (!existingWord) {
                Logger.warn(`Cannot find the exact matching word between the ${ chalk.blue(existingWords.length) } occurences of the word '${ chalk.blue(datum.word)}'. This word will be ignored.`)
                continue
            }
            Logger.debug(_.merge(existingWord, datum))
            // await WordModel.updateOne({id: existingWord._id}, _.merge(existingWord, datum))
            stats.updated++
            Logger.debug(`\tWord '${datum.word}' updated in DB`)
        }
    }

    Logger.info(`File injected. ${chalk.blue(stats.inserted)} word${s(stats.inserted)} created. ${chalk.blue(stats.updated)} word${s(stats.updated)} updated.`)
}

const findExistingWord = (existingWords: DBWord[], wordToTreat: Word): DBWord | null => {
    if (existingWords.length === 1) {
        return existingWords[0]
    }

    if ((wordToTreat as DBWord)._id) {
        const existingWord = existingWords.find(word => word._id === (wordToTreat as DBWord)._id)
        if (existingWord) {
            return existingWord
        }
    }

    return findMatchingWords(existingWords, wordToTreat, existingWord => existingWord.type.length === wordToTreat.type.length && wordToTreat.type.every(t => existingWord.type.includes(t)))
        || findMatchingWords(existingWords, wordToTreat, existingWord => existingWord.definition === wordToTreat.definition)
        || findMatchingWords(existingWords, wordToTreat, existingWord => existingWord.links.some(existingLink => wordToTreat.links.includes(existingLink)))
        || null
}

const findMatchingWords = (existingWords: DBWord[], wordToTreat: Word, filterFn: (word: DBWord) => boolean): DBWord | null => {
    const matchingWords = existingWords.filter(filterFn)
    if (matchingWords.length === 1) {
        return matchingWords[0]
    }

    return null
}

export default injectFromFile