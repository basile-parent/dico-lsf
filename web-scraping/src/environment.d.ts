export interface InternalConfig {
    MONGO_URL: string;
    ELIX: {
        BASE_URL: string
        SEARCH_URL: string
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends InternalConfig {
            NODE_ENV: "development" | "production";
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}