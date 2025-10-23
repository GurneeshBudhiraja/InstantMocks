"use server";
import { Client, Databases, ID, Query } from "node-appwrite";
import z from "zod";
import { CreateAPIBodySchema } from "./api/v1/create-api/route";

const initAppwrite = () => {
  try {
    const client = new Client();
    client.setEndpoint(process.env.NEXT_APPWRITE_ENDPOINT);
    client.setProject(process.env.NEXT_APPWRITE_PROJECT_ID);
    client.setKey(process.env.NEXT_APPWRITE_API_KEY);
    return client;
  } catch (error) {
    console.log("Error in `initAppwrite`", (error as Error).message);
    return null
  }
}


export async function createMockAPI(MockAPI: Omit<z.infer<typeof CreateAPIBodySchema>, "response"> & {
  response?: string;
}) {
  try {
    const client = initAppwrite();
    if (!client) {
      throw new Error("Failed to initialize Appwrite client");
    }
    const databases = new Databases(client);
    const response = await databases.createDocument({
      databaseId: process.env.NEXT_APPWRITE_DB_ID,
      collectionId: process.env.NEXT_APPWRITE_API_COLLECTION_NAME,
      data: MockAPI,
      documentId: ID.unique()
    })
    console.log("✅ Mock API created successfully");
    return {
      success: true,
      data: response.$id,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in `createMockAPI`", error.message);
    }
    return {
      success: false,
      data: "",
    }
  }

}


export async function getAPIData(apiId: string) {
  try {
    const client = initAppwrite()
    if (!client) {
      throw new Error("Failed to initialize Appwrite client");
    }
    const databases = new Databases(client);
    const response = await databases.getDocument({
      databaseId: process.env.NEXT_APPWRITE_DB_ID,
      collectionId: process.env.NEXT_APPWRITE_API_COLLECTION_NAME,
      documentId: apiId,
    });
    console.log("Response from `getAPIData`", response);
    return response;
  } catch (error) {
    console.log("❌ Error in `getAPIData`", (error as Error).message);
    return null
  }
}



export async function getAllThePathBasedOnUserId(userId: string) {
  try {
    const client = initAppwrite()
    if (!client) {
      throw new Error("Failed to initialize Appwrite client");
    }
    const databases = new Databases(client);
    console.log("🏃‍➡️ Fetching all the APIs based on the userId");
    const response = await databases.listDocuments({
      databaseId: process.env.NEXT_APPWRITE_DB_ID,
      collectionId: process.env.NEXT_APPWRITE_API_COLLECTION_NAME,
      queries: [Query.equal("userId", userId)]
    });
    return response.documents
  } catch (error) {
    console.log("❌ Error in `getAllThePathBasedOnUserId`", (error as Error).message);
    return null
  }

}


export async function deleteMockAPI(apiId: string) {
  try {
    const client = initAppwrite()
    if (!client) {
      throw new Error("Failed to initialize Appwrite client");
    }
    const databases = new Databases(client);
    console.log("🗑️ Deleting the API with the id", apiId);
    const response = await databases.deleteDocument({
      databaseId: process.env.NEXT_APPWRITE_DB_ID,
      collectionId: process.env.NEXT_APPWRITE_API_COLLECTION_NAME,
      documentId: apiId,
    });
    return response;
  } catch (error) {
    console.log("❌ Error in `deleteMockAPI`", (error as Error).message);
    return null
  }
}