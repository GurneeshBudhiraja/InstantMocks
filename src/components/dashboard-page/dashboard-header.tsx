"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface DashboardHeaderProps {
  onCreateMock: () => void;
  onSearch: (query: string) => void;
  mockCount: number;
}

export function DashboardHeader({ onCreateMock }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end mb-8">
      <div className="flex gap-2">
        <Button
          onClick={onCreateMock}
          className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Mock API
        </Button>
      </div>
    </div>
  );
}
