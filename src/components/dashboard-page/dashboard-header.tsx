"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, BookOpenIcon } from "lucide-react";
import { motion } from "motion/react";

interface DashboardHeaderProps {
  onCreateMock: () => void;
  onViewDocs?: () => void;
  hasApis?: boolean;
}

export function DashboardHeader({
  onCreateMock,
  onViewDocs,
  hasApis,
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Mock API Dashboard</h1>
        <p className="text-gray-600">Create and manage your mock APIs</p>
      </div>
      <div className="flex gap-2 z-10">
        {hasApis && onViewDocs && (
          <Button
            onClick={onViewDocs}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            <BookOpenIcon className="w-4 h-4 mr-2" />
            View API Docs
          </Button>
        )}
        <Button
          onClick={onCreateMock}
          className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Mock API
        </Button>
      </div>
    </motion.div>
  );
}
