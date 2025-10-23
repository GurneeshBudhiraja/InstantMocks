"use client";

import { useState, useEffect } from "react";
import { CreateMockDialog, MockAPI } from "@/components/dashboard-page";
import { ApiDocsView } from "@/components/dashboard-page/api-docs-view";
import { ErrorModal } from "@/components/ui/error-modal";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { getAllThePathBasedOnUserId, deleteMockAPI } from "@/app/appwrite";
import { ID } from "node-appwrite";

// Utility function to get the base URL
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Fallback for server-side rendering
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export default function DashboardPage() {
  const [mockApis, setMockApis] = useState<MockAPI[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMock, setEditingMock] = useState<MockAPI | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    details?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    apiId: string;
    apiName: string;
  }>({
    isOpen: false,
    apiId: "",
    apiName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize userId and fetch APIs
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true);

        // Check for existing userId in localStorage
        let currentUserId = localStorage.getItem("userId");

        if (!currentUserId) {
          // Generate new userId using Appwrite ID
          currentUserId = ID.unique();
          localStorage.setItem("userId", currentUserId);
        }

        setUserId(currentUserId);

        // Fetch APIs from server
        const apis = await getAllThePathBasedOnUserId(currentUserId);
        if (apis) {
          console.log("Fetched APIs:", apis);
          // Transform server data to match MockAPI interface
          const transformedApis: MockAPI[] = apis.map((api) => {
            const fullUrl = `${getBaseUrl()}/api/v1/${api.$id}/${api.path}`;
            console.log("Generated URL for API:", fullUrl);
            return {
              id: api.$id,
              name: api.title,
              method: api.apiMethod.toUpperCase(),
              endpoint: api.path,
              status: 200, // Default status
              description: api.description || "",
              createdAt: api.$createdAt,
              response: JSON.parse(api.response),
              isDynamic: JSON.parse(api.response).type === "dynamic",
              queryParams: [],
              requestBody: {},
              // Add the full API URL for display
              fullApiUrl: fullUrl,
            };
          });
          setMockApis(transformedApis);
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        setError({
          isOpen: true,
          title: "Initialization Error",
          message:
            "Failed to initialize the dashboard. Please refresh the page.",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  const handleCreateMock = async (
    mockData: Omit<MockAPI, "id" | "createdAt">
  ) => {
    try {
      setIsLoading(true);

      // Prepare API data for server
      const apiData = {
        title: mockData.name,
        description: mockData.description,
        path: mockData.endpoint,
        apiMethod: mockData.method.toLowerCase(),
        userId: userId,
        response: {
          type: mockData.isDynamic ? "dynamic" : "fixed",
          data: mockData.response,
        },
      };

      // Call the create API endpoint
      const response = await fetch("/api/v1/create-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create API");
      }

      // Refetch APIs from server
      const apis = await getAllThePathBasedOnUserId(userId);
      if (apis) {
        const transformedApis: MockAPI[] = apis.map((api) => {
          const fullUrl = `${getBaseUrl()}/api/v1/${api.$id}/${api.path}`;
          console.log("Generated URL for new API:", fullUrl);
          return {
            id: api.$id,
            name: api.title,
            method: api.apiMethod.toUpperCase(),
            endpoint: api.path,
            status: 200,
            description: api.description || "",
            createdAt: api.$createdAt,
            response: JSON.parse(api.response),
            isDynamic: JSON.parse(api.response).type === "dynamic",
            queryParams: [],
            requestBody: {},
            fullApiUrl: fullUrl,
          };
        });
        setMockApis(transformedApis);
      }

      // Close dialog and reset form
      setIsCreateDialogOpen(false);
      setEditingMock(null);
    } catch (error) {
      console.error("Error creating API:", error);
      setError({
        isOpen: true,
        title: "API Creation Failed",
        message: "Failed to create the API. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMock = (id: string) => {
    const api = mockApis.find((mock) => mock.id === id);
    if (api) {
      setDeleteConfirmation({
        isOpen: true,
        apiId: id,
        apiName: api.name,
      });
    }
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);

      // Call the server function to delete the API
      const result = await deleteMockAPI(deleteConfirmation.apiId);

      if (result) {
        // Remove from local state
        setMockApis((prev) =>
          prev.filter((mock) => mock.id !== deleteConfirmation.apiId)
        );

        // Close confirmation modal
        setDeleteConfirmation({
          isOpen: false,
          apiId: "",
          apiName: "",
        });
      } else {
        throw new Error("Failed to delete API");
      }
    } catch (error) {
      console.error("Error deleting API:", error);
      setError({
        isOpen: true,
        title: "Delete Failed",
        message: "Failed to delete the API. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      apiId: "",
      apiName: "",
    });
  };

  const handleOpenCreateDialog = () => {
    setEditingMock(null);
    setIsCreateDialogOpen(true);
  };

  const closeErrorModal = () => {
    setError({
      isOpen: false,
      title: "",
      message: "",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ApiDocsView
        mockApis={mockApis}
        onBack={() => {}}
        onCreateMock={handleOpenCreateDialog}
        onDeleteMock={handleDeleteMock}
      />

      <CreateMockDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateMock={handleCreateMock}
        editingMock={editingMock}
      />

      <ErrorModal
        isOpen={error.isOpen}
        onClose={closeErrorModal}
        title={error.title}
        message={error.message}
        details={error.details}
      />

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        apiName={deleteConfirmation.apiName}
        isDeleting={isDeleting}
      />
    </div>
  );
}
