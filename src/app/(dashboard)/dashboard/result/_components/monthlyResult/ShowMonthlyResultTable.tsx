"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import DeleteMonthlyResultDialog from "./DeleteMonthlyResultDialog";
import { downloadCSV } from "@/src/utils/downloadCSV";
import { calculatePositionsByClass } from "@/src/services/monthlyResult";
import { showSuccessToast, showErrorToast } from "@/src/utils/toastMessage";
import ResultModeSwitch from "../ResultModeSwitch";
import { getStudentGroup } from "@/src/utils/studentGroup";
import { computeMonthlyResultSummary } from "@/src/utils/monthlyResultSummary";

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

interface ResultSubject {
  id: string;
  subjectName: string;
  stdRegNo: string;
  marks: number;
  fullMarks: number;
  highestMark: number;
  isAbsent?: boolean;
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
  month?: string | null;
  monthlyExamName?: string | null;
  classId?: string;
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

const MONTHS = [
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

const getResultYear = (result: MonthlyResult) => {
  const d = new Date(result.createdAt);
  const y = d.getFullYear();
  return Number.isFinite(y) ? String(y) : "";
};

export default function ShowMonthlyResultTable({
  monthlyResultsData = [],
  classesData = [],
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [checkedAll, setCheckedAll] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [examNameChoice, setExamNameChoice] = useState("");

  const [selectedClassId, setSelectedClassId] = useState(
    searchParams.get("classId") || "",
  );
  const [selectedBatchId, setSelectedBatchId] = useState(
    searchParams.get("batchId") || "",
  );
  const [selectedMonth, setSelectedMonth] = useState(searchParams.get("month") || "");
  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || "all");
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const updateFilters = (next: {
    classId?: string;
    batchId?: string;
    search?: string;
    month?: string;
    year?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    const apply = (key: string, value: string | undefined) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    if ("classId" in next) apply("classId", next.classId);
    if ("batchId" in next) apply("batchId", next.batchId);
    if ("search" in next) apply("search", next.search);
    if ("month" in next) apply("month", next.month);
    if ("year" in next) apply("year", next.year);

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

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

  const summaryById = useMemo(() => {
    const map = new Map<string, ReturnType<typeof computeMonthlyResultSummary>>();
    for (const result of monthlyResultsData) {
      const classId = (result.student as any)?.classId || (result as any).classId;
      const classData = classesData.find((c) => c.id === classId);
      const classSubjects = classData?.subjects || [];
      const group = getStudentGroup((result.student as any)?.stdRegNo || "");
      const classNumber = classData?.className || (result.student as any)?.stdClass?.className;
      map.set(result.id, computeMonthlyResultSummary({ resultSubjects: result.results || [], classSubjects, group, classNumber, fallbackTotalMarks: result.totalMarks, createdAt: (result as any).createdAt }));
    }
    return map;
  }, [monthlyResultsData, classesData]);
  const getResultSummary = (result: MonthlyResult) => summaryById.get(result.id) || computeMonthlyResultSummary({ resultSubjects: result.results || [], fallbackTotalMarks: result.totalMarks, createdAt: (result as any).createdAt });
  const getAchievedMarks = (result: MonthlyResult) => getResultSummary(result).obtained;
  const getFullMarks = (result: MonthlyResult) => getResultSummary(result).full;

  const selectedClassName = classesData.find((c) => c.id === selectedClassId)?.className;
  const availableBatches = classesData.find((c) => c.id === selectedClassId)?.batches ?? [];
  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return ["all", ...Array.from({ length: 7 }, (_, i) => String(current - 3 + i))];
  }, []);

  const normalizeMonth = (m?: string | null) => {
    const raw = String(m || "").trim().toLowerCase();
    const map: Record<string, string> = {
      "1":"january","01":"january","jan":"january","january":"january",
      "2":"february","02":"february","feb":"february","february":"february",
      "3":"march","03":"march","mar":"march","march":"march",
      "4":"april","04":"april","apr":"april","april":"april",
      "5":"may","05":"may","may":"may",
      "6":"june","06":"june","jun":"june","june":"june",
      "7":"july","07":"july","jul":"july","july":"july",
      "8":"august","08":"august","aug":"august","august":"august",
      "9":"september","09":"september","sep":"september","sept":"september","september":"september",
      "10":"october","oct":"october","october":"october",
      "11":"november","nov":"november","november":"november",
      "12":"december","dec":"december","december":"december",
    };
    return map[raw] || raw;
  };

  const matchingResults = useMemo(() => {
    if (!selectedClassId || !selectedMonth) return [];
    const targetMonth = normalizeMonth(selectedMonth);
    return monthlyResultsData.filter((r) => {
      const classId = r.student?.classId || r.classId;
      if (classId !== selectedClassId) return false;
      if (normalizeMonth(r.month) !== targetMonth) return false;
      if (selectedYear && selectedYear !== "all" && getResultYear(r) !== selectedYear) return false;
      return true;
    });
  }, [monthlyResultsData, selectedClassId, selectedMonth, selectedYear]);

  const examNamesInScope = useMemo(() => {
    const names = Array.from(
      new Set(
        matchingResults
          .map((r) => String(r.monthlyExamName || "").trim())
          .filter(Boolean),
      ),
    );
    return names.sort((a, b) => a.localeCompare(b));
  }, [matchingResults]);

  const scopedResultsCount = useMemo(() => {
    if (!selectedClassId || !selectedMonth) return 0;
    if (examNamesInScope.length > 1 && examNameChoice) {
      return matchingResults.filter((r) => String(r.monthlyExamName || "").trim() === examNameChoice).length;
    }
    return matchingResults.length;
  }, [selectedClassId, selectedMonth, examNamesInScope.length, examNameChoice, matchingResults]);

  const canCalculate = !!selectedClassId && !!selectedMonth && !isCalculating;

  const openCalculateConfirm = () => {
    if (!selectedClassId) { showErrorToast("Select a class first"); return; }
    if (!selectedMonth) { showErrorToast("Select class and month first"); return; }
    setExamNameChoice(examNamesInScope.length > 1 ? "__ALL__" : (examNamesInScope[0] || ""));
    setShowConfirm(true);
  };

  const calculatePositions = async () => {
    if (!canCalculate) { showErrorToast("Select class and month first"); return; }
    const examName = examNamesInScope.length > 1 && examNameChoice !== "__ALL__" ? examNameChoice : undefined;
    setIsCalculating(true);
    try {
      const yearArg = selectedYear && selectedYear !== "all" ? selectedYear : undefined;
      const res = await calculatePositionsByClass(selectedClassId, selectedMonth, yearArg, examName);
      if (!res || res?.statusCode >= 400) {
        showErrorToast(res?.message || "Failed to calculate positions");
        return;
      }
      showSuccessToast(`Positions calculated for ${res?.data?.totalStudents ?? res?.totalStudents ?? 0} students.`);
      setShowConfirm(false);
      router.refresh();
    } catch {
      showErrorToast("Something went wrong while calculating positions");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    setSelectedBatchId("");
    setShowConfirm(false);
    updateFilters({ classId, batchId: "" });
  };

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const batchId = e.target.value;
    setSelectedBatchId(batchId);
    updateFilters({ batchId });
  };

  const hasActiveFilters = !!(selectedClassId || selectedBatchId || search || selectedMonth || (selectedYear && selectedYear !== "all"));

  const clearFilters = () => {
    setSelectedClassId("");
    setSelectedBatchId("");
    setSelectedMonth("");
    setSelectedYear("all");
    setSearch("");
    setShowConfirm(false);
    router.push(pathname);
  };

  const studentRegNoMap = new Map<string, string>();
  for (const cls of classesData) {
    for (const s of cls.students ?? []) {
      if (s.id && (s as any).stdRegNo) {
        studentRegNoMap.set(s.id, (s as any).stdRegNo);
      }
    }
  }

  const getBatchName = (result: MonthlyResult): string => {
    if (result.student?.batch?.name) return result.student.batch.name;
    if (result.student?.batchId) {
      for (const cls of classesData) {
        const batch = cls.batches?.find(
          (b) => b.id === result.student.batchId,
        );
        if (batch) return batch.name;
      }
    }
    return "—";
  };

  const getStudentRegNo = (result: MonthlyResult): string => {
    if (result.stdRegNo) return result.stdRegNo;
    if (result.student?.stdRegNo) return result.student.stdRegNo;
    if (result.student?.username) return result.student.username;
    if (result.student?.id && studentRegNoMap.has(result.student.id)) {
      return studentRegNoMap.get(result.student.id)!;
    }
    return "—";
  };

  const results = monthlyResultsData;

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
      const s = getResultSummary(result);
      const achievedMarks = s.obtained;
      const fullMarks = s.full;
      const batchName = getBatchName(result);
      return [
        result.student?.name || "",
        getStudentRegNo(result),
        batchName,
        fullMarks,
        achievedMarks,
        s.grade,
        s.gpa,
        result.position,
      ];
    });

