import mongoose from "mongoose"
import {Word} from "@/common/word";
import {ElixWord} from "@/elix/types";

export type DBWord = Word & ElixWord & {
    _id: any
}

const VideoLinkSchema = {
    source: { type: String, required: true },
    type: { type: String, required: true },
    link: { type: String, required: true },
}

const WordSchema = new mongoose.Schema<DBWord>({
    _id: { type: mongoose.Schema.ObjectId, required: true },
    word: { type: String, required: true },
    type: { type: [String], required: true },
    definition: { type: String, required: false },
    links: { type: [VideoLinkSchema], required: true },
    definitionLinks: { type: [VideoLinkSchema], required: false },
})

const WordModel = mongoose.model<DBWord>("words", WordSchema)

export default WordModel