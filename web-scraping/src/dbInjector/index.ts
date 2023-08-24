import mongoose from "mongoose";
import Logger from "@/common/logger";
import injectFromFile from "@/dbInjector/injectFromFile";
import Config from "@/common/config";

mongoose.connect(Config.env.MONGO_URL)
    .then(async () => {
        Logger.info("Connected to database")

        await injectFromFile("src/data/z.json")
    })
    .catch(console.error)
    .finally(() => {
        mongoose.disconnect()
            .then(() => Logger.info("Disconnected from database"))
    })