    const filename = `monthly_results_${selectedClassName || "all"}`;
    downloadCSV(headers, rows, filename);
  };

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

          <select
            value={selectedMonth}
            onChange={(e) => {
              const month = e.target.value;
              setSelectedMonth(month);
              setShowConfirm(false);
              updateFilters({ month });
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white cursor-pointer outline-none min-w-32.5"
          >
            <option value="">Select Month</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => {
              const year = e.target.value;
              setSelectedYear(year);
              setShowConfirm(false);
              updateFilters({ year: year === "all" ? "" : year });
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white cursor-pointer outline-none min-w-28"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y === "all" ? "All years" : y}</option>
            ))}
          </select>
          <span className="text-[11px] text-gray-400">Year filter: based on saved date (temporary)</span>

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

          <div className="flex flex-col items-start gap-1">
            <button
              onClick={openCalculateConfirm}
              disabled={!selectedClassId || !selectedMonth || isCalculating}
              title={
                !selectedClassId || !selectedMonth
                  ? "Select class and month first"
                  : "Calculate positions for this class/month"
              }
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              {isCalculating ? "Calculating..." : "Calculate Position"}
            </button>
            {(!selectedClassId || !selectedMonth) && (
              <span className="text-xs text-amber-600">Select class and month first</span>
            )}
          </div>

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

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
              <h3 className="text-base font-semibold text-gray-900">Confirm position calculation</h3>
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <p><span className="font-medium text-gray-900">Class:</span> {selectedClassName || selectedClassId}</p>
                <p><span className="font-medium text-gray-900">Month:</span> {selectedMonth}</p>
                <p><span className="font-medium text-gray-900">Year:</span> {selectedYear === "all" ? "All years (temporary: saved date rule not applied)" : `${selectedYear} (temporary: saved date)`}</p>
                <p><span className="font-medium text-gray-900">Results to rank:</span> {scopedResultsCount}</p>
              </div>

              {examNamesInScope.length > 1 && (
                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Exam name</label>
                  <select
                    value={examNameChoice}
                    onChange={(e) => setExamNameChoice(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
                  >
                    <option value="__ALL__">All exam names in this month</option>
                    {examNamesInScope.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Multiple exam names found for this month. Choose one, or rank all names in this month/year.</p>
                </div>
              )}

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  disabled={isCalculating}
                >
                  Cancel
                </button>
                <button
                  onClick={calculatePositions}
                  disabled={isCalculating || scopedResultsCount === 0}
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {isCalculating ? "Calculating..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

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
                  const s = getResultSummary(result);
                  const achievedMarks = s.obtained;
                  const fullMarks = s.full;
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

                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {getStudentRegNo(result)}
                        </span>
                      </td>

                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {batchName}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-gray-700 font-medium">
                        <div className="inline-flex items-center gap-1.5">
                          <span>{fullMarks}</span>
                          {s.excludedRows?.length ? (
                            <span title={`${s.excludedRows.length} subject(s) outside this student's group were ignored`} className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold cursor-help">!</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-gray-700 font-medium">
                        {achievedMarks}
                      </td>

                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {s.grade}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-gray-700 font-medium">
                        {s.gpa}
                      </td>
                      <td className="px-3 py-3.5 text-gray-700 font-medium">
                        #{result.position}
                      </td>

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