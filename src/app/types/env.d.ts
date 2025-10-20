declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_APPWRITE_API_KEY: string;
      NEXT_APPWRITE_DB_ID: string;
      NEXT_APPWRITE_PROJECT_ID: string;
    }
  }
}

export { };