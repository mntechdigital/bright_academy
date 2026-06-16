
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
        "w-full p-4  md:p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
