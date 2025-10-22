import { getAPIData } from "@/app/appwrite";
import { NextRequest, NextResponse } from "next/server";

type SupportedMethods = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';




async function handleAllMethods(request: NextRequest, method: SupportedMethods) {
  try {
    const pathName = request.nextUrl.pathname.split("/").filter((value) => !["", "api", "v1"].includes(value))
    const apiId = pathName[0]
    const apiRoute = pathName.slice(1).join("/")
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

    if (type === "fixed") {
      return NextResponse.json({ ...data }, { status: 200 });
    } else {
      return NextResponse.json({ success: true, data: "dynamic response" }, { status: 200 });
    }

  } catch (error) {
    console.log(`Error in ${method} request`, (error as Error).message);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
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