"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Badge } from "@/components/ui/badge";
import { PlusIcon, WandIcon } from "lucide-react";
import { MockAPI } from "./types";

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
    response: editingMock?.response || { message: "Hello World" },
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateMock(formData);
    setFormData({
      name: "",
      method: "GET",
      endpoint: "",
      status: 200,
      description: "",
      response: { message: "Hello World" },
    });
    onOpenChange(false);
  };

  const generateWithAI = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        response: {
          id: Math.floor(Math.random() * 1000),
          name: "John Doe",
          email: "john@example.com",
          status: "active",
          createdAt: new Date().toISOString(),
        },
      }));
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingMock ? "Edit Mock API" : "Create New Mock API"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="User API"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Method
              </label>
              <Select
                value={formData.method}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, method: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Endpoint
            </label>
            <Input
              value={formData.endpoint}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, endpoint: e.target.value }))
              }
              placeholder="/api/users"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Status Code
              </label>
              <Select
                value={formData.status.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200">200 - OK</SelectItem>
                  <SelectItem value="201">201 - Created</SelectItem>
                  <SelectItem value="400">400 - Bad Request</SelectItem>
                  <SelectItem value="401">401 - Unauthorized</SelectItem>
                  <SelectItem value="404">404 - Not Found</SelectItem>
                  <SelectItem value="500">500 - Server Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Status
              </label>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    formData.status >= 200 && formData.status < 300
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : formData.status >= 400
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                  }
                >
                  {formData.status}
                </Badge>
              </div>
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
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Response Body
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateWithAI}
                disabled={isGenerating}
              >
                <WandIcon className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <Textarea
              value={JSON.stringify(formData.response, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setFormData((prev) => ({ ...prev, response: parsed }));
                } catch {
                  // Invalid JSON, keep the text for editing
                }
              }}
              placeholder='{"message": "Hello World"}'
              rows={8}
              className="font-mono text-sm"
            />
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
              {editingMock ? "Update Mock API" : "Create Mock API"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
