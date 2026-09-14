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
import { getStudentFromCookie } from "./utils";

export function useStudentResults() {
  const [resultData, setResultData] = useState<ApiResponse | null>(null);
  const [meritPosition, setMeritPosition] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"monthly" | "weekly">("monthly");

  // Filter state
  const [month, setMonth] = useState("January");
  const [week, setWeek] = useState("Week 1");
  const [publishedDate, setPublishedDate] = useState("");
  const [year, setYear] = useState("2026");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMyResults();
        setResultData(res);

        // Seed filters from first record
        const mr = res?.data?.monthlyResults?.[0];
        const wm = res?.data?.weeklyMarks?.[0];
        if (mr?.month) setMonth(mr.month);
        if (wm?.week) setWeek(wm.week);
        if (wm?.year) setYear(wm.year);

        // Fetch merit position
        try {
          // Get student info from cookie
          const studentInfoCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("studentInfo="));

          let studentId = "";
          let classId = "";

          if (studentInfoCookie) {
            try {
              const cookieParts = studentInfoCookie.split("=");
              if (cookieParts.length >= 2 && cookieParts[1]) {
                const decoded = decodeURIComponent(cookieParts[1]);
                const info = JSON.parse(decoded);
                studentId = info?.id || info?.stdRegNo || "";
                classId = info?.stdClass?.id || info?.className?.match(/\d+/)?.[0] || "";
              }
            } catch (e) {
              console.error("Error parsing student info cookie:", e);
            }
          }

          // Get week, month, year from weekly marks or use defaults
          const wm = res?.data?.weeklyMarks?.[0];
          const week = wm?.week || "Week 1";
          const month = wm?.month || "January";
          const year = wm?.year || "2026";

          const meritRes = await getMeritPosition({
            studentId,
            classId,
            week,
            month,
            year,
          });

          console.log("Merit position API response for weekly:", meritRes);
          if (meritRes?.success && meritRes?.data) {
            const position = meritRes.data.position || meritRes.data.meritPosition;
            if (position) {
              setMeritPosition(String(position));
            }
          }
        } catch (error) {
          console.error("Error fetching merit position:", error);
        }
      } catch {
        setError("ফলাফল লোড করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const monthlyResults = resultData?.data?.monthlyResults ?? [];
  const weeklyMarks = resultData?.data?.weeklyMarks ?? [];

  const activeMonthly = monthlyResults[0];
  const subjectRows: SubjectResult[] = activeMonthly?.results ?? [];

  const weeklyRows = weeklyMarks;

  const allMonths = [...new Set(monthlyResults.map((r) => r.month))];
  const allWeeks = [...new Set(weeklyMarks.map((r) => r.week))];
  const allYears = [...new Set(weeklyMarks.map((r) => r.year))];

  const months = allMonths.length
    ? allMonths
    : [
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
  const weeks = allWeeks.length
    ? allWeeks
    : ["Week 1", "Week 2", "Week 3", "Week 4"];
  const years = allYears.length ? allYears : ["2025", "2026"];

  const noData = monthlyResults.length === 0 && weeklyMarks.length === 0;

  // ── Weekly computed data ─────────────────────────────────────────────────
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

  // ── Student info from cookie ─────────────────────────────────────────────
  const studentInfo = useMemo(() => getStudentFromCookie(), []);

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
    week,
    setWeek,
    publishedDate,
    setPublishedDate,
    year,
    setYear,
    months,
    weeks,
    years,
    noData,
    monthlyResults,
    weeklyMarks,
    weeklyRows,
    activeMonthly,
    subjectRows,
    weeklySummary,
    studentInfo,
    displayMeritPosition,
    displayMonthlyPosition,
  };
}