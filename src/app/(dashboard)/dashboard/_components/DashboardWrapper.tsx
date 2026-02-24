
import { cn } from "@/lib/utils";
import React from "react";

interface DashboardWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardWrapper({
  children,
  className,
}: DashboardWrapperProps) {
  return (
    <div
      className={cn(
        "w-full p-4 sm:p-6 md:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
