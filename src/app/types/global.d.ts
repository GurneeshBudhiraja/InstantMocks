export interface MockAPI {
  id: string;
  name: string;
  method: string;
  endpoint: string;
  status: number;
  description: string;
  createdAt: string;
  response: Record<string, unknown>;
  isDynamic: boolean;
  queryParams?: Array<{ key: string; value: string; description?: string }>;
  requestBody?: Record<string, unknown>;
  fullApiUrl?: string;
  expiresAt?: string;
}


export interface AppwriteFunctionCreateBodyType {
  id: string;
  name: string;
  method: string;
  endpoint: string;
  status: number;
  description: string;
  createdAt: string;
  response: Record<string, unknown>;
}


export interface APIResponseType {
  type: "fixed" | "dynamic";
  data: {
    [key: string]: string | number | boolean | null | undefined | Record<string, unknown>;
  }
}
