declare namespace NodeJS {
    export interface ProcessEnv {
        DATABASE: string;
        COLLECTION_COUNTRY: string;
        COLLECTION_ARTICLE: string;
        CONNECTION_STRING: string;
        NEWS_API_KEY: string;
        NEWS_PAGE_SIZE: number;
    }
}
