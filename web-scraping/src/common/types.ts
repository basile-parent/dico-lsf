import { Options } from "yargs"

export type HelpOptions = {
  [key: string]: Options
}

export type HelpExamples = [string, string?][]

export enum LogLevel {
  debug = 10,
  info = 20,
  warn = 30,
  error = 40,
  off = 1000
}

export type BasicLink = {
  title: string
  link: string
  traceLink?: string
}
