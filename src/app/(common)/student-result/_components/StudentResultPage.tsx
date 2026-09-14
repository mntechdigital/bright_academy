"use client";

import { useRef } from "react";
import { useStudentResults } from "./useStudentResults";
import { usePrintResults } from "./usePrintResults";
import FilterBar from "./FilterBar";
import StudentInfoHeader from "./StudentInfoHeader";
import ResultTabs from "./ResultTabs";
import MonthlyResultsTable from "./MonthlyResultsTable";
import WeeklyResultsTable from "./WeeklyResultsTable";
import PrintButton from "./PrintButton";

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function StudentResultsDashboard() {
  const {
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
    weeklyRows,
    activeMonthly,
    subjectRows,
    weeklySummary,
    studentInfo,
    displayMeritPosition,
    displayMonthlyPosition,
  } = useStudentResults();

  const printRef = useRef<HTMLDivElement>(null);

  // ── Print handler ─────────────────────────────────────────────────────────
  const { handlePrint } = usePrintResults({
    printRef,
    activeTab,
    activeMonthly,
    month,
    year,
    studentInfo,
  });

  // ── Loading / Error ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">ফলাফল লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-sm shadow-sm">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dark filter bar */}
      <FilterBar
        months={months}
        month={month}
        onMonthChange={setMonth}
        weeks={weeks}
        week={week}
        onWeekChange={setWeek}
        publishedDate={publishedDate}
        onPublishedDateChange={setPublishedDate}
        years={years}
        year={year}
        onYearChange={setYear}
      />

      {/* Main content */}
      <div className="flex-1 px-4 py-4 md:px-8 md:py-6 pb-4">
        {/* Student Info Header */}
        <StudentInfoHeader
          studentInfo={studentInfo}
          displayMeritPosition={displayMeritPosition}
        />

        {/* Tabs */}
        <ResultTabs activeTab={activeTab} onChange={setActiveTab} />

        {noData ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              কোনো ফলাফল প্রকাশিত হয়নি
            </h2>
            <p className="text-gray-400 mt-2 text-sm">পরে আবার চেক করুন।</p>
          </div>
        ) : (
          <div
            ref={printRef}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* ── MONTHLY TAB ──────────────────────────────────────────── */}
            {activeTab === "monthly" && (
              <MonthlyResultsTable
                monthlyResults={monthlyResults}
                activeMonthly={activeMonthly}
                subjectRows={subjectRows}
                displayMonthlyPosition={displayMonthlyPosition}
              />
            )}

            {/* ── WEEKLY TAB ───────────────────────────────────────────── */}
            {activeTab === "weekly" && (
              <WeeklyResultsTable
                weeklyRows={weeklyRows}
                weeklySummary={weeklySummary}
                displayMeritPosition={displayMeritPosition}
              />
            )}
          </div>
        )}
      </div>

      {/* Sticky Print button */}
      <PrintButton onClick={handlePrint} />
    </div>
  );
}