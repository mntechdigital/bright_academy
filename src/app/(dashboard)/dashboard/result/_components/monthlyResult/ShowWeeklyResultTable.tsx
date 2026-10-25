"use client";
import React, { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getGradeFromMarks } from "@/src/utils/gradeUtils";
import { downloadCSV } from "@/src/utils/downloadCSV";
import PaginationWrapper from "@/src/components/PaginationWrapper";
import ResultModeSwitch from "../ResultModeSwitch";
import {
  DEFAULT_WEEK,
  MONTH_NAMES,
  WEEK_OPTIONS,
  normalizeWeekParam,
  weekLabel,
} from "./weeklyFilters";

interface WeeklyRow {
  studentId: string;
  student: {
    id: string;
    name: string;
    parentPhone: string;
    stdRegNo?: string;
    batch?: { id: string; name: string } | null;
    batchId?: string;
  };
  batchId?: string;
  totalMark: number;
  achievedMark: number;
  position: number | null;
  gpa: number;
}

interface ClassData {
  id: string;
  className: string;
  batches?: { id: string; name: string }[];
  students?: any[];
}

interface Props {
  weeklyResultsData: WeeklyRow[];
  meta: { totalItems: number; totalPages: number; currentPage: number };
  classesData: ClassData[];
  routineTotal: number | null;
  routineFound: boolean;
  noMarksForWeek: boolean;
  someWeeksMissingMarks: boolean;
}

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

