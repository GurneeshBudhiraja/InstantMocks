import { generateDynamicResponse } from "@/app/ai";
import { getAPIData } from "@/appwrite/appwrite";
import { NextRequest, NextResponse } from "next/server";

type SupportedMethods = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';




async function handleAllMethods(request: NextRequest, method: SupportedMethods) {
  try {
    // Remove only the very first "api" and "v1" that appear
    const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean);
    const apiIndex = pathSegments.indexOf("api");
    if (apiIndex !== -1) pathSegments.splice(apiIndex, 1);
    const v1Index = pathSegments.indexOf("v1");
    if (v1Index !== -1) pathSegments.splice(v1Index, 1);
    const apiId = pathSegments[0];
    const apiRoute = pathSegments.slice(1).join("/");
    /**
     * verify if the API id is valid
     * check if the method exists in the data
     * if valid, get the response
     * if the response type is fixed, return the response
     * if the response type is dynamic, return the dynamic response
     */

    const apiData = (await getAPIData(apiId));

    if (!apiData) {
      return NextResponse.json("Not Found", { status: 404 })
    }

    // Get the API data form the Appwrite DB
    const { path, apiMethod } = apiData

    // Validate the path and the method
    if (path !== apiRoute) {
      console.log("⌨️ apiRoute")
      console.log(apiRoute)
      console.log("🛣️ path")
      console.log(path)
      return NextResponse.json("Not Found", { status: 404 })
    } else if (apiMethod.toUpperCase() !== method.toUpperCase()) {
      return NextResponse.json(
        "Method not allowed", { status: 405 })
    }

    // Return the response based on the response type
    const { response } = apiData
    const parsedResponse = (JSON.parse(response)) as {
      type: "fixed" | "dynamic";
      data: {
        [key: string]: string | number | boolean | null | undefined | Record<string, unknown>;
      }
    };

    const { data, type } = parsedResponse

    // Generate the dynamic response based on the `data`
    if (type === "dynamic") {
      const aiDynamicResponse = await generateDynamicResponse(data)

      // Return error when aiDynamicResponse is null
      if (aiDynamicResponse === null) {
        return NextResponse.json("Something went wrong", { status: 500 });
      }

      // Extract the JSON data from the aiDynamicResponse
      const match = typeof aiDynamicResponse === "string"
        ? aiDynamicResponse.match(/```json\s*({[\s\S]*})\s*```/)
        : null;

      console.log("🔗 Match")
      console.log(match)


      if (!match) {
        console.log("❌ Error in `extract the JSON data from the aiDynamicResponse`", aiDynamicResponse);
        return NextResponse.json("Something went wrong", { status: 500 });
      }

      const dynamic = JSON.parse(match[1]);
      return NextResponse.json(dynamic, { status: 200 });

    }
    return NextResponse.json({ ...data }, { status: 200 });
  } catch (error) {
    console.log(`Error in ${method} request`, (error as Error).message);
    return NextResponse.json("Something went wrong", { status: 500 });
  }

}

export async function GET(request: NextRequest) {
  return handleAllMethods(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleAllMethods(request, 'POST');
}

export async function DELETE(request: NextRequest) {
  return handleAllMethods(request, 'DELETE');
}


export async function PUT(request: NextRequest) {
  return handleAllMethods(request, 'PUT');
}


export async function PATCH(request: NextRequest) {
  return handleAllMethods(request, 'PATCH');
}