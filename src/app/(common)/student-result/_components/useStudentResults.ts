"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyResults, getMeritPosition } from "@/src/services/students";
import { getGradeFromMarks } from "@/src/utils/gradeUtils";
import {
  ApiResponse,
  SubjectResult,
  SubjectWeeksData,
  WeeklySummaryData,
} from "./types";
import { getStudentFromCookie, getMeritIdsFromCookie } from "./utils";

const MONTH_NAMES = [
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

const MONTH_INDEX: Record<string, number> = Object.fromEntries(
  MONTH_NAMES.map((name, index) => [name, index])
);

// Only Week 1 to Week 4 exist in a month. Stored records using any other
// week value are left untouched; they simply cannot be selected here.
export const FILTER_WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4"];

function weekNumber(week: string | undefined): number | null {
  if (!week) return null;
  const cleaned = week.trim().replace(/Week[- ]?/i, "").trim();
  if (!/^\d+$/.test(cleaned)) return null;
  const num = parseInt(cleaned, 10);
  return num >= 1 && num <= 4 ? num : null;
}

function createdAtYear(value: string | undefined): string {
  if (!value) return "";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "";
  return String(new Date(value).getFullYear());
}

export function useStudentResults() {
  const [resultData, setResultData] = useState<ApiResponse | null>(null);
  const [meritPosition, setMeritPosition] = useState<string | null>(null);
  const [meritLoading, setMeritLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"monthly" | "weekly">("monthly");

  // Shared Month + Year filter state. Defaults are corrected to the most
  // recent month/year with data once the results load (see below).
  const now = new Date();
  const [month, setMonth] = useState(MONTH_NAMES[now.getMonth()]);
  const [year, setYear] = useState(String(now.getFullYear()));
  // Selected week inside the Weekly tab — controls only the merit position.
  const [week, setWeek] = useState("Week 1");

  // ── Initial fetch ─────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getMyResults();
        if (cancelled) return;
        setResultData(res);

        const monthlyResults = res?.data?.monthlyResults ?? [];
        const weeklyMarks = res?.data?.weeklyMarks ?? [];

        // Smart defaults: current month/year when data exists for them,
        // otherwise the most recent month/year found in the data.
        const currentMonth = MONTH_NAMES[new Date().getMonth()];
        const currentYear = String(new Date().getFullYear());
        const pairHasData = (m: string, y: string) =>
          weeklyMarks.some((r: any) => r.month === m && r.year === y) ||
          monthlyResults.some(
            (r: any) =>
              r.month === m &&
              (!r.createdAt || createdAtYear(r.createdAt) === y)
          );

        if (pairHasData(currentMonth, currentYear)) {
          setMonth(currentMonth);
          setYear(currentYear);
        } else {
          const scored = [
            ...weeklyMarks.map((r: any) => ({ month: r.month, year: r.year })),
            ...monthlyResults.map((r: any) => ({
              month: r.month,
              year: createdAtYear(r.createdAt),
            })),
          ]
            .filter(
              (p) =>
                MONTH_INDEX[p.month] !== undefined && /^\d{4}$/.test(p.year)
            )
            .map((p) => ({
              ...p,
              score: Number(p.year) * 12 + MONTH_INDEX[p.month],
            }))
            .sort((a, b) => b.score - a.score);
          if (scored.length > 0) {
            setMonth(scored[0].month);
            setYear(scored[0].year);
          }
        }
      } catch {
        if (!cancelled) {
          setError("ফলাফল লোড করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Raw data ──────────────────────────────────────────────────────────
  const monthlyResults = resultData?.data?.monthlyResults ?? [];
  const weeklyMarks = resultData?.data?.weeklyMarks ?? [];

  // ── Filtered by shared Month + Year ───────────────────────────────────
  const filteredWeekly = useMemo(
    () => weeklyMarks.filter((r) => r.month === month && r.year === year),
    [weeklyMarks, month, year]
  );

  const monthlyForMonth = useMemo(
    () =>
      monthlyResults.filter(
        (r) =>
          r.month === month &&
          (!r.createdAt ||
            createdAtYear(r.createdAt) === "" ||
            createdAtYear(r.createdAt) === year)
      ),
    [monthlyResults, month, year]
  );

  // Monthly records carry no year column; createdAt is used to keep only the
  // record(s) matching the selected year (records without createdAt stay
  // visible for any year). No fallback to another year's record — otherwise
  // the Monthly tab would show stale data after a Year change.
  const activeMonthly = useMemo(() => {
    if (monthlyForMonth.length === 0) return undefined;
    return monthlyForMonth[0];
  }, [monthlyForMonth]);

  const subjectRows: SubjectResult[] = activeMonthly?.results ?? [];
  const weeklyRows = filteredWeekly;

  // Weeks (of 1-4) that actually have marks for the selected Month + Year.
  const weeksWithData = useMemo(() => {
    const found = new Set<string>();
    filteredWeekly.forEach((row) => {
      const num = weekNumber(row.week);
      if (num !== null) found.add(`Week ${num}`);
    });
    return FILTER_WEEKS.filter((w) => found.has(w));
  }, [filteredWeekly]);

  // Keep the selected merit week valid: latest week with data, else Week 1.
  // The early return means manual week picks never get overridden — this
  // only reacts when Month/Year/data change the available weeks.
  useEffect(() => {
    if (weeksWithData.includes(week)) return;
    const latest = [...FILTER_WEEKS]
      .reverse()
      .find((w) => weeksWithData.includes(w));
    setWeek(latest ?? "Week 1");
  }, [weeksWithData, week]);

  // Month/Year options are the union of months/years found in EITHER
  // weeklyMarks or monthlyResults. Building them from only one source caused
  // the reported desync: the default month (most recent across both sources,
  // e.g. December from weeklyMarks) had no matching <option> when
  // monthlyResults only contained June, so the native select fell back to
  // displaying its first option (June) while the state (December) still
  // drove the table. Keeping both lists as unions guarantees the controlled
  // select value always matches an option.
  const allMonths = [
    ...new Set([
      ...weeklyMarks.map((r) => r.month),
      ...monthlyResults.map((r) => r.month),
    ]),
  ].filter((m) => MONTH_INDEX[m] !== undefined);
  // Calendar order keeps the existing UI stable.
  allMonths.sort((a, b) => MONTH_INDEX[a] - MONTH_INDEX[b]);
  const allYears = [
    ...new Set([
      ...weeklyMarks
        .map((r) => r.year)
        .filter((y) => typeof y === "string" && /^\d{4}$/.test(y)),
      ...monthlyResults
        .map((r) => createdAtYear(r.createdAt))
        .filter((y) => /^\d{4}$/.test(y)),
    ]),
  ].sort((a, b) => Number(b) - Number(a));

  const months = allMonths.length ? allMonths : [...MONTH_NAMES];
  const years = allYears.length ? allYears : ["2025", "2026"];

  const noData = monthlyResults.length === 0 && weeklyMarks.length === 0;
  const filteredEmpty = !noData && filteredWeekly.length === 0 && !activeMonthly;

  // ── Weekly computed data (selected Month + Year) ──────────────────────
  const weeklySummary = useMemo<WeeklySummaryData>(() => {
    const subjectMap = new Map<string, SubjectWeeksData>();

    weeklyRows.forEach((row) => {
      const subjectName = row.subject?.subjectName || "Unknown";
      const weekNum = row.week?.replace("Week ", "") || "0";

      if (!subjectMap.has(subjectName)) {
        subjectMap.set(subjectName, {
          subjectName,
          weeks: new Map(),
        });
      }

      const subjectData = subjectMap.get(subjectName)!;
      subjectData.weeks.set(weekNum, {
        obtained: row.obtainedMarks,
        total: row.totalMarks,
      });
    });

    const subjectArray = Array.from(subjectMap.values());

    // Calculate overall summary
    let totalObtainedMarks = 0;
    let totalFullMarks = 0;
    const allSubjectPoints: number[] = [];

    subjectArray.forEach((subjectData) => {
      const subjPoints: number[] = [];
      [1, 2, 3, 4].forEach((weekNum) => {
        const weekData = subjectData.weeks.get(String(weekNum));
        if (weekData && weekData.obtained !== null && weekData.obtained !== undefined) {
          totalObtainedMarks += weekData.obtained;
          totalFullMarks += weekData.total;
          // Use actual marks and total marks to determine grade point (auto-detects 400-mark system)
          const gradeResult = getGradeFromMarks(weekData.obtained, weekData.total);
          subjPoints.push(gradeResult.gradePoint);
        }
      });
      if (subjPoints.length > 0) {
        const avg = subjPoints.reduce((s, p) => s + p, 0) / subjPoints.length;
        allSubjectPoints.push(avg);
      }
    });

    const overallGPA = allSubjectPoints.length > 0
      ? allSubjectPoints.reduce((s, p) => s + p, 0) / allSubjectPoints.length
      : 0;

    // Calculate overall grade based on total obtained marks vs total full marks
    const overallGrade = totalObtainedMarks > 0
      ? getGradeFromMarks(totalObtainedMarks, totalFullMarks).letterGrade
      : "F";

    // Calculate present/absent: for each subject, for each of 4 weeks,
    // if marks exist → present, otherwise → absent
    let present = 0;
    let absent = 0;
    subjectArray.forEach((subjectData) => {
      [1, 2, 3, 4].forEach((weekNum) => {
        const weekData = subjectData.weeks.get(String(weekNum));
        if (weekData && weekData.obtained !== null && weekData.obtained !== undefined) {
          present++;
        } else {
          absent++;
        }
      });
    });

    return {
      subjectArray,
      totalObtainedMarks,
      totalFullMarks,
      overallGPA,
      overallGrade,
      present,
      absent,
    };
  }, [weeklyRows]);

  // ── Student info from cookie ──────────────────────────────────────────
  const studentInfo = useMemo(() => getStudentFromCookie(), []);

  // ── Merit position (selected Week + Month + Year) ─────────────────────
  // Refetched whenever the selection changes; the previous value is cleared
  // first so stale positions are never shown.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { studentId, classId } = getMeritIdsFromCookie();
      if (!studentId || !classId || !week || !month || !year) {
        setMeritPosition(null);
        setMeritLoading(false);
        return;
      }
      setMeritLoading(true);
      setMeritPosition(null);
      try {
        // Backend accepts the stored "Week N" format (it normalizes "Week 1"/"1").
        const meritRes = await getMeritPosition({
          studentId,
          classId,
          week,
          month,
          year,
        });
        if (cancelled) return;
        if (meritRes?.success && meritRes?.data) {
          const position = meritRes.data.position || meritRes.data.meritPosition;
          setMeritPosition(position ? String(position) : null);
        } else {
          setMeritPosition(null);
        }
      } catch (error) {
        console.error("Error fetching merit position:", error);
        if (!cancelled) setMeritPosition(null);
      } finally {
        if (!cancelled) setMeritLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [week, month, year]);

  // ── Merit Position ──────────────────────────────────────────────────────
  // Prioritizes weekly meritPosition, falls back to monthly position (if non-empty)
  const displayMeritPosition =
    meritPosition ||
    (activeMonthly?.position && String(activeMonthly.position).trim() !== ""
      ? activeMonthly.position
      : null);
  // Monthly Exam Summary position: prioritize monthly stored position, fallback to weekly merit
  const displayMonthlyPosition =
    activeMonthly?.position && String(activeMonthly.position).trim() !== ""
      ? activeMonthly.position
      : meritPosition || null;

  return {
    loading,
    error,
    activeTab,
    setActiveTab,
    month,
    setMonth,
    year,
    setYear,
    week,
    setWeek,
    weeksWithData,
    meritLoading,
    months,
    years,
    noData,
    filteredEmpty,
    monthlyResults: monthlyForMonth,
    weeklyRows,
    activeMonthly,
    subjectRows,
    weeklySummary,
    studentInfo,
    displayMeritPosition,
    displayMonthlyPosition,
  };
}