export default function ShowWeeklyResultTable({
  weeklyResultsData = [],
  meta,
  classesData = [],
  routineFound,
  noMarksForWeek,
  someWeeksMissingMarks,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selectedClassId, setSelectedClassId] = useState(searchParams.get("classId") || "");
  const [selectedBatchId, setSelectedBatchId] = useState(searchParams.get("batchId") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [month, setMonth] = useState(searchParams.get("month") || MONTH_NAMES[new Date().getMonth()]);
  const [year, setYear] = useState(searchParams.get("year") || String(new Date().getFullYear()));
  // State stores the API value ("1".."4", "overall"), never the UI label.
  const [week, setWeek] = useState(
    () => normalizeWeekParam(searchParams.get("week")) ?? DEFAULT_WEEK
  );
  const [top, setTop] = useState(searchParams.get("top") || "All");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "position");
  const [order, setOrder] = useState(searchParams.get("order") || "asc");

  // First load: persist the defaults (and normalize a legacy week label such
  // as "Week 4" -> "4") into the URL so refresh/shared links keep working.
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;
    const ensure = (key: string, value: string) => {
      if (!params.get(key)) {
        params.set(key, value);
        changed = true;
      }
    };
    ensure("month", month);
    ensure("year", year);
    ensure("week", week);
    const rawWeek = searchParams.get("week");
    if (rawWeek && rawWeek !== week) {
      params.set("week", week);
      changed = true;
    }
    if (params.get("top") === "All" || params.get("top") === "") {
      params.delete("top");
      changed = true;
    }
    if (changed) {
      startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== (searchParams.get("search") || "")) {
        updateFilters({ search });
      }
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const updateFilters = (next: Partial<{
    classId: string; batchId: string; search: string; month: string; year: string;
    week: string; top: string; sortBy: string; order: string;
  }>) => {
    const params = new URLSearchParams(searchParams.toString());
    const apply = (key: string, value: string | undefined) => {
      const normalized = value == null ? "" : String(value).trim();
      if (
        normalized &&
        normalized !== "All" &&
        normalized !== "undefined" &&
        normalized !== "null"
      ) {
        params.set(key, normalized);
      } else {
        params.delete(key);
      }
    };
    if ("classId" in next) apply("classId", next.classId);
    if ("batchId" in next) apply("batchId", next.batchId);
    if ("search" in next) apply("search", next.search);
    if ("month" in next) apply("month", next.month);
    if ("year" in next) apply("year", next.year);
    if ("week" in next) apply("week", next.week);
    if ("top" in next) apply("top", next.top);
    if ("sortBy" in next) apply("sortBy", next.sortBy);
    if ("order" in next) apply("order", next.order);
    params.set("page", "1");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    setSelectedBatchId("");
    updateFilters({ classId, batchId: "" });
  };

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const batchId = e.target.value;
    setSelectedBatchId(batchId);
    updateFilters({ batchId });
  };

  const availableBatches = classesData.find((c) => c.id === selectedClassId)?.batches ?? [];
  const selectedClassName = classesData.find((c) => c.id === selectedClassId)?.className;
  const filtersReady = Boolean(selectedClassId && month && year && week);
  const weekDisplay = weekLabel(week);

  const handleSort = (col: string) => {
    let newOrder = "asc";
    if (sortBy === col) newOrder = order === "asc" ? "desc" : "asc";
    setSortBy(col);
    setOrder(newOrder);
    updateFilters({ sortBy: col, order: newOrder });
  };

  const sortIndicator = (col: string) =>
    sortBy === col ? (order === "asc" ? " ^" : " v") : "";

  const handleDownloadCSV = () => {
    const headers = [
      "Student's Name","Student's ID","Batch","Total Mark","Achieved Mark","Grade","GPA","Position",
    ];
    const rows = weeklyResultsData.map((row) => {
      const grade = row.totalMark > 0 ? getGradeFromMarks(row.achievedMark, row.totalMark).letterGrade : "F";
      return [
        row.student?.name || "",
        row.student?.stdRegNo || "",
        row.student?.batch?.name || "",
        row.totalMark,
        row.achievedMark,
        grade,
        row.gpa > 0 ? row.gpa.toFixed(2) : "0.00",
        row.position !== null ? "#" + ordinal(row.position) : "-",
      ];
    });
    const filename = "weekly_results_" + (selectedClassName || "all") + "_" + weekDisplay.replace(/\s+/g, "_");
    downloadCSV(headers, rows, filename);
  };

  const results = weeklyResultsData;

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <h1 className="text-xl font-bold text-gray-900">Monthly Result</h1>
        {selectedClassName && (
          <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-0.5 rounded-full">
            {selectedClassName}
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <ResultModeSwitch />

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-52">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search for students"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm text-gray-700 bg-transparent outline-none w-full placeholder-gray-400"
            />
          </div>

          <select
            value={selectedClassId}
            onChange={handleClassChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white cursor-pointer outline-none min-w-32.5"
          >
            <option value="">Select Class</option>
            {classesData.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.className}</option>
            ))}
          </select>

          <select
            value={selectedBatchId}
            onChange={handleBatchChange}
            disabled={!selectedClassId}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white cursor-pointer outline-none min-w-32.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select Batch</option>
            {availableBatches.map((batch) => (
              <option key={batch.id} value={batch.id}>{batch.name}</option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => { setMonth(e.target.value); updateFilters({ month: e.target.value }); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white cursor-pointer outline-none min-w-28"
          >
            {MONTH_NAMES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <select
            value={year}
            onChange={(e) => { setYear(e.target.value); updateFilters({ year: e.target.value }); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white cursor-pointer outline-none min-w-24"
          >
            {["2024","2025","2026","2027"].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <select
            value={week}
            onChange={(e) => {
              const value = normalizeWeekParam(e.target.value) ?? DEFAULT_WEEK;
              setWeek(value);
              updateFilters({ week: value });
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white cursor-pointer outline-none min-w-32.5"
          >
            {WEEK_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={top}
            onChange={(e) => {
              const value = e.target.value;
              setTop(value);
              updateFilters({ top: value === "All" ? "" : value });
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white cursor-pointer outline-none min-w-24"
          >
            <option value="All">All</option>
            <option value="Top 3">Top 3</option>
            <option value="Top 5">Top 5</option>
            <option value="Top 10">Top 10</option>
          </select>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Download CSV
          </button>
        </div>

        {!selectedClassId && (
          <div className="py-16 text-center text-gray-400 text-sm">
            Select class, month, year and week to see weekly results
          </div>
        )}

        {selectedClassId && !filtersReady && (
          <div className="py-16 text-center text-gray-400 text-sm">
            Select class, month, year and week
          </div>
        )}

        {selectedClassId && filtersReady && isPending && (
          <div className="py-16 text-center text-gray-400 text-sm">
            Loading weekly results...
          </div>
        )}

        {selectedClassId && filtersReady && !isPending && !routineFound && (
          <div className="py-16 text-center text-gray-400 text-sm">
            No weekly routine found for this class
          </div>
        )}

        {selectedClassId && filtersReady && !isPending && routineFound && noMarksForWeek && (
          <div className="mb-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            No marks entered for {week === "overall" ? "this period" : weekDisplay} yet
          </div>
        )}

        {selectedClassId && filtersReady && !isPending && routineFound && someWeeksMissingMarks && (
          <div className="mb-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Some weeks have no marks yet
          </div>
        )}

        {selectedClassId && filtersReady && !isPending && routineFound && (
          <div className="overflow-x-auto whitespace-nowrap">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">Student's Name</th>
                  <th
                    className="px-3 py-2.5 text-left text-gray-500 font-semibold cursor-pointer"
                    onClick={() => handleSort("studentId")}
                  >
                    Student's ID{sortIndicator("studentId")}
                  </th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">Batch</th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">Total Mark</th>
                  <th
                    className="px-3 py-2.5 text-left text-gray-500 font-semibold cursor-pointer"
                    onClick={() => handleSort("achievedMark")}
                  >
                    Achieved Mark{sortIndicator("achievedMark")}
                  </th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">Grade</th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">GPA</th>
                  <th
                    className="px-3 py-2.5 text-left text-gray-500 font-semibold cursor-pointer"
                    onClick={() => handleSort("position")}
                  >
                    Position{sortIndicator("position")}
                  </th>
                  <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-10 text-center text-gray-400 text-sm">
                      No results found.
                    </td>
                  </tr>
                ) : (
                  results.map((row) => {
                    const grade = row.totalMark > 0
                      ? getGradeFromMarks(row.achievedMark, row.totalMark).letterGrade
                      : "F";
                    return (
                      <tr key={row.studentId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3.5">
                          <div>
                            <p className="font-semibold text-gray-900">{row.student?.name}</p>
                            <p className="text-xs text-gray-400">{row.student?.parentPhone}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {row.student?.stdRegNo || "-"}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {row.student?.batch?.name || "-"}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-gray-700 font-medium">{row.totalMark}</td>
                        <td className="px-3 py-3.5 text-gray-700 font-medium">{row.achievedMark}</td>
                        <td className="px-3 py-3.5">
                          <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {grade}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-gray-700 font-medium">{row.gpa > 0 ? row.gpa.toFixed(2) : "-"}</td>
                        <td className="px-3 py-3.5 text-gray-700 font-medium">
                          {row.position !== null ? "#" + ordinal(row.position) : "-"}
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                              title="View"
                            >
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <rect x="4" y="3" width="16" height="18" rx="2" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6M9 11h6M9 15h4" />
                              </svg>
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Print"
                            >
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedClassId && filtersReady && !isPending && routineFound && meta?.totalPages > 1 && (
          <div className="mt-4">
            <PaginationWrapper
              active={meta.currentPage}
              totalPages={meta.totalPages}
              totalItems={meta.totalItems}
            />
          </div>
        )}
      </div>
    </div>
  );
}
