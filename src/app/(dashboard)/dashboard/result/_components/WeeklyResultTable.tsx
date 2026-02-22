"use client";
import React from "react";
import { getWeeklyResults } from "@/src/services/weeklyResult";
import DeleteWeeklyResultDialog from "./DeleteWeeklyResultDialog";

interface WeeklyResult {
  id: string;
  month: string;
  week: string;
  publishedDate: string;
  year: string;
  totalMarks: number;
  stdClass?: { className: string };
  section?: { sectionName: string };
  subject?: { subjectName: string };
}

const WeeklyResultTable = ({
  weeklyResults,
}: {
  weeklyResults: WeeklyResult[];
}) => {
  const results = weeklyResults;
  // console.log("see weeklyresult data==>", results);

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 mt-6">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
              Month
            </th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
              Week
            </th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
              Year
            </th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
              Published Date
            </th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
              Class
            </th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
              Section
            </th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
              Subject
            </th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
              Total Marks
            </th>
            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {results.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="text-center py-6 text-gray-500 text-base"
              >
                No results found.
              </td>
            </tr>
          ) : (
            results.map((result) => (
              <tr
                key={result.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6 text-gray-700 text-sm">
                  {result.month}
                </td>
                <td className="py-4 px-6 text-gray-700 text-sm">
                  {result.week}
                </td>
                <td className="py-4 px-6 text-gray-700 text-sm">
                  {result.year}
                </td>
                <td className="py-4 px-6 text-gray-700 text-sm">
                  {new Date(result.publishedDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-gray-700 text-sm">
                  {result.stdClass?.className || "-"}
                </td>
                <td className="py-4 px-6 text-gray-700 text-sm">
                  {result.section?.sectionName || "-"}
                </td>
                <td className="py-4 px-6 text-gray-700 text-sm">
                  {result.subject?.subjectName || "-"}
                </td>
                <td className="py-4 px-6 text-gray-700 text-sm font-semibold">
                  {result.totalMarks}
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <DeleteWeeklyResultDialog id={result.id} />
                    {/* <Link
                      href={`/dashboard/results/edit/${result.id}`}
                      className="text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link> */}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyResultTable;
