import { Client, Databases, Query, } from "node-appwrite";

export default async function deleteAPIsCronJob(context: any) {
  try {
    // setup the appwrite client
    const client = new Client();
    client.setEndpoint(process.env.NEXT_APPWRITE_ENDPOINT);
    client.setProject(process.env.NEXT_APPWRITE_PROJECT_ID);
    client.setKey(process.env.NEXT_APPWRITE_API_KEY);
    const databases = new Databases(client);
    const response = await databases.listDocuments({
      databaseId: process.env.NEXT_APPWRITE_DB_ID,
      collectionId: process.env.NEXT_APPWRITE_API_COLLECTION_NAME,
    });
    const toBeDeletedAPIs = []
    for (const api of response.documents) {
      const { $createdAt } = api
      const createdAt = new Date($createdAt)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - createdAt.getTime())
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
      if (diffHours > 1) {
        toBeDeletedAPIs.push(api.$id)
      }
    }
    context.log("🗑️ To be deleted APIs", toBeDeletedAPIs)
    const deleteResponse = await databases.deleteDocuments({
      databaseId: process.env.NEXT_APPWRITE_DB_ID,
      collectionId: process.env.NEXT_APPWRITE_API_COLLECTION_NAME,
      // queries: [Query.equal("$id", toBeDeletedAPIs)]
      queries: [Query.equal("$id", ["68fb126e003a58eff927","68fb12630022867ac5e8"])]
    })
    context.log("🗑️ Deleted APIs", deleteResponse)
    context.res.empty()
    // for (const apiId of toBeDeletedAPIs) {

    //   context.log("🗑️ Deleted API", response)
    // }
  } catch (error) {
    context.error("❌ Error in `deleteAPIsCronJob`", (error as Error).message)
  }
}

