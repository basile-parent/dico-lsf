/* eslint-disable @typescript-eslint/no-explicit-any, no-console */
import chalk from "chalk"
import Config from "./config"
import { LogLevel } from "./types"

const COLOR_GREY = "\x1b[37m"
const COLOR_NONE = "\x1b[0m"

class Logger {
  private logLevel = Config.env.LOG_LEVEL || LogLevel.info

  _getFormattedDate = () =>
    new Date()
      .toISOString() // ISO format "2012-11-04T14:51:06.157Z"
      .replace(/T/, " ") // replace T with a space
      .replace(/\..+/, "") // delete the dot and everything after

  debug = (...messages: any) =>
    this.logLevel <= LogLevel.debug &&
    console.debug(`${COLOR_GREY}${this._getFormattedDate()} DEBUG`, ...messages, `${COLOR_NONE}`)
  info = (...messages: any) =>
    this.logLevel <= LogLevel.info && console.log(`${this._getFormattedDate()} INFO `, ...messages)
  warn = (...messages: any) =>
    this.logLevel <= LogLevel.warn &&
    console.warn(`${this._getFormattedDate()} ${chalk.bgYellowBright.black("WARN")} `, ...messages)
  error = (...messages: any) =>
    this.logLevel <= LogLevel.error &&
    console.error(`${this._getFormattedDate()} ${chalk.bgRedBright.whiteBright("ERROR")}`, ...messages)
}

export default new Logger()
