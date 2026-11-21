"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyResults, getMeritPosition } from "@/src/services/students";
import { getExamRoutines } from "@/src/services/examRoutines";
import { getGradeFromMarks, getGradeFromTotal } from "@/src/utils/gradeUtils";
import { computeMonthlyResultSummary } from "@/src/utils/monthlyResultSummary";
import {
  computeExamSummary,
  RoutineForSummary,
  weekNumber,
} from "@/src/utils/examSummary";
import { getStudentGroup } from "@/src/utils/studentGroup";
import {
  getCanonicalCombinedName,
  hasMeaningfulMarks,
  isCrossGroupLeftover,
  isGroupClass,
  normalizeSubjectName,
} from "@/src/utils/groupSubjects";
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

  const studentGroup = getStudentGroup(studentInfo?.stdRegNo || "");
  const studentClassNumber = studentInfo?.className;
  const isGroupAware = isGroupClass(studentClassNumber) && !!studentGroup;

  const resolveResultRowName = (rawName: string | undefined) => {
    const name = (rawName ?? "").trim();
    if (!name) return "";
    if (isGroupAware) {
      const canonical = getCanonicalCombinedName(
        name,
        studentGroup,
        studentClassNumber
      );
      if (canonical) return canonical;
    }
    return name;
  };

  // ── Subjects for result rows ──────────────────────────────────────────
  // Weekly table rows must come from the routine/schedule for the class+year
  // so every scheduled subject appears even when this student has no mark row
  // (absent/newly added exam). Marks are left-joined onto these subjects.
  // Fallback (no routine): use the class subject catalog plus any subjects the
  // student has marks for. Monthly tab reuses the same ordered list and merges
  // its own mark rows onto it (subjects with no monthly row get empty cells).
  const scheduledSubjectNames = useMemo(() => {
    const normName = (name: string) => normalizeSubjectName(name);
    const catalogIdIndex = new Map(classSubjects.map((s, i) => [s.id, i]));
    const catalogNameIndex = new Map(
      classSubjects.map((s, i) => [normName(s.subjectName), i])
    );
    const getCatalogIndex = (id: string | undefined, name: string) => {
      if (id && catalogIdIndex.has(id)) return catalogIdIndex.get(id)!;
      return catalogNameIndex.get(normName(name));
    };

    if (routine?.weeks?.length) {
      const entries: { id?: string; name: string; routineIndex: number }[] = [];
      const seen = new Set<string>();
      let routineIndex = 0;
      [...routine.weeks]
        .sort((a, b) => a.weekNo - b.weekNo)
        .forEach((week) => {
          (week.subjects ?? []).forEach((s) => {
            const subject = s.subject as
              | { id?: string; subjectId?: string; subjectName?: string }
              | undefined;
            const rawName = subject?.subjectName;
            if (!rawName) return;
            const id = subject?.id ?? subject?.subjectId;
            const name = rawName.trim();
            const resolvedName = resolveResultRowName(name);
            // Dedupe by normalized display/result name so catalog+result aliases collapse.
            const key = normName(resolvedName || name);
            if (seen.has(key)) return;
            seen.add(key);
            entries.push({
              id,
              name: resolvedName || name,
              routineIndex: routineIndex++,
            });
          });
        });
      if (entries.length) {
        entries.sort((a, b) => {
          const ia = getCatalogIndex(a.id, a.name);
          const ib = getCatalogIndex(b.id, b.name);
          if (ia !== undefined && ib !== undefined) return ia - ib;
          if (ia !== undefined) return -1;
          if (ib !== undefined) return 1;
          return a.routineIndex - b.routineIndex;
        });
        return entries.map((e) => e.name);
      }
    }

    const entries: { id?: string; name: string; order: number }[] = [];
    const seen = new Set<string>();
    let order = 0;
    const add = (id: string | undefined, rawName: string | undefined) => {
      const original = (rawName ?? "").trim();
      if (!original) return;
      const resolvedName = resolveResultRowName(original);
      // Single normalized-name key (lowercase, NBSP/whitespace collapsed, trimmed)
      // so catalog id and result-name forms of the same subject do not duplicate.
      const key = normName(resolvedName || original);
      if (seen.has(key)) return;
      seen.add(key);
      entries.push({ id, name: resolvedName || original, order: order++ });
    };
    classSubjects.forEach((s) => add(s.id, s.subjectName));
    weeklyMarks.forEach((r) => add(r.subject?.id, r.subject?.subjectName));
    monthlyResults.forEach((r) => {
      (r.results ?? []).forEach((s) => add(undefined, s.subjectName));
    });

    return entries
      .sort((a, b) => {
        const ia = getCatalogIndex(a.id, a.name);
        const ib = getCatalogIndex(b.id, b.name);
        // Keep catalog order for catalog-known subjects.
        if (ia !== undefined && ib !== undefined) return ia - ib;
        if (ia !== undefined) return -1;
        if (ib !== undefined) return 1;
        return a.order - b.order;
      })
      .map((e) => e.name);
  }, [
    routine,
    classSubjects,
    weeklyMarks,
    monthlyResults,
    studentGroup,
    studentClassNumber,
    isGroupAware,
  ]);

  // ── Weekly computed data (selected Month + Year) ──────────────────────
  const weeklySummary = useMemo<WeeklySummaryData>(() => {
    const subjectMap = new Map<string, SubjectWeeksData>();

    weeklyRows.forEach((row) => {
      const rawSubjectName = row.subject?.subjectName || "Unknown";
      const subjectName = resolveResultRowName(rawSubjectName) || rawSubjectName;
      const weekNum = weekNumber(row.week);

      if (!subjectMap.has(subjectName)) {
        subjectMap.set(subjectName, {
          subjectName,
          weeks: new Map(),
        });
      }

      if (weekNum === null) return;
      // Do not overwrite an existing (subject, week) entry to avoid altering display/totals.
      const weekKey = String(weekNum);
      const weeks = subjectMap.get(subjectName)!.weeks;
      if (!weeks.has(weekKey)) {
        weeks.set(weekKey, {
          obtained: row.obtainedMarks,
          total: row.totalMarks,
        });
      }
    });

    // Show every subject from the routine/schedule (or class fallback) in order.
    // A subject with no marks for this student/month gets empty cells so missing
    // exams appear as absent in the row and contribute 0 to subject totals/avg.
    const subjectArray: SubjectWeeksData[] = [];
    scheduledSubjectNames.forEach((name) => {
      const rowData = subjectMap.get(name);
      if (
        isGroupAware &&
        isCrossGroupLeftover(name, studentGroup, studentClassNumber)
      ) {
        const rawGroupKey = normalizeSubjectName(name);
        const hasAnyMeaningful = weeklyRows.some((r) => {
          const rawName = r.subject?.subjectName || "Unknown";
          return (
            normalizeSubjectName(resolveResultRowName(rawName) || rawName) ===
              rawGroupKey && hasMeaningfulMarks(r)
          ) || (normalizeSubjectName(rawName) === rawGroupKey && hasMeaningfulMarks(r));
        });
        if (!hasAnyMeaningful && !(rowData && Array.from(rowData.weeks.values()).some((w) => w.obtained != null && w.obtained !== 0))) {
          return;
        }
      }
      subjectArray.push(rowData ?? { subjectName: name, weeks: new Map() });
    });

    // Cross-group leftovers (Class 9/10): hide if no meaningful marks; keep if any
    // non-zero/meaningful marks exist so marks are never hidden.
    if (isGroupAware) {
      const leftoverGroups = new Map<
        string,
        { subjectName: string; rows: typeof weeklyRows }
      >();
      weeklyRows.forEach((row) => {
        const rawName = row.subject?.subjectName || "Unknown";
        if (!isCrossGroupLeftover(rawName, studentGroup, studentClassNumber)) return;
        const key = normalizeSubjectName(rawName);
        if (!leftoverGroups.has(key)) {
          leftoverGroups.set(key, { subjectName: rawName, rows: [] as any });
        }
        leftoverGroups.get(key)!.rows.push(row);
      });
      leftoverGroups.forEach(({ subjectName: rawName, rows }) => {
        const hasAnyMeaningful = rows.some((r) => hasMeaningfulMarks(r));
        if (!hasAnyMeaningful) return;
        const exists = subjectArray.some(
          (s) => normalizeSubjectName(s.subjectName) === normalizeSubjectName(rawName)
        );
        if (exists) return;
        const extraWeeks = new Map<string, { obtained: number | null; total: number }>();
        rows.forEach((r) => {
          const wn = weekNumber(r.week);
          if (wn === null) return;
          const wk = String(wn);
          if (!extraWeeks.has(wk)) {
            extraWeeks.set(wk, { obtained: r.obtainedMarks, total: r.totalMarks });
          }
        });
        subjectArray.push({ subjectName: rawName, weeks: extraWeeks });
      });
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

    // Subject-wise Average Point is computed per subject in the UI/table and
    // must not feed the overall GPA. Overall GPA/Grade/Total come from one
    // shared source based on ALL scheduled exams (absent/missing = 0).
    const overallResult = getGradeFromTotal(
      summary.totalObtainedMarks,
      summary.totalFullMarks
    );

    return {
      subjectArray,
      totalObtainedMarks: summary.totalObtainedMarks,
      totalFullMarks: summary.totalFullMarks,
      scheduledExams: summary.scheduledExams,
      percentage: summary.percentage,
      usedRowFallback: summary.usedRowFallback,
      overallGPA: overallResult.gradePoint,
      overallGrade: overallResult.letterGrade,
      present: summary.present,
      absent: summary.absent,
    };
  }, [
    weeklyRows,
    routine,
    classId,
    year,
    scheduledSubjectNames,
    studentGroup,
    studentClassNumber,
    isGroupAware,
  ]);

  // Monthly tab rows: all scheduled/class subjects in order, with this
  // student's monthly result left-joined. Subjects without a result row get
  // empty cells (no marks) so newly added/scheduled subjects still appear.
  const monthlyComputed = useMemo(() => computeMonthlyResultSummary({
    resultSubjects: subjectRows as any,
    classSubjects: classSubjects as any,
    group: studentGroup,
    classNumber: studentClassNumber,
    fallbackTotalMarks: activeMonthly?.totalMarks,
  }), [subjectRows, classSubjects, studentGroup, studentClassNumber, activeMonthly?.totalMarks]);

  const monthlySubjectRows = useMemo<MonthlySubjectRow[]>(() => {
    return monthlyComputed.rows.map((r) => ({
      id: r.id,
      subjectName: r.subjectName,
      marks: r.marks,
      fullMarks: r.fullMarks,
      highestMark: r.highestMark,
      point: r.point,
      grade: r.grade,
      displayLabel: r.displayLabel,
    }));
  }, [monthlyComputed]);

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
    monthlySummary: { obtained: monthlyComputed.obtained, full: monthlyComputed.full, gpa: monthlyComputed.gpa, grade: monthlyComputed.grade },
    weeklySummary,
    studentInfo,
    displayMeritPosition,
    displayMonthlyPosition,
  };
}
