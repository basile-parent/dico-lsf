import * as fs from "fs"
import WordModel, {DBWord} from "@/dbInjector/models/wordModel"
import {Word} from "@/common/word"
import Logger from "@/common/logger"
import _ from "lodash"
import chalk from "chalk"
import {s} from "@/utils/stringUtils"

// Note: the file existence has already been checked
const injectFromFile = async (jsonFilePath: string) => {
    Logger.info(
        `Injecting file ${chalk.blue(jsonFilePath.substring(jsonFilePath.lastIndexOf("/") + 1))} into the database.`
    )
    const data = JSON.parse(fs.readFileSync(jsonFilePath, "utf8")) as Word[]

    const stats = {
        inserted: 0,
        updated: 0
    }

    for (const datum of data) {
        const existingWords = await WordModel.find({word: datum.word})

        Logger.debug(
            `Injecting '${datum.word}' (${datum.type.join(",")}): found ${existingWords.length} existing word${s(
                existingWords.length
            )}.`
        )

        if (!existingWords.length) {
            const result = await WordModel.create(datum)
            stats.inserted++
            Logger.debug(`\t> Word '${datum.word}' inserted in DB:`, result._id)
        } else {
            const existingWord = findExactMatchExistingWord(existingWords, datum)
            if (!existingWord) {
                const result = await WordModel.create(datum)
                stats.inserted++
                Logger.debug(
                    `There ${chalk.blue(existingWords.length)} occurence${s(existingWords.length)} of the word "${datum.word}" exist in the database but with no exact match. This word has been inserted.`
                    , result._id)
                continue
            }

            const mergedObject = _.merge(existingWord, datum) as DBWord
            const result = await WordModel.updateOne({_id: existingWord._id}, mergedObject)

            if (result.matchedCount === 1) {
                stats.updated += result.modifiedCount
                Logger.debug(`\t> Word '${datum.word}' (${existingWord._id}) updated in DB !!!!!!!!!!!!!!!!!!!!!!!!!!!!!${ !result.modifiedCount ? " (no change)" : ""}`)
            } else {
                Logger.warn(
                    `The word "${chalk.blue(datum.word)}" cannot be updated. No or too many matches with _id ${chalk.yellow(
                        existingWord._id
                    )}. Result:`,
                    JSON.stringify(result)
                )
            }
        }
    }

    Logger.info(
        `File injected. ${chalk.blue(stats.inserted)} word${s(stats.inserted)} created. ${chalk.blue(
            stats.updated
        )} word${s(stats.updated)} updated.`
    )
}

const findExactMatchExistingWord = (existingWords: DBWord[], wordToTreat: Word): DBWord | null => {
    if ((wordToTreat as DBWord)._id) {
        const existingWord = existingWords.find((word) => word._id === (wordToTreat as DBWord)._id)
        if (existingWord) {
            return existingWord
        }
    }

    return (
        findMatchingWords(
            existingWords,
            wordToTreat,
            (existingWord) => existingWord.definition === wordToTreat.definition
        ) ||
        findMatchingWords(
            existingWords,
            wordToTreat,
            (existingWord) =>
                // If both definition are set and different (test above), then the words are differents
                (!existingWord.definition || !wordToTreat.definition) &&
                existingWord.type.length === wordToTreat.type.length &&
                wordToTreat.type.every((t) => existingWord.type.includes(t))
        ) ||
        findMatchingWords(existingWords, wordToTreat, (existingWord) =>
            existingWord.links.some((existingLink) => wordToTreat.links.includes(existingLink))
        ) ||
        null
    )
}

const findMatchingWords = (
    existingWords: DBWord[],
    wordToTreat: Word,
    filterFn: (word: DBWord) => boolean
): DBWord | null => {
    const matchingWords = existingWords.filter(filterFn)
    if (matchingWords.length === 1) {
        return matchingWords[0]
    }

    return null
}

export default injectFromFile
