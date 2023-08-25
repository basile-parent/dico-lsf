import Word, { VideoLink } from "@/common/word"

export type ElixWord = Word & {
  definitionLinks: VideoLink[]
}
