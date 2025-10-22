declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_APPWRITE_API_KEY: string;
      NEXT_APPWRITE_DB_ID: string;
      NEXT_APPWRITE_PROJECT_ID: string;
      NEXT_APPWRITE_API_COLLECTION_NAME: string;
      NEXT_APPWRITE_ENDPOINT: string;
      NEXT_APPWRITE_PROJECT_NAME: string;
      NEXT_AI_KEY: string;
    }
  }
}

export { };