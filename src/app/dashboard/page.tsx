"use client";

import { useState, useEffect } from "react";
import { CreateMockDialog, MockAPI } from "@/components/dashboard-page";
import { ApiDocsView } from "@/components/dashboard-page/api-docs-view";
import { useToast } from "@/components/ui/toast";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { getAllThePathBasedOnUserId, deleteMockAPI } from "@/appwrite/appwrite";
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
  const [isLoadingAPIs, setIsLoadingAPIs] = useState(true);
  const { showToast, toasts } = useToast();
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
        console.log("Starting API initialization...");
        console.log("Current loading state:", isLoadingAPIs);
        setIsLoadingAPIs(true);

        // Check for existing userId in localStorage
        let currentUserId = localStorage.getItem("userId");

        if (!currentUserId) {
          // Generate new userId using Appwrite ID
          currentUserId = ID.unique();
          localStorage.setItem("userId", currentUserId);
          console.log("Generated new userId:", currentUserId);
        } else {
          console.log("Using existing userId:", currentUserId);
        }

        setUserId(currentUserId);

        // Fetch APIs from server
        console.log("Fetching APIs for userId:", currentUserId);
        const apis = await Promise.race([
          getAllThePathBasedOnUserId(currentUserId),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("API fetch timeout")), 10000)
          ),
        ]);
        console.log("Received APIs from server:", apis);

        if (apis && Array.isArray(apis) && apis.length > 0) {
          // Transform server data to match MockAPI interface
          const transformedApis: MockAPI[] = apis.map((api) => {
            const fullUrl = `${getBaseUrl()}/api/v1/${api.$id}/${api.path}`;
            console.log("Generated URL for API:", fullUrl);

            // Calculate expiry time (1 hour from creation)
            const createdAt = new Date(api.$createdAt);
            const expiresAt = new Date(createdAt.getTime() + 60 * 60 * 1000); // Add 1 hour

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
              expiresAt: expiresAt.toISOString(),
            };
          });
          console.log("Transformed APIs:", transformedApis);
          setMockApis(transformedApis);
        } else {
          console.log("No APIs found, setting empty array");
          setMockApis([]);
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        showToast(`Failed to load APIs: ${errorMessage}`, "error");
        setMockApis([]);
      } finally {
        console.log("API initialization complete, setting loading to false");
        console.log("APIs loaded:", mockApis.length);
        setIsLoadingAPIs(false);
        console.log("Loading state set to false");
      }
    };

    initializeUser();
  }, []);

  const handleCreateMock = async (
    mockData: Omit<MockAPI, "id" | "createdAt">
  ) => {
    try {
      setIsLoadingAPIs(true);

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

      // Fetch fresh results from backend
      const apis = await getAllThePathBasedOnUserId(userId);
      if (apis) {
        const transformedApis: MockAPI[] = apis.map((api: any) => {
          const fullUrl = `${getBaseUrl()}/api/v1/${api.$id}/${api.path}`;
          console.log("Generated URL for API after creation:", fullUrl);

          // Calculate expiry time (1 hour from creation)
          const createdAt = new Date(api.$createdAt);
          const expiresAt = new Date(createdAt.getTime() + 60 * 60 * 1000); // Add 1 hour

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
            expiresAt: expiresAt.toISOString(),
          };
        });
        setMockApis(transformedApis);
      }

      // Close dialog and reset form
      setIsCreateDialogOpen(false);
      setEditingMock(null);

      // Show success toast
      showToast("API created successfully!", "success");
    } catch (error) {
      console.error("Error creating API:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      showToast(`Failed to create API: ${errorMessage}`, "error");
    } finally {
      setIsLoadingAPIs(false);
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
      showToast("Failed to delete API. Please try again.", "error");
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

  return (
    <div className="min-h-screen">
      <ApiDocsView
        mockApis={mockApis}
        onBack={() => {}}
        onCreateMock={handleOpenCreateDialog}
        onDeleteMock={handleDeleteMock}
        isLoadingAPIs={isLoadingAPIs}
      />

      <CreateMockDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateMock={handleCreateMock}
        editingMock={editingMock}
      />

      {toasts}

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
