import { getGradeFromMarks } from "@/src/utils/gradeUtils";
import GradeBadge from "./GradeBadge";
import type { WeeklyMark, WeeklySummaryData } from "./types";

// ─── Weekly Tab ───────────────────────────────────────────────────────────────

function WeeklyResultsTable({
  weeklyRows,
  weeklySummary,
  displayMeritPosition,
}: {
  weeklyRows: WeeklyMark[];
  weeklySummary: WeeklySummaryData;
  displayMeritPosition: string | null;
}) {
  return (
    <>
      {weeklyRows.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-sm">
          কোনো সাপ্তাহিক মার্ক পাওয়া যায়নি।
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="py-3 px-6 text-left font-medium text-gray-400">
                  Subject
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                  Week-1
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                  Week-2
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                  Week-3
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                  Week-4
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                  Average Point
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                  Total Marks
                </th>
              </tr>
            </thead>
             <tbody>
               {weeklySummary.subjectArray.map((subjectData, i) => {
                 // Calculate average point and overall grade for this subject
                 const points: number[] = [];
                 [1, 2, 3, 4].forEach((weekNum) => {
                   const weekData = subjectData.weeks.get(String(weekNum));
                   if (weekData && weekData.obtained !== null && weekData.obtained !== undefined) {
                     // Use the actual total marks to determine grading system
                     const gradeResult = getGradeFromMarks(weekData.obtained, weekData.total);
                     points.push(gradeResult.gradePoint);
                   }
                 });

                // Calculate total marks obtained for this subject across all weeks
                let subjectTotalObtained = 0;
                let subjectTotalFull = 0;
                [1, 2, 3, 4].forEach((weekNum) => {
                  const weekData = subjectData.weeks.get(String(weekNum));
                  if (weekData && weekData.obtained !== null && weekData.obtained !== undefined) {
                    subjectTotalObtained += weekData.obtained;
                    subjectTotalFull += weekData.total;
                  }
                });

                const averagePoint = points.length > 0
                  ? points.reduce((sum, p) => sum + p, 0) / points.length
                  : 0;

                return (
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {subjectData.subjectName}
                    </td>
                    {[1, 2, 3, 4].map((weekNum) => {
                      const weekData = subjectData.weeks.get(String(weekNum));
                      // Highlight Week-2 and Week-4 columns regardless of
                      // whether data exists for them (matches the monthly
                      // table's fixed-column highlight pattern).
                      const isHighlighted = weekNum === 2 || weekNum === 4;
                      return (
                        <td
                          key={weekNum}
                          className={`py-4 px-4 text-center ${isHighlighted ? "bg-slate-100" : ""}`}
                        >
                          {weekData ? (
                            <div className="flex flex-col items-center">
                              <span className="font-semibold text-gray-800">
                                {weekData.obtained}
                              </span>
                              <span className="text-xs text-gray-400">
                                / {weekData.total}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-300"></span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-4 px-4 text-center font-bold text-gray-800">
                      {averagePoint > 0 ? averagePoint.toFixed(1) : "-"}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-gray-800">
                      {subjectTotalObtained > 0 ? `${subjectTotalObtained} / ${subjectTotalFull}` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Weekly Exam Summary */}
          {weeklySummary.subjectArray.length > 0 && (
            <div className="px-6 pt-6 pb-8 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-800 text-center mb-5">
                Exam Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {(
                        [
                          ["Total Marks"],
                          ["GPA"],
                          ["Grade"],
                          ["Merit Position"],
                          ["Present"],
                          ["Absent"],
                        ] as [string][]
                      ).map(([label]) => (
                        <th
                          key={label}
                          className="py-2 px-4 text-center font-medium text-gray-400 whitespace-nowrap"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4 px-4 text-center font-bold text-gray-800 text-base">
                        {`${weeklySummary.totalObtainedMarks} / ${weeklySummary.totalFullMarks}`}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-gray-800 text-base">
                        {weeklySummary.overallGPA > 0 ? weeklySummary.overallGPA.toFixed(2) : "-"}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {weeklySummary.overallGrade !== "F" ? (
                          <GradeBadge grade={weeklySummary.overallGrade} />
                        ) : (
                          <span className="text-gray-300"></span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-orange-600 text-base">
                        {displayMeritPosition || "-"}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-gray-800 text-base">
                        {weeklySummary.present}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-gray-800 text-base">
                        {weeklySummary.absent}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default WeeklyResultsTable;