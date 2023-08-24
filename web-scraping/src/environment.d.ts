import { LogLevel } from "@/common/types"

export interface InternalConfig {
  NODE_ENV?: "development" | "production"
  MONGO_URL: string
  LOG_LEVEL?: LogLevel
  ELIX: {
    BASE_URL: string
    SEARCH_URL: string
    LETTER_INDEX_URL: string
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production"
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
