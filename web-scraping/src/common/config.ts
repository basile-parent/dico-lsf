import yargs from "yargs/yargs"
import { hideBin } from "yargs/helpers"
import * as fs from "fs"
import { InternalConfig } from "@/environment"
import process from "process"

class Config {
  private static DEFAULT_CONFIG_FILE = `config.${process.env.NODE_ENV || "development"}.json`
  private config: InternalConfig = {} as InternalConfig

  constructor() {
    const argv = yargs(hideBin(process.argv)).parseSync()
    const filePath = (argv.config as string) || Config.DEFAULT_CONFIG_FILE

    const loadedConfig = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    this.config = {
      ...process.env,
      ...loadedConfig
    }
  }

  get env(): InternalConfig {
    return this.config
  }
}

export default new Config()
