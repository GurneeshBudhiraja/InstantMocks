"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WandIcon } from "lucide-react";
import { MockAPI } from "@/app/types/global";

interface CreateMockDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateMock: (mockApi: Omit<MockAPI, "id" | "createdAt">) => void;
  editingMock?: MockAPI | null;
}

export function CreateMockDialog({
  isOpen,
  onOpenChange,
  onCreateMock,
  editingMock,
}: CreateMockDialogProps) {
  const [formData, setFormData] = useState({
    name: editingMock?.name || "",
    method: editingMock?.method || "GET",
    endpoint: editingMock?.endpoint || "",
    status: editingMock?.status || 200,
    description: editingMock?.description || "",
    response: editingMock?.response || {},
    isDynamic: editingMock?.isDynamic || false,
    typeReplacedObject: null as any,
    queryParams: editingMock?.queryParams || [],
    requestBody: editingMock?.requestBody || {},
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [responseText, setResponseText] = useState(
    editingMock?.response ? JSON.stringify(editingMock.response, null, 2) : ""
  );
  const [isValidJson, setIsValidJson] = useState(
    editingMock?.response ? true : true
  );
  const [originalJson, setOriginalJson] = useState<string>("");
  const [isTypeValid, setIsTypeValid] = useState(true);
  const [typeError, setTypeError] = useState<string>("");
  const [showPillView, setShowPillView] = useState(false);
  const [requestBodyText, setRequestBodyText] = useState(
    editingMock?.requestBody
      ? JSON.stringify(editingMock.requestBody, null, 2)
      : ""
  );
  const [isRequestBodyValid, setIsRequestBodyValid] = useState(
    editingMock?.requestBody ? true : true
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateMock(formData);
    setFormData({
      name: "",
      method: "GET",
      endpoint: "",
      status: 200,
      description: "",
      response: {},
      isDynamic: false,
      typeReplacedObject: null,
      queryParams: [],
      requestBody: {},
    });
    setResponseText("");
    setRequestBodyText("");
    setIsValidJson(true);
    setIsRequestBodyValid(true);
    setIsTypeValid(true);
    setTypeError("");
    setOriginalJson("");
    onOpenChange(false);
  };

  const replaceValuesWithTypes = (obj: any): any => {
    if (obj === null) {
      throw new Error(
        "Invalid type: null values are not allowed. Only string, number, and boolean types are supported."
      );
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => replaceValuesWithTypes(item));
    }

    if (typeof obj === "object") {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = replaceValuesWithTypes(value);
      }
      return result;
    }

    // Validate primitive types
    const type = typeof obj;
    if (type !== "string" && type !== "number" && type !== "boolean") {
      throw new Error(
        `Invalid type: "${type}" is not allowed. Only string, number, and boolean types are supported.`
      );
    }

    // For primitive values, return their type with metadata
    return { type: type, value: type };
  };

  const formatJsonWithTypes = (obj: any, indent = 0): string => {
    const spaces = "  ".repeat(indent);

    if (obj === null || typeof obj !== "object") {
      return `${obj}`;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return `${spaces}[]`;
      const items = obj.map((item, index) => {
        if (typeof item === "object" && item !== null) {
          return `${spaces}  ${formatJsonWithTypes(item, indent + 1)}`;
        }
        return `${spaces}  ${item}`;
      });
      return `${spaces}[\n${items.join(",\n")}\n${spaces}]`;
    }

    const entries = Object.entries(obj);
    if (entries.length === 0) return `${spaces}{}`;

    const lines = entries.map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return `${spaces}  ${key}: ${formatJsonWithTypes(value, indent + 1)}`;
      }
      return `${spaces}  ${key}: ${value}`;
    });

    return `${spaces}{\n${lines.join(",\n")}\n${spaces}}`;
  };

  const TypePill = ({ type }: { type: string }) => {
    const getPillStyle = (type: string) => {
      switch (type) {
        case "number":
          return "bg-orange-100 text-orange-700 border-orange-200 rounded-full"; // Round pill
        case "string":
          return "bg-blue-100 text-blue-700 border-blue-200 rounded-md"; // Square pill
        case "boolean":
          return "bg-green-100 text-green-700 border-green-200 rounded-lg"; // Rounded square
        case "array":
          return "bg-purple-100 text-purple-700 border-purple-200 rounded-full";
        case "object":
          return "bg-yellow-100 text-yellow-700 border-yellow-200 rounded-md";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200 rounded-full";
      }
    };

    return (
      <span
        className={`inline-flex items-center justify-center w-16 h-6 text-xs font-medium border ${getPillStyle(
          type
        )}`}
      >
        {type}
      </span>
    );
  };

  const renderJsonWithPills = (obj: any, indent = 0): React.ReactElement => {
    const spaces = "  ".repeat(indent);

    if (obj && typeof obj === "object" && obj.type && obj.value) {
      // This is a type pill
      return <TypePill type={obj.type} />;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return <TypePill type="array" />;
      }
      return (
        <div>
          <span className="text-gray-600">[</span>
          <div className="ml-4">
            {obj.map((item, index) => (
              <div key={index} className="flex items-center mb-1">
                <div className="flex items-center">
                  {renderJsonWithPills(item, indent + 1)}
                  {index < obj.length - 1 && (
                    <span className="text-gray-600 ml-2">,</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <span className="text-gray-600">]</span>
        </div>
      );
    }

    if (typeof obj === "object" && obj !== null) {
      const entries = Object.entries(obj);
      if (entries.length === 0) {
        return <TypePill type="object" />;
      }

      return (
        <div>
          <span className="text-gray-600">{"{"}</span>
          <div className="ml-4">
            {entries.map(([key, value], index) => (
              <div key={key} className="flex items-center mb-1">
                <span className="text-gray-600 w-40 flex-shrink-0">{key}:</span>
                <div className="flex items-center">
                  {renderJsonWithPills(value, indent + 1)}
                  {index < entries.length - 1 && (
                    <span className="text-gray-600 ml-2">,</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <span className="text-gray-600">{"}"}</span>
        </div>
      );
    }

    return <span>{obj}</span>;
  };

  const validateTypes = (obj: any): { isValid: boolean; error: string } => {
    try {
      replaceValuesWithTypes(obj);
      return { isValid: true, error: "" };
    } catch (error: any) {
      return { isValid: false, error: error.message };
    }
  };

  const generateRandomSchema = () => {
    const schemas = [
      {
        id: Math.floor(Math.random() * 1000),
        name: "John Doe",
        email: "john@example.com",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        userId: Math.floor(Math.random() * 10000),
        username: "jane_smith",
        profile: {
          firstName: "Jane",
          lastName: "Smith",
          age: 28,
          location: "New York",
        },
        preferences: {
          theme: "dark",
          notifications: true,
        },
        lastLogin: new Date().toISOString(),
      },
      {
        productId: `PROD-${Math.floor(Math.random() * 10000)}`,
        name: "Wireless Headphones",
        price: 99.99,
        category: "Electronics",
        inStock: true,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 1000),
        specifications: {
          battery: "20 hours",
          connectivity: "Bluetooth 5.0",
          weight: "250g",
        },
      },
      {
        orderId: `ORD-${Math.floor(Math.random() * 100000)}`,
        customer: {
          name: "Alice Johnson",
          email: "alice@example.com",
        },
        items: [
          {
            product: "Laptop",
            quantity: 1,
            price: 1299.99,
          },
          {
            product: "Mouse",
            quantity: 2,
            price: 29.99,
          },
        ],
        total: 1359.97,
        status: "shipped",
        shippingAddress: {
          street: "123 Main St",
          city: "San Francisco",
          zipCode: "94105",
        },
      },
      {
        taskId: Math.floor(Math.random() * 10000),
        title: "Complete project documentation",
        description: "Write comprehensive documentation for the new API",
        priority: "high",
        assignee: "Bob Wilson",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "in_progress",
        tags: ["documentation", "api", "priority"],
        progress: 65,
      },
    ];

    return schemas[Math.floor(Math.random() * schemas.length)];
  };

  const generateWithAI = async () => {
    console.log("Generate with AI clicked - Starting AI generation process");
    setIsGenerating(true);

    // Simulate AI generation for 2 seconds
    setTimeout(() => {
      const randomSchema = generateRandomSchema();
      console.log("AI generation completed - Generated schema:", randomSchema);

      setFormData((prev) => ({
        ...prev,
        response: randomSchema,
      }));
      setResponseText(JSON.stringify(randomSchema, null, 2));
      setIsGenerating(false);
    }, 2000); // 2 seconds
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl border-2 border-zinc-500 shadow-[inset_0px_0px_8px_#0000008c]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold font-roboto">
            {editingMock ? "Edit Mock API" : "Create New Mock API"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 font-roboto-mono">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              API Name
            </label>
            <Input
              className="border-2 border-zinc-400 rounded-md focus:!border-zinc-400 focus:!ring-0"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter API Name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Endpoint
            </label>
            <div className="flex">
              <Select
                value={formData.method}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, method: value }))
                }
              >
                <SelectTrigger
                  className={`w-24 rounded-r-none border-r-0 font-medium font-roboto-mono cursor-pointer ${
                    formData.method === "GET"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : formData.method === "POST"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : formData.method === "PUT"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                      : formData.method === "DELETE"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : formData.method === "PATCH"
                      ? "bg-purple-100 text-purple-800 border-purple-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  <SelectValue className="font-semibold font-roboto-mono" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "GET", color: "green" },
                    { value: "POST", color: "blue" },
                    { value: "PUT", color: "yellow" },
                    { value: "DELETE", color: "red" },
                    { value: "PATCH", color: "purple" },
                  ].map((method) => (
                    <SelectItem
                      key={method.value}
                      value={method.value}
                      className={`!text-${method.color}-600 focus:!text-${method.color}-600 hover:!text-${method.color}-600 font-semibold font-roboto-mono cursor-pointer`}
                    >
                      {method.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={formData.endpoint}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endpoint: e.target.value }))
                }
                placeholder="/api/users"
                required
                className="flex-1 border-l-0 border-2 border-zinc-400 rounded-md focus:!border-zinc-400 focus:!ring-0 rounded-l-none border-l-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe what this API endpoint does..."
              rows={3}
              className="border-2 border-zinc-400 rounded-md focus:!border-zinc-400 focus:!ring-0"
            />
          </div>

          {/* Query Parameters */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Query Parameters (Optional)
            </label>
            <div className="space-y-2">
              {formData.queryParams.map((param, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={param.key}
                    onChange={(e) => {
                      const newParams = [...formData.queryParams];
                      newParams[index] = { ...param, key: e.target.value };
                      setFormData((prev) => ({
                        ...prev,
                        queryParams: newParams,
                      }));
                    }}
                    placeholder="Parameter name"
                    className="border-2 border-zinc-400 rounded-md focus:!border-zinc-400 focus:!ring-0"
                  />
                  <Input
                    value={param.value}
                    onChange={(e) => {
                      const newParams = [...formData.queryParams];
                      newParams[index] = { ...param, value: e.target.value };
                      setFormData((prev) => ({
                        ...prev,
                        queryParams: newParams,
                      }));
                    }}
                    placeholder="Default value"
                    className="border-2 border-zinc-400 rounded-md focus:!border-zinc-400 focus:!ring-0"
                  />
                  <Input
                    value={param.description || ""}
                    onChange={(e) => {
                      const newParams = [...formData.queryParams];
                      newParams[index] = {
                        ...param,
                        description: e.target.value,
                      };
                      setFormData((prev) => ({
                        ...prev,
                        queryParams: newParams,
                      }));
                    }}
                    placeholder="Description (optional)"
                    className="border-2 border-zinc-400 rounded-md focus:!border-zinc-400 focus:!ring-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newParams = formData.queryParams.filter(
                        (_, i) => i !== index
                      );
                      setFormData((prev) => ({
                        ...prev,
                        queryParams: newParams,
                      }));
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    queryParams: [
                      ...prev.queryParams,
                      { key: "", value: "", description: "" },
                    ],
                  }));
                }}
                className="w-full"
              >
                + Add Query Parameter
              </Button>
            </div>
          </div>

          {/* Request Body */}
          {(formData.method === "POST" ||
            formData.method === "PUT" ||
            formData.method === "PATCH") && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Request Body (Optional)
              </label>
              <Textarea
                value={requestBodyText}
                onChange={(e) => {
                  const value = e.target.value;
                  setRequestBodyText(value);

                  if (value.trim() === "") {
                    setIsRequestBodyValid(true);
                    setFormData((prev) => ({ ...prev, requestBody: {} }));
                  } else {
                    try {
                      const parsed = JSON.parse(value);
                      setFormData((prev) => ({ ...prev, requestBody: parsed }));
                      setIsRequestBodyValid(true);
                    } catch {
                      setIsRequestBodyValid(false);
                      setFormData((prev) => ({ ...prev, requestBody: {} }));
                    }
                  }
                }}
                placeholder="Enter JSON request body..."
                rows={4}
                className="font-mono text-sm border-2 border-zinc-400 rounded-md focus:!border-zinc-400 focus:!ring-0"
              />
              {requestBodyText.trim() !== "" && (
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-xs font-medium ${
                      isRequestBodyValid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isRequestBodyValid ? "✓ Valid JSON" : "✗ Invalid JSON"}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                API Response
              </label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateWithAI}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <WandIcon className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate with AI"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (formData.isDynamic) {
                      // Reverting back to original JSON
                      if (originalJson) {
                        setResponseText(originalJson);
                        setOriginalJson("");
                      }
                    } else {
                      // Only process if we have valid JSON
                      if (responseText.trim() !== "" && isValidJson) {
                        try {
                          const parsed = JSON.parse(responseText);
                          // Store original JSON for reverting
                          setOriginalJson(responseText);
                          // Convert to type mode and log to console
                          try {
                            const typeReplacedObject =
                              replaceValuesWithTypes(parsed);
                            console.log(
                              "Dynamic JSON - Original object:",
                              parsed
                            );
                            console.log(
                              "Dynamic JSON - Type-replaced object:",
                              typeReplacedObject
                            );
                          } catch (typeError: any) {
                            console.error("Type validation error:", typeError);
                            alert(`Error: ${typeError.message}`);
                            return; // Don't toggle the dynamic state if there's an error
                          }
                        } catch (error) {
                          console.error("Error processing JSON:", error);
                        }
                      }
                    }
                    setFormData((prev) => ({
                      ...prev,
                      isDynamic: !prev.isDynamic,
                    }));
                  }}
                  className={`flex-1 ${
                    formData.isDynamic
                      ? "border-blue-500 text-blue-600 hover:border-blue-600 hover:text-blue-700 bg-blue-700/10"
                      : "border-zinc-400 text-zinc-600"
                  }`}
                >
                  <span className="mr-2 flex items-center">
                    <span
                      className={`inline-block w-3 h-3 rounded-full border transition-colors ${
                        formData.isDynamic
                          ? "bg-blue-600 border-blue-600"
                          : "bg-transparent border-zinc-400"
                      }`}
                    ></span>
                  </span>
                  Dynamic JSON
                </Button>
              </div>
            </div>
            <Textarea
              value={responseText}
              onChange={(e) => {
                const value = e.target.value;
                setResponseText(value);

                if (value.trim() === "") {
                  setIsValidJson(true);
                  setIsTypeValid(true);
                  setTypeError("");
                  setFormData((prev) => ({ ...prev, response: {} }));
                } else {
                  try {
                    const parsed = JSON.parse(value);
                    setFormData((prev) => ({ ...prev, response: parsed }));
                    setIsValidJson(true);

                    // Just log the types without validation display
                    const typeValidation = validateTypes(parsed);
                    if (typeValidation.isValid) {
                      const typeReplacedObject = replaceValuesWithTypes(parsed);
                      console.log("Object with types:", typeReplacedObject);
                    }
                  } catch {
                    setIsValidJson(false);
                    setIsTypeValid(true);
                    setTypeError("");
                    setFormData((prev) => ({ ...prev, response: {} }));
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const textarea = e.target as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const newValue =
                    responseText.substring(0, start) +
                    "  " +
                    responseText.substring(end);
                  setResponseText(newValue);

                  // Set cursor position after the inserted spaces
                  setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + 2;
                  }, 0);
                }
              }}
              placeholder='Enter JSON response or use "Generate with AI" button above to create a response automatically'
              rows={8}
              className="font-mono text-sm border-2 border-zinc-400 rounded-md focus:!border-zinc-400 focus:!ring-0 whitespace-pre-wrap break-words overflow-x-auto resize-none word-wrap break-all"
              style={{
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
              }}
            />
            {responseText.trim() !== "" && (
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs font-medium ${
                    isValidJson ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isValidJson ? "✓ Valid JSON" : "✗ Invalid JSON"}
                </span>
              </div>
            )}
            {formData.isDynamic && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700 font-medium">
                  Dynamic mode enabled - Backend will generate fresh JSON on
                  each request
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {editingMock ? "Update Mock API" : "Create API"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
