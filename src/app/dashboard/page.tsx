"use client";

import { useState, useEffect } from "react";
import {
  DashboardHeader,
  EmptyState,
  MockApiCard,
  CreateMockDialog,
  MockAPI,
} from "@/components/dashboard-page";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export default function DashboardPage() {
  const [mockApis, setMockApis] = useState<MockAPI[]>([]);
  const [filteredApis, setFilteredApis] = useState<MockAPI[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMock, setEditingMock] = useState<MockAPI | null>(null);

  // Load mock APIs from localStorage on component mount
  useEffect(() => {
    const savedApis = localStorage.getItem("mockApis");
    if (savedApis) {
      const parsedApis = JSON.parse(savedApis);
      setMockApis(parsedApis);
      setFilteredApis(parsedApis);
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

    setFilteredApis((prev) => {
      if (editingMock) {
        return prev.map((mock) =>
          mock.id === editingMock.id
            ? {
                ...newMock,
                id: editingMock.id,
                createdAt: editingMock.createdAt,
              }
            : mock
        );
      } else {
        return [newMock, ...prev];
      }
    });
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
    setFilteredApis((prev) => prev.filter((mock) => mock.id !== id));
  };

  const handleCopyEndpoint = (endpoint: string) => {
    navigator.clipboard.writeText(`https://your-domain.com${endpoint}`);
    // You could add a toast notification here
  };

  const handleOpenCreateDialog = () => {
    setEditingMock(null);
    setIsCreateDialogOpen(true);
  };

  return (
    <div
      className={cn("h-screen w-full bg-white relative", {
        "overflow-hidden": mockApis.length === 0,
      })}
    >
      <div className="min-h-screen w-full bg-[#f9fafb]">
        {/* Grid lines background */}
        <div
          className={cn("absolute inset-0 z-0", {
            hidden: mockApis.length > 0,
          })}
          style={{
            backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
      `,
            backgroundSize: "32px 32px",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
            maskImage:
              "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
          }}
        />

        <div className="container mx-auto px-4 py-8">
          <DashboardHeader onCreateMock={handleOpenCreateDialog} />

          {mockApis.length === 0 ? (
            <EmptyState onCreateMock={handleOpenCreateDialog} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApis.map((mockApi) => (
                <MockApiCard
                  key={mockApi.id}
                  mockApi={mockApi}
                  onEdit={handleEditMock}
                  onDelete={handleDeleteMock}
                  onCopy={handleCopyEndpoint}
                />
              ))}
            </div>
          )}

          <CreateMockDialog
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onCreateMock={handleCreateMock}
            editingMock={editingMock}
          />
        </div>
        {/* Your Content/Components */}
      </div>
      {mockApis.length === 0 && (
        <motion.div
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 0.5 },
            rotate: {
              repeat: Infinity,
              ease: "linear",
              duration: 8,
            },
          }}
          className="absolute h-40 aspect-square z-50 -bottom-5 right-1.5 rounded-full bg-gradient-to-r from-blue-400 to-violet-600 blur-3xl overflow-clip"
        />
      )}
    </div>
  );
}
