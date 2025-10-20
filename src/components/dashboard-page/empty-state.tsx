"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  onCreateMock: () => void;
}

export function EmptyState({ onCreateMock }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <Card className="max-w-md w-full bg-zinc-100 z-50">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-3 font-poppins">
            No Mock APIs Yet
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Create your first mock API endpoint to get started.
          </p>

          <Button
            onClick={onCreateMock}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Your First Mock API
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
