"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CopyIcon,
  PlayIcon,
  CodeIcon,
  InfoIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import { MockAPI } from "@/app/types/global";
import { useToast } from "@/components/ui/toast";

interface ApiDocsViewProps {
  mockApis: MockAPI[];
  onBack: () => void;
  onCreateMock?: () => void;
  onEditMock?: (id: string) => void;
  onDeleteMock?: (id: string) => void;
}

interface ApiEndpointProps {
  mockApi: MockAPI;
  onTest: (mockApi: MockAPI, testData?: any) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function ApiEndpoint({ mockApi, onTest, onEdit, onDelete }: ApiEndpointProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [testData, setTestData] = useState("");
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { showToast } = useToast();

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-200";
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PUT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200";
      case "PATCH":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return "bg-green-100 text-green-800 border-green-200";
    if (status >= 400 && status < 500)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (status >= 500) return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = {
        status: mockApi.status,
        data: mockApi.response,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        timestamp: new Date().toISOString(),
      };

      setTestResult(result);
      onTest(mockApi, testData ? JSON.parse(testData) : undefined);
      showToast(
        `API test completed successfully! Status: ${mockApi.status}`,
        "success"
      );
    } catch (error) {
      setTestResult({
        error: "Failed to test API",
        message: error instanceof Error ? error.message : "Unknown error",
      });
      showToast("Failed to test API", "error");
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  return (
    <Card className="mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge
              className={`${getMethodColor(
                mockApi.method
              )} font-mono text-xs px-2 py-1`}
            >
              {mockApi.method}
            </Badge>
            <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
              {mockApi.endpoint}
            </code>
            <Badge
              className={`${getStatusColor(mockApi.status)} text-xs px-2 py-1`}
            >
              {mockApi.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleTest();
              }}
              disabled={isTesting}
              className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <PlayIcon className="w-3 h-3 mr-1" />
              {isTesting ? "Testing..." : "Try it out"}
            </Button>
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(mockApi.id);
                }}
                className="text-xs"
              >
                <EditIcon className="w-3 h-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(mockApi.id);
                }}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <TrashIcon className="w-3 h-3" />
              </Button>
            )}
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {mockApi.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{mockApi.description}</p>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-6">
            {/* Request/Response Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Request Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CodeIcon className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Request</h4>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        URL
                      </label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm bg-white p-2 rounded border font-mono">
                          {(() => {
                            let url = `https://api.example.com${mockApi.endpoint}`;
                            if (
                              mockApi.queryParams &&
                              mockApi.queryParams.length > 0
                            ) {
                              const queryString = mockApi.queryParams
                                .filter((param) => param.key && param.value)
                                .map((param) => `${param.key}=${param.value}`)
                                .join("&");
                              if (queryString) {
                                url += `?${queryString}`;
                              }
                            }
                            return url;
                          })()}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            let url = `https://api.example.com${mockApi.endpoint}`;
                            if (
                              mockApi.queryParams &&
                              mockApi.queryParams.length > 0
                            ) {
                              const queryString = mockApi.queryParams
                                .filter((param) => param.key && param.value)
                                .map((param) => `${param.key}=${param.value}`)
                                .join("&");
                              if (queryString) {
                                url += `?${queryString}`;
                              }
                            }
                            copyToClipboard(url);
                          }}
                        >
                          <CopyIcon className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Method
                      </label>
                      <Badge
                        className={`${getMethodColor(
                          mockApi.method
                        )} font-mono`}
                      >
                        {mockApi.method}
                      </Badge>
                    </div>

                    {/* Query Parameters */}
                    {mockApi.queryParams && mockApi.queryParams.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Query Parameters
                        </label>
                        <div className="space-y-2">
                          {mockApi.queryParams.map((param, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                {param.key}
                              </code>
                              <span className="text-xs text-gray-500">=</span>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                {param.value}
                              </code>
                              {param.description && (
                                <span className="text-xs text-gray-500">
                                  - {param.description}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Request Body */}
                    {(mockApi.method === "POST" ||
                      mockApi.method === "PUT" ||
                      mockApi.method === "PATCH") && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Request Body (JSON)
                        </label>
                        {mockApi.requestBody &&
                        Object.keys(mockApi.requestBody).length > 0 ? (
                          <div className="space-y-2">
                            <div className="relative">
                              <pre className="bg-white p-3 rounded border text-xs font-mono overflow-x-auto max-h-32">
                                {JSON.stringify(mockApi.requestBody, null, 2)}
                              </pre>
                              <Button
                                size="sm"
                                variant="outline"
                                className="absolute top-2 right-2"
                                onClick={() =>
                                  copyToClipboard(
                                    JSON.stringify(mockApi.requestBody, null, 2)
                                  )
                                }
                              >
                                <CopyIcon className="w-3 h-3" />
                              </Button>
                            </div>
                            <Textarea
                              value={testData}
                              onChange={(e) => setTestData(e.target.value)}
                              placeholder="Override request body (optional)"
                              className="font-mono text-sm"
                              rows={4}
                            />
                          </div>
                        ) : (
                          <Textarea
                            value={testData}
                            onChange={(e) => setTestData(e.target.value)}
                            placeholder="Enter request body (optional)"
                            className="font-mono text-sm"
                            rows={4}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Response Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <InfoIcon className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Response</h4>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  {testResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Status:
                        </span>
                        <Badge
                          className={`${getStatusColor(
                            testResult.status
                          )} text-xs`}
                        >
                          {testResult.status}
                        </Badge>
                        {testResult.status >= 200 && testResult.status < 300 ? (
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircleIcon className="w-4 h-4 text-red-600" />
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Response Body
                        </label>
                        <div className="relative">
                          <pre className="bg-white p-3 rounded border text-xs font-mono overflow-x-auto max-h-40">
                            {JSON.stringify(testResult.data, null, 2)}
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2"
                            onClick={() =>
                              copyToClipboard(
                                JSON.stringify(testResult.data, null, 2)
                              )
                            }
                          >
                            <CopyIcon className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <PlayIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        Click "Try it out" to test this endpoint
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Response Schema */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <CodeIcon className="w-4 h-4" />
                Response Schema
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="relative">
                  <pre className="bg-white p-3 rounded border text-xs font-mono overflow-x-auto max-h-60">
                    {JSON.stringify(mockApi.response, null, 2)}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(JSON.stringify(mockApi.response, null, 2))
                    }
                  >
                    <CopyIcon className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function ApiDocsView({
  mockApis,
  onBack,
  onCreateMock,
  onEditMock,
  onDeleteMock,
}: ApiDocsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const { showToast, toasts } = useToast();

  const filteredApis = mockApis.filter((api) => {
    const matchesSearch =
      api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod =
      selectedMethod === "all" ||
      api.method.toLowerCase() === selectedMethod.toLowerCase();

    return matchesSearch && matchesMethod;
  });

  const handleTest = (mockApi: MockAPI, testData?: any) => {
    console.log("Testing API:", mockApi.name, "with data:", testData);
  };

  const methods = ["all", "GET", "POST", "PUT", "DELETE", "PATCH"];
  const methodCounts = methods.reduce((acc, method) => {
    if (method === "all") {
      acc[method] = mockApis.length;
    } else {
      acc[method] = mockApis.filter(
        (api) => api.method.toLowerCase() === method.toLowerCase()
      ).length;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      {toasts}
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Mock API Playground
                </h1>
                <p className="text-sm text-gray-600">
                  Test and explore your mock APIs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {mockApis.length} endpoint{mockApis.length !== 1 ? "s" : ""}
                </div>
              </div>
              {onCreateMock && (
                <Button
                  onClick={onCreateMock}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Mock API
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              {methods.map((method) => {
                const getMethodColor = (method: string) => {
                  switch (method.toUpperCase()) {
                    case "GET":
                      return "bg-green-100 text-green-800 border-green-200";
                    case "POST":
                      return "bg-blue-100 text-blue-800 border-blue-200";
                    case "PUT":
                      return "bg-yellow-100 text-yellow-800 border-yellow-200";
                    case "DELETE":
                      return "bg-red-100 text-red-800 border-red-200";
                    case "PATCH":
                      return "bg-purple-100 text-purple-800 border-purple-200";
                    default:
                      return "bg-gray-100 text-gray-800 border-gray-200";
                  }
                };

                return (
                  <Button
                    key={method}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMethod(method)}
                    className={`text-xs ${
                      selectedMethod === method
                        ? getMethodColor(method) +
                          " hover:" +
                          getMethodColor(method)
                        : "hover:" +
                          getMethodColor(method)
                            .replace("bg-", "bg-")
                            .replace("text-", "text-")
                            .replace("border-", "border-")
                    }`}
                  >
                    {method} ({methodCounts[method]})
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="container mx-auto px-4 py-6">
        {filteredApis.length === 0 ? (
          <div className="text-center py-12">
            <CodeIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No APIs found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedMethod !== "all"
                ? "Try adjusting your filter criteria"
                : "Create your first mock API to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* API Groups */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Available Endpoints
              </h2>
              <div className="space-y-4">
                {filteredApis.map((mockApi) => (
                  <ApiEndpoint
                    key={mockApi.id}
                    mockApi={mockApi}
                    onTest={handleTest}
                    onEdit={onEditMock}
                    onDelete={onDeleteMock}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
