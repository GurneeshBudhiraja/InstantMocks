"use client";

import { useState, useEffect } from "react";
import { CreateMockDialog, MockAPI } from "@/components/dashboard-page";
import { ApiDocsView } from "@/components/dashboard-page/api-docs-view";

export default function DashboardPage() {
  const [mockApis, setMockApis] = useState<MockAPI[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMock, setEditingMock] = useState<MockAPI | null>(null);

  // Load mock APIs from localStorage on component mount
  useEffect(() => {
    const savedApis = localStorage.getItem("mockApis");
    if (savedApis) {
      const parsedApis = JSON.parse(savedApis);
      setMockApis(parsedApis);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mockApis", JSON.stringify(mockApis));
  }, [mockApis]);

  const handleCreateMock = (mockData: Omit<MockAPI, "id" | "createdAt">) => {
    const newMock: MockAPI = {
      ...mockData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    if (editingMock) {
      // Update existing mock
      setMockApis((prev) =>
        prev.map((mock) =>
          mock.id === editingMock.id
            ? {
                ...newMock,
                id: editingMock.id,
                createdAt: editingMock.createdAt,
              }
            : mock
        )
      );
      setEditingMock(null);
    } else {
      // Create new mock
      setMockApis((prev) => [newMock, ...prev]);
    }
  };

  const handleEditMock = (id: string) => {
    const mock = mockApis.find((m) => m.id === id);
    if (mock) {
      setEditingMock(mock);
      setIsCreateDialogOpen(true);
    }
  };

  const handleDeleteMock = (id: string) => {
    setMockApis((prev) => prev.filter((mock) => mock.id !== id));
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
        onEditMock={handleEditMock}
        onDeleteMock={handleDeleteMock}
      />

      <CreateMockDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateMock={handleCreateMock}
        editingMock={editingMock}
      />
    </div>
  );
}
