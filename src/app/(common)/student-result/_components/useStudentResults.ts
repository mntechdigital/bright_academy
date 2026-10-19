"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyResults, getMeritPosition } from "@/src/services/students";
import { getExamRoutines } from "@/src/services/examRoutines";
import { getGradeFromMarks } from "@/src/utils/gradeUtils";
import {
  computeExamSummary,
  RoutineForSummary,
  weekNumber,
} from "@/src/utils/examSummary";
import {
  ApiResponse,
  ClassSubject,
  MonthlySubjectRow,
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

// Sentinel for the "Overall" button: ranks the whole month instead of a
// single week. It lives in the same `week` state, so the selector keeps
// exactly one active choice — picking a week clears Overall and vice versa.
export const OVERALL_MERIT = "Overall";

// Default selection: the latest week that actually has data, else Week 1.
// ("Overall" is never a default.)
const defaultWeekFor = (weeksWithData: string[]): string =>
  [...FILTER_WEEKS].reverse().find((w) => weeksWithData.includes(w)) ??
  "Week 1";

function createdAtYear(value: string | undefined): string {
  if (!value) return "";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "";
  return String(new Date(value).getFullYear());
}

export function useStudentResults() {
  const [resultData, setResultData] = useState<ApiResponse | null>(null);
  // The class's subject list in canonical order (sortOrder). Every subject of
  // the class appears in the result tables in this order — even without marks.
  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([]);
  const [meritPosition, setMeritPosition] = useState<string | null>(null);
  const [meritLoading, setMeritLoading] = useState(false);
  // Set when the merit request itself fails, so the UI can show a friendly
  // message instead of silently rendering "-".
  const [meritError, setMeritError] = useState<string | null>(null);
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
        setClassSubjects(res?.data?.classSubjects ?? []);

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
  // "Overall" is exempt here; it is only cleared by the Month/Year reset below.
  useEffect(() => {
    if (week === OVERALL_MERIT) return;
    if (weeksWithData.includes(week)) return;
    setWeek(defaultWeekFor(weeksWithData));
  }, [weeksWithData, week]);

  // Switching Month/Year resets the selection to the default week (latest
  // with data, else Week 1) and never leaves "Overall" selected. The merit
  // fetch below depends on [week, month, year], so the position reloads too.
  useEffect(() => {
    setWeek(defaultWeekFor(weeksWithData));
  }, [month, year, weeksWithData]);

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

  // ── Student info from cookie ──────────────────────────────────────────
  const studentInfo = useMemo(() => getStudentFromCookie(), []);
  const classId = useMemo(() => getMeritIdsFromCookie().classId, []);

  // ── Exam routine for this class + year ─────────────────────────────────
  // Supplies the Total Marks denominator and the list of scheduled
  // (week, subject) exams. A class without a routine falls back to the
  // student's own saved marks (see computeExamSummary).
  const [routine, setRoutine] = useState<RoutineForSummary | null>(null);
  // Tracks whether the routine request is still in flight so the Overall
  // button can say "loading…" instead of wrongly claiming there is no routine.
  const [routineLoading, setRoutineLoading] = useState(true);
  useEffect(() => {
    if (!classId || !/^\d{4}$/.test(year)) {
      setRoutine(null);
      setRoutineLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setRoutineLoading(true);
      try {
        const res = await getExamRoutines({ classId, year });
        if (cancelled) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setRoutine((list[0] as RoutineForSummary | undefined) ?? null);
      } catch (error) {
        console.error("Failed to load exam routine for summary:", error);
        if (!cancelled) setRoutine(null);
      } finally {
        if (!cancelled) setRoutineLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [classId, year]);

  // ── Weekly computed data (selected Month + Year) ──────────────────────
  const weeklySummary = useMemo<WeeklySummaryData>(() => {
    const subjectMap = new Map<string, SubjectWeeksData>();

    weeklyRows.forEach((row) => {
      const subjectName = row.subject?.subjectName || "Unknown";
      const weekNum = weekNumber(row.week);

      if (!subjectMap.has(subjectName)) {
        subjectMap.set(subjectName, {
          subjectName,
          weeks: new Map(),
        });
      }

      if (weekNum === null) return;
      subjectMap.get(subjectName)!.weeks.set(String(weekNum), {
        obtained: row.obtainedMarks,
        total: row.totalMarks,
      });
    });

    // Canonical row order: the class subject list first (subjects with no
    // marks get empty cells), then any leftover mark subjects at the end,
    // sorted by name.
    const orderedNames = classSubjects.map((s) => s.subjectName);
    const subjectArray: SubjectWeeksData[] = orderedNames.map(
      (name) =>
        subjectMap.get(name) ?? { subjectName: name, weeks: new Map() }
    );
    const leftoverNames = [...subjectMap.keys()]
      .filter((name) => !orderedNames.includes(name))
      .sort();
    for (const name of leftoverNames) {
      subjectArray.push(subjectMap.get(name)!);
    }

    // The totals come from the routine via one shared function, so the screen
    // and the print view can never disagree.
    const summary = computeExamSummary(routine, weeklyRows);

    if (summary.warnings.length > 0) {
      console.warn("[Exam Summary] routine problems:", {
        classId,
        year,
        warnings: summary.warnings,
      });
    }

    // GPA keeps its existing definition: the mean of per-subject mean grade
    // points, each derived from that week's own full marks. It is deliberately
    // independent of the routine denominator.
    const allSubjectPoints: number[] = [];
    subjectArray.forEach((subjectData) => {
      const subjPoints: number[] = [];
      [1, 2, 3, 4].forEach((weekNum) => {
        const weekData = subjectData.weeks.get(String(weekNum));
        if (weekData && weekData.obtained !== null && weekData.obtained !== undefined) {
          const gradeResult = getGradeFromMarks(weekData.obtained, weekData.total);
          subjPoints.push(gradeResult.gradePoint);
        }
      });
      if (subjPoints.length > 0) {
        allSubjectPoints.push(
          subjPoints.reduce((s, p) => s + p, 0) / subjPoints.length
        );
      }
    });

    const overallGPA = allSubjectPoints.length > 0
      ? allSubjectPoints.reduce((s, p) => s + p, 0) / allSubjectPoints.length
      : 0;

    // Reuses the corrected routine denominator, so this now selects the /400
    // grading table instead of silently falling through to /100.
    const overallGrade = summary.totalObtainedMarks > 0
      ? getGradeFromMarks(summary.totalObtainedMarks, summary.totalFullMarks).letterGrade
      : "F";

    return {
      subjectArray,
      totalObtainedMarks: summary.totalObtainedMarks,
      totalFullMarks: summary.totalFullMarks,
      scheduledExams: summary.scheduledExams,
      percentage: summary.percentage,
      usedRowFallback: summary.usedRowFallback,
      overallGPA,
      overallGrade,
      present: summary.present,
      absent: summary.absent,
    };
  }, [weeklyRows, routine, classId, year, classSubjects]);

  // Monthly tab rows: same canonical order as the weekly tab. Subjects with no
  // monthly result row appear with empty cells; leftover rows (subjects that
  // are not in the class list anymore) go last, sorted by name.
  const monthlySubjectRows = useMemo<MonthlySubjectRow[]>(() => {
    const rowsByName = new Map<string, SubjectResult>();
    subjectRows.forEach((row) => rowsByName.set(row.subjectName, row));

    const orderedNames = classSubjects.map((s) => s.subjectName);
    const merged: MonthlySubjectRow[] = orderedNames.map((name) => {
      const row = rowsByName.get(name);
      return row
        ? { ...row }
        : {
            id: null,
            subjectName: name,
            marks: null,
            fullMarks: null,
            highestMark: null,
            point: null,
            grade: null,
          };
    });
    const leftoverNames = [...rowsByName.keys()]
      .filter((name) => !orderedNames.includes(name))
      .sort();
    for (const name of leftoverNames) {
      merged.push({ ...rowsByName.get(name)! });
    }
    return merged;
  }, [subjectRows, classSubjects]);


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
      setMeritError(null);
      try {
        // Backend accepts the stored "Week N" format (it normalizes "Week 1"/"1")
        // and "Overall" for the whole-month rank — same endpoint either way, so
        // a selection change costs exactly one request.
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
        } else if (meritRes?.success === false) {
          // The request itself failed — surface a friendly message instead of
          // silently rendering "-".
          setMeritPosition(null);
          setMeritError(
            meritRes?.message ||
              "Could not load merit position. Please try again."
          );
        } else {
          // Success with no data → the student simply has no rank for this
          // period (handled the same way the weekly merit always has).
          setMeritPosition(null);
        }
      } catch (error) {
        console.error("Error fetching merit position:", error);
        if (!cancelled) {
          setMeritPosition(null);
          setMeritError("Could not load merit position. Please try again.");
        }
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

  // ── Overall availability ─────────────────────────────────────────────────
  // "Overall" must never show a wrong number: it needs at least one week of
  // marks for the month and the exam routine that defines that month's
  // schedule. When either is missing the button is disabled with a tooltip.
  const overallDisabledReason =
    weeksWithData.length === 0
      ? "No marks entered for this month yet"
      : routineLoading
        ? "Loading exam routine…"
        : !routine
          ? "No exam routine found for this class yet"
          : null;

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
    meritError,
    overallDisabled: overallDisabledReason !== null,
    overallDisabledReason,
    months,
    years,
    noData,
    filteredEmpty,
    monthlyResults: monthlyForMonth,
    weeklyRows,
    activeMonthly,
    subjectRows,
    monthlySubjectRows,
    weeklySummary,
    studentInfo,
    displayMeritPosition,
    displayMonthlyPosition,
  };
}
