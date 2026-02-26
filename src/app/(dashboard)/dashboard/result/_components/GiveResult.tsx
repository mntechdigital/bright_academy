"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ChevronRight,
  ChevronDown,
  CalendarIcon,
  FileSpreadsheet,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import WeeklyResultForm from "./weeklyResult/WeeklyResultForm";
import MonthlyResultForm from "./monthlyResult/MonthlyResultForm";
import WeeklyResult from "./weeklyResult/WeeklyResult";

interface ClassData {
  id: string;
  className: string;
  sections?: {
    id: string;
    sectionName: string;
  }[];
  subjects?: {
    id: string;
    subjectName: string;
  }[];
}

interface GiveResultProps {
  classesData?: ClassData[];
}

type ExamType = "weekly" | "monthly";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

const GiveResult = ({ classesData = [] }: GiveResultProps) => {
  const [examType, setExamType] = useState<ExamType>("weekly");

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Overview</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="flex items-center gap-1 text-foreground font-medium">
          <FileSpreadsheet className="h-4 w-4" />
          Give Result
        </span>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Give Result</h1>

      {/* Exam Type Tabs */}
      <div className="flex mb-6 bg-gray-100 rounded-full p-1 max-w-md">
        <button
          type="button"
          onClick={() => setExamType("weekly")}
          className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all ${
            examType === "weekly"
              ? "bg-[#F97316] text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Weakly Exam
        </button>
        <button
          type="button"
          onClick={() => setExamType("monthly")}
          className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all ${
            examType === "monthly"
              ? "bg-[#F97316] text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Monthly Exam
        </button>
      </div>

      {/* Render the correct form */}
      {examType === "weekly" ? (
        <>
          <WeeklyResultForm classesData={classesData} />
          <WeeklyResult searchParams={{ search: "", page: "1" }} />
        </>
      ) : (
        <>
          <MonthlyResultForm classesData={classesData} />
          
        </>
      )}
    </div>
  );
};

export default GiveResult;
