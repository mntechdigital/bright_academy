import { getGroupSubjectLabel } from "@/src/utils/groupSubjects";
import GradeBadge from "./GradeBadge";
import type { MonthlyResult, MonthlySubjectRow } from "./types";

// â”€â”€â”€ Monthly Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function MonthlyResultsTable({
  monthlyResults,
  activeMonthly,
  subjectRows,
  displayMonthlyPosition,
  group = "",
  classNumber,
  summary,
}: {
  monthlyResults: MonthlyResult[];
  activeMonthly: MonthlyResult | undefined;
  subjectRows: MonthlySubjectRow[];
  displayMonthlyPosition: string | null;
  group?: string;
  classNumber?: string | number | null;
  summary?: { obtained: number; full: number; gpa: number; grade: string };
}) {
  const hasFailOrAbsentSubject = subjectRows.some((row) => {
    const isAbsent =
      (row as any).isAbsent === true ||
      (row as any).isAbsent === "true" ||
      (row as any).isAbsent === 1;
    const isGradeF = String(row.grade ?? "").trim().toUpperCase() === "F";
    const isPointZero =
      row.point !== null &&
      row.point !== undefined &&
      Number(row.point) === 0 &&
      row.marks !== null &&
      row.marks !== undefined;
    return isAbsent || isGradeF || isPointZero;
  });

  return (
    <>
      {monthlyResults.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-sm">
          No Result Found
        </div>
      ) : (
        <>
          {/* Subject table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm result-table">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="py-3 px-4 text-left font-medium text-gray-400">
                    Subject
                  </th>
                  <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                    Full Marks
                  </th>
                  <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                    Highest Mark
                  </th>
                  <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                    Marks Obtained
                  </th>
                  <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                    Point
                  </th>
                  <th className="py-3 px-4 text-center font-medium text-gray-400">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjectRows.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-800">

                      {row.displayLabel || getGroupSubjectLabel(row.subjectName, group, classNumber)}

                    </td>
                    <td className="py-4 px-4 text-center text-gray-600 bg-slate-100">
                      {row.fullMarks ?? "-"}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">
                      {row.highestMark ?? "-"}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600 bg-slate-100">
                      {row.marks ?? "-"}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">
                      {row.point ?? "-"}
                    </td>
                    <td className="py-4 px-4 text-center bg-slate-100">
                      {row.grade ? (
                        <GradeBadge grade={row.grade} />
                      ) : (
                        <span className="text-gray-300"></span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Exam Summary */}
          <div className="px-6 pt-6 pb-8 border-t border-gray-100 exam-summary-block">
            <h3 className="text-base font-semibold text-gray-800 text-center mb-5">
              Exam Summary
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm result-table">
                <thead>
                  <tr className="border-b border-gray-100">
                    {(
                      [
                        ["Total Marks"],
                        ["GPA"],
                        ["Grade"],
                        ["Position"],
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
                      {summary ? `${summary.obtained}/${summary.full}` : (activeMonthly?.totalMarks ?? "-")}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-gray-800 text-base">
                      {summary
                        ? (typeof summary.gpa === "number" ? summary.gpa.toFixed(2) : summary.gpa)
                        : (activeMonthly?.gpa !== undefined && activeMonthly?.gpa !== null ? Number(activeMonthly.gpa).toFixed(2) : "-")}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {!hasFailOrAbsentSubject &&
                      (summary ? summary.grade : activeMonthly?.grade) &&
                      String(summary ? summary.grade : activeMonthly?.grade).toUpperCase() !== "F" ? (
                        <GradeBadge grade={(summary ? summary.grade : activeMonthly?.grade) as string} />
                      ) : null}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-orange-600 text-base">
                      {displayMonthlyPosition || "-"}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-gray-800 text-base">
                      {activeMonthly?.present ?? "-"}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-gray-800 text-base">
                      {activeMonthly?.absent ?? "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default MonthlyResultsTable;
