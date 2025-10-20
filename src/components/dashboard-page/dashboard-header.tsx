"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { motion } from "motion/react";

interface DashboardHeaderProps {
  onCreateMock: () => void;
}

export function DashboardHeader({ onCreateMock }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end mb-8"
    >
      <div className="flex gap-2 z-10">
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
