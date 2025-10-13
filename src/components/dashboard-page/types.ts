export interface MockAPI {
  id: string;
  name: string;
  method: string;
  endpoint: string;
  status: number;
  description: string;
  createdAt: string;
  response: Record<string, unknown>;
}
