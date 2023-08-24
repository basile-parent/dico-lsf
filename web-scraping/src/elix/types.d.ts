import Word, { VideoLink } from "@/common/word"

export type ElixWord = Word & {
  definitionLinks: VideoLink[]
}

export type ElixBasicLink = {
  title: string
  link: string
  traceLink?: string
}
