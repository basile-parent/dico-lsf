import mongoose from "mongoose"
import Logger from "@/common/logger"
import injectFromFile from "@/dbInjector/injectFromFile"
import Config from "@/common/config"
import getArguments from "@/dbInjector/getArguments"
import chalk from "chalk"

;(async () => {
  const argv = await getArguments()

  mongoose
    .connect(Config.env.MONGO_URL)
    .then(async () => {
      Logger.info(chalk.bgBlue("Connected to database"))

      await injectFromFile(argv.filepath as string)
    })
    .catch(Logger.error)
    .finally(() => {
      mongoose.disconnect().then(() => Logger.info(chalk.bgBlue("Disconnected from database")))
    })
})()
