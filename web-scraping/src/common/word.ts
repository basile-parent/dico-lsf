export type WordType = "noun" | "proper noun" | "verb" | "adjective" | "adverb" | "interjection" | string
export type VideoSource = "Elix" | "Stim" | string

type Word = {
    word: string
    type: WordType[]
    definition?: string
    links: VideoLink[]
}

export type VideoLink = {
    source: VideoSource
    type: "youtube" | "website_resource" | "asset"
    link: string
}

export const getWordType = (text: string): WordType[] => {
    switch (text) {
        case "adj.": return ["adjective"]
        case "adv.": return ["adverb"]
        case "v.": return ["adverb"]
        case "n.": case "n.m.": case "n.f.": return ["noun"]
        case "adj. et n.": return ["adjective", "noun"]
        case "n.prop.": case "n.m.p.": case "n.f.p.": return ["proper noun"]
        case "int.": return ["interjection"]
        default:
            return ["unknown: " + text]
    }
}

export default Word