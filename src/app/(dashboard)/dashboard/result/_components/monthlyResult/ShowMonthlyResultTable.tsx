"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import DeleteMonthlyResultDialog from "./DeleteMonthlyResultDialog";
import { downloadCSV } from "@/src/utils/downloadCSV";
import { updateMonthlyResult } from "@/src/services/monthlyResult";
import { showSuccessToast, showErrorToast } from "@/src/utils/toastMessage";

const GradeIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <rect
      x="4"
      y="3"
      width="16"
      height="18"
      rx="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 7h6M9 11h6M9 15h4"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const PencilIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

// ---- Types ----
interface ResultSubject {
  id: string;
  subjectName: string;
  stdRegNo: string;
  marks: number;
  fullMarks: number;
  highestMark: number;
}

interface Student {
  id: string;
  name: string;
  classId: string;
  batchId?: string;
  parentPhone: string;
  avatar?: string;
  username?: string;
  stdRegNo?: string;
  batch?: {
    id: string;
    name: string;
  };
}

export interface MonthlyResult {
  id: string;
  studentId: string;
  stdRegNo: string;
  student: Student;
  results: ResultSubject[];
  totalMarks: number;
  gpa: number;
  grade: string;
  position: string;
  present: number;
  absent: number;
  subjectId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ClassData {
  id: string;
  className: string;
  createdAt: string;
  updatedAt: string;
  batches?: { id: string; name: string }[];
  students?: any[];
  subjects?: any[];
  _count?: { students: number };
}

interface Props {
  monthlyResultsData: MonthlyResult[];
  classesData: ClassData[];
}

export default function ShowMonthlyResultTable({
  monthlyResultsData = [],
  classesData = [],
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [checkedAll, setCheckedAll] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // These are now synced with the URL (?classId=&batchId=&search=) so the
  // server can filter+paginate correctly instead of filtering only the
  // 20 rows already loaded on the current page.
  const [selectedClassId, setSelectedClassId] = useState(
    searchParams.get("classId") || "",
  );
  const [selectedBatchId, setSelectedBatchId] = useState(
    searchParams.get("batchId") || "",
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");

  // Pushes filter changes into the URL. Always resets to page 1, since the
  // previous page number may no longer be valid for the new filter set.
  const updateFilters = (next: {
    classId?: string;
    batchId?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    const apply = (key: string, value: string | undefined) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    if ("classId" in next) apply("classId", next.classId);
    if ("batchId" in next) apply("batchId", next.batchId);
    if ("search" in next) apply("search", next.search);

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounce the search box before pushing to the URL / hitting the backend
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== (searchParams.get("search") || "")) {
        updateFilters({ search });
      }
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggleAll = () => {
    const next = !checkedAll;
    setCheckedAll(next);
    const newChecked: Record<string, boolean> = {};
    monthlyResultsData.forEach((r) => (newChecked[r.id] = next));
    setChecked(newChecked);
  };

  const toggleOne = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getAchievedMarks = (results: ResultSubject[]) =>
    results.reduce((sum, r) => sum + r.marks, 0);

  const calculatePositions = async () => {
    // Sort the currently loaded (already filtered/paginated) results by achieved marks descending
    const sorted = [...monthlyResultsData].sort((a, b) => {
      const aMarks = getAchievedMarks(a.results);
      const bMarks = getAchievedMarks(b.results);
      return bMarks - aMarks;
    });

    // Assign positions: 1st, 2nd, 3rd, etc.
    for (let i = 0; i < sorted.length; i++) {
      const position = `${i + 1}${getOrdinalSuffix(i + 1)}`;
      const result = sorted[i];

      const res = await updateMonthlyResult(result.id, { position });

      if (!res || res.statusCode >= 400) {
        showErrorToast(`Failed to update position for ${result.student?.name}`);
      }
    }

    showSuccessToast("Positions calculated successfully. Refresh the page to see updates.");
  };

  const getOrdinalSuffix = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const getFullMarks = (results: ResultSubject[], fallback: number) =>
    results.length > 0
      ? results.reduce((sum, r) => sum + r.fullMarks, 0)
      : fallback;

  // Batches for the selected class
  const availableBatches =
    classesData.find((c) => c.id === selectedClassId)?.batches ?? [];

  // Handle class change — reset batch when class changes
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

  const hasActiveFilters = !!(selectedClassId || selectedBatchId || search);

  const clearFilters = () => {
    setSelectedClassId("");
    setSelectedBatchId("");
    setSearch("");
    router.push(pathname);
  };

  // Build a lookup map for student regNo from classesData
  const studentRegNoMap = new Map<string, string>();
  for (const cls of classesData) {
    for (const s of cls.students ?? []) {
      if (s.id && (s as any).stdRegNo) {
        studentRegNoMap.set(s.id, (s as any).stdRegNo);
      }
    }
  }

  // Look up batch name from classesData
  const getBatchName = (result: MonthlyResult): string => {
    // First, try the populated batch relation
    if (result.student?.batch?.name) return result.student.batch.name;
    // Fallback: look up from classesData using batchId
    if (result.student?.batchId) {
      // Search across all classes for the matching batch
      for (const cls of classesData) {
        const batch = cls.batches?.find(
          (b) => b.id === result.student.batchId,
        );
        if (batch) return batch.name;
      }
    }
    return "—";
  };

  // Look up student registration number
  const getStudentRegNo = (result: MonthlyResult): string => {
    // First, try the top-level stdRegNo on the result
    if (result.stdRegNo) return result.stdRegNo;
    // Then, try the student's stdRegNo field
    if (result.student?.stdRegNo) return result.student.stdRegNo;
    // Then, try the student's username
    if (result.student?.username) return result.student.username;
    // Then, look up from classesData students array
    if (result.student?.id && studentRegNoMap.has(result.student.id)) {
      return studentRegNoMap.get(result.student.id)!;
    }
    return "—";
  };

  // The server already applies search/classId/batchId filtering and pagination
  // (see updateFilters + page.tsx), so monthlyResultsData is used directly.
  const results = monthlyResultsData;

  const selectedClassName = classesData.find(
    (c) => c.id === selectedClassId,
  )?.className;

  const handleDownloadCSV = () => {
    const headers = [
      "Student's Name",
      "Student's ID",
      "Batch",
      "Total Mark",
      "Achieved Mark",
      "Grade",
      "GPA",
      "Position",
    ];

    const rows = results.map((result) => {
      const achievedMarks = getAchievedMarks(result.results);
      const fullMarks = getFullMarks(result.results, result.totalMarks);
      const batchName = getBatchName(result);
      return [
        result.student?.name || "",
        getStudentRegNo(result),
        batchName,
        fullMarks,
        achievedMarks,
        result.grade,
        result.gpa,
        result.position,
      ];
    });

    const filename = `monthly_results_${selectedClassName || "all"}`;
    downloadCSV(headers, rows, filename);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-5">
        <h1 className="text-xl font-bold text-gray-900">Monthly Result</h1>
        {selectedClassName && (
          <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-0.5 rounded-full">
            {selectedClassName}
          </span>
        )}
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-52">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for students"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm text-gray-700 bg-transparent outline-none w-full placeholder-gray-400"
            />
          </div>

          {/* Select Class */}
          <select
            value={selectedClassId}
            onChange={handleClassChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white cursor-pointer outline-none min-w-32.5"
          >
            <option value="">Select Class</option>
            {classesData.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className}
              </option>
            ))}
          </select>

          {/* Select Batch — only show batches of selected class */}
          <select
            value={selectedBatchId}
            onChange={handleBatchChange}
            disabled={!selectedClassId}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white cursor-pointer outline-none min-w-32.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select Batch</option>
            {availableBatches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>

          {/* Clear Filter — only shown when a filter is active */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear Filter
            </button>
          )}

          {/* Calculate Position */}
          <button
            onClick={calculatePositions}
            className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Calculate Position
          </button>

          {/* Download CSV */}
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download CSV
          </button>

          {/* Give Result */}
          <Link
            href="/dashboard/result/give-result"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Give Result
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto whitespace-nowrap">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2.5 text-left w-9">
                  <input
                    type="checkbox"
                    checked={checkedAll}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  Student's Name
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Student's ID
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Batch
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Total Mark
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16v-4m0-4h.01"
                      />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  Achieved Mark
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  Grade
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  GPA
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  Position
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-3 py-10 text-center text-gray-400 text-sm"
                  >
                    No results found.
                  </td>
                </tr>
              ) : (
                results.map((result) => {
                  const achievedMarks = getAchievedMarks(result.results);
                  const fullMarks = getFullMarks(
                    result.results,
                    result.totalMarks,
                  );
                  const batchName = getBatchName(result);

                  return (
                    <tr
                      key={result.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-3.5">
                        <input
                          type="checkbox"
                          checked={!!checked[result.id]}
                          onChange={() => toggleOne(result.id)}
                          className="w-4 h-4 accent-orange-500 cursor-pointer"
                        />
                      </td>

                      {/* Name + Avatar */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {result.student?.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {result.student?.username ??
                                result.student?.parentPhone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Student ID / Reg No */}
                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {getStudentRegNo(result)}
                        </span>
                      </td>

                      {/* Batch */}
                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {batchName}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-gray-700 font-medium">
                        {fullMarks}
                      </td>
                      <td className="px-3 py-3.5 text-gray-700 font-medium">
                        {achievedMarks}
                      </td>

                      {/* Grade */}
                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {result.grade}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-gray-700 font-medium">
                        {result.gpa}
                      </td>
                      <td className="px-3 py-3.5 text-gray-700 font-medium">
                        #{result.position}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/dashboard/result/view/${result.id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            title="View Grade"
                          >
                            <GradeIcon />
                          </Link>
                          <DeleteMonthlyResultDialog id={result.id} />
                          <Link
                            href={`/dashboard/result/edit/${result.id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-500 hover:bg-purple-100 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}