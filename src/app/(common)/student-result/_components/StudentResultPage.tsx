"use client";

import { useRef } from "react";
import { getStudentGroup } from "@/src/utils/studentGroup";
import { useStudentResults } from "./useStudentResults";
import { usePrintResults } from "./usePrintResults";
import FilterBar from "./FilterBar";
import StudentInfoHeader from "./StudentInfoHeader";
import ResultTabs from "./ResultTabs";
import MonthlyResultsTable from "./MonthlyResultsTable";
import WeeklyResultsTable from "./WeeklyResultsTable";
import PrintButton from "./PrintButton";

// â”€â”€â”€ Main â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function StudentResultsDashboard() {
  const {
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
    overallDisabled,
    overallDisabledReason,
    months,
    years,
    noData,
    filteredEmpty,
    monthlyResults,
    weeklyRows,
    activeMonthly,
    subjectRows,
    monthlySubjectRows,
    weeklySummary,
    studentInfo,
    displayMeritPosition,
    displayMonthlyPosition,
  } = useStudentResults();

  const studentGroup = getStudentGroup(studentInfo?.stdRegNo || "");
  const printRef = useRef<HTMLDivElement>(null);

  // â”€â”€ Print handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const { handlePrint } = usePrintResults({
    printRef,
    activeTab,
    activeMonthly,
    month,
    year,
    studentInfo,
  });

  // â”€â”€ Loading / Error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">à¦«à¦²à¦¾à¦«à¦² à¦²à§‹à¦¡ à¦¹à¦šà§à¦›à§‡...</p>
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

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dark filter bar */}
      <FilterBar
        months={months}
        month={month}
        onMonthChange={setMonth}
        years={years}
        year={year}
        onYearChange={setYear}
      />

      {/* Main content */}
      <div className="flex-1 px-4 py-4 md:px-8 md:py-6 pb-4">
        {/* Student Info Header (weekly merit badge only on the Weekly tab) */}
        <StudentInfoHeader
          studentInfo={studentInfo}
          displayMeritPosition={
            activeTab === "weekly" ? displayMeritPosition : null
          }
          meritWeek={activeTab === "weekly" ? week : null}
          meritLoading={activeTab === "weekly" && meritLoading}
        />

        {/* Tabs */}
        <ResultTabs activeTab={activeTab} onChange={setActiveTab} />

        {noData ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              à¦•à§‹à¦¨à§‹ à¦«à¦²à¦¾à¦«à¦² à¦ªà§à¦°à¦•à¦¾à¦¶à¦¿à¦¤ à¦¹à¦¯à¦¼à¦¨à¦¿
            </h2>
            <p className="text-gray-400 mt-2 text-sm">à¦ªà¦°à§‡ à¦†à¦¬à¦¾à¦° à¦šà§‡à¦• à¦•à¦°à§à¦¨à¥¤</p>
          </div>
        ) : filteredEmpty ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              No result found for this month
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Try a different month or year.
            </p>
          </div>
        ) : (
          <div
            ref={printRef}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* â”€â”€ MONTHLY TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {activeTab === "monthly" && (
              <MonthlyResultsTable
                monthlyResults={monthlyResults}
                activeMonthly={activeMonthly}
                subjectRows={monthlySubjectRows}
                displayMonthlyPosition={displayMonthlyPosition}
                group={studentGroup}
                classNumber={studentInfo?.className}
              />
            )}

            {/* â”€â”€ WEEKLY TAB â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {activeTab === "weekly" && (
              <WeeklyResultsTable
                weeklyRows={weeklyRows}
                weeklySummary={weeklySummary}
                displayMeritPosition={displayMeritPosition}
                meritWeek={week}
                onMeritWeekChange={setWeek}
                weeksWithData={weeksWithData}
                overallDisabled={overallDisabled}
                overallDisabledReason={overallDisabledReason}
                meritError={meritError}
                group={studentGroup}
                classNumber={studentInfo?.className}
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
