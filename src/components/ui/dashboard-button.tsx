"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight01Icon } from "hugeicons-react";
import Link from "next/link";
import { ReactNode } from "react";

interface DashboardButtonProps {
  text: string;
  icon?: ReactNode;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showArrow?: boolean;
}

export function DashboardButton({
  text,
  icon,
  variant = "default",
  size = "lg",
  className = "",
  showArrow = true,
}: DashboardButtonProps) {
  return (
    <Link href="/dashboard">
      <Button
        variant={variant}
        size={size}
        className={cn(
          "cursor-pointer",
          className,
          variant === "default" &&
            "bg-primary hover:bg-primary/90 text-primary-foreground"
        )}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {text}
        {showArrow && <ArrowRight01Icon className="ml-2 h-4 w-4" />}
      </Button>
    </Link>
  );
}
