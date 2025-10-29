import { createMockAPI, getAllThePathBasedOnUserId } from "@/appwrite/appwrite";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Zod schema for CreateAPIBodyType validation
 */
export const CreateAPIBodySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  path: z.string().min(1, "Path is required"),
  apiMethod: z.enum(["get", "post", "put", "delete", "patch"], {
    message: "API method must be one of: get, post, put, delete, patch"
  }),
  userId: z.string().min(1, "User ID is required"),
  response: z.object({
    type: z.enum(["fixed", "dynamic"]),
    data: z.any()
  })
});


// Helper function for Zod validation
function validateRequestBody<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return { success: false, error: `Validation error: ${errorMessages}` };
    }
    return { success: false, error: "Invalid request body format" };
  }
}

/**
 * Initialize a new API
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body using Zod
    const validation = validateRequestBody(CreateAPIBodySchema, body);

    if (!validation.success) {
      console.log("🔍 Validation error in `create-api`", validation.error);
      return NextResponse.json(
        { success: false, error: validation.error, data: {} },
        { status: 400 }
      );
    }

    // Get the validated data
    const validatedData = validation.data;
    // remove the leading and trailing slashes from the path
    const transformedPath = validatedData.path.replace(/^\/+|\/+$/g, "");

    // Check if the path is already exists
    const allUserCreatedAPIs = await getAllThePathBasedOnUserId(validatedData.userId)
    if (!allUserCreatedAPIs) {
      throw new Error("Failed to get all user created APIs");
    }
    const existingPaths = allUserCreatedAPIs.filter((api) => api.path === transformedPath)
    const existingPathMethods = existingPaths.filter((api) => api.apiMethod === validatedData.apiMethod)
    if ((existingPaths)?.length > 0 && (existingPathMethods)?.length > 0) {
      return NextResponse.json({ success: false, error: "Path and method already exists", data: {} }, { status: 400 });
    }

    const { data: apiId, success } = await createMockAPI(
      {
        ...validatedData,
        path: transformedPath,
        response: JSON.stringify({ type: validatedData.response.type, data: validatedData.response.data }),
      })
    if (!success) {
      return NextResponse.json({ success: false, error: "Failed to create API", data: {} }, { status: 500 });
    }
    return NextResponse.json({
      success: true,
      message: "API created successfully",
      data: {
        apiId,
      }
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error creating API", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}