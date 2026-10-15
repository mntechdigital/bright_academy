"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Copy,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import DeleteRoutineDialog from "./DeleteRoutineDialog";
import DuplicateRoutineDialog from "./DuplicateRoutineDialog";
import ViewRoutineDialog from "./ViewRoutineDialog";
import {
  ClassOption,
  ExamRoutineRow,
} from "./routine.types";

interface RoutineTableProps {
  routinesData?: ExamRoutineRow[];
  classesData?: ClassOption[];
  activeYear?: string;
  activeClassId?: string;
}

const RoutineTable = ({
  routinesData = [],
  classesData = [],
  activeYear = "",
  activeClassId = "",
}: RoutineTableProps) => {
  const router = useRouter();
  const [yearInput, setYearInput] = React.useState(activeYear);
  const [classInput, setClassInput] = React.useState(activeClassId);
  const [viewId, setViewId] = React.useState<string | null>(null);
  const [duplicateTarget, setDuplicateTarget] =
    React.useState<ExamRoutineRow | null>(null);

  const applyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (yearInput.trim()) params.set("year", yearInput.trim());
    if (classInput) params.set("classId", classInput);
    const query = params.toString();
    router.push(query ? `/dashboard/routine?${query}` : "/dashboard/routine");
  };

  const clearFilters = () => {
    setYearInput("");
    setClassInput("");
    router.push("/dashboard/routine");
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold text-gray-900">Routine</h1>
            <span className="text-orange-500 font-medium bg-orange-100 px-2 py-1 rounded-full text-md">
              Bright Academy
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-4 my-6">
            {/* Filters */}
            <form
              onSubmit={applyFilters}
              className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:flex-1"
            >
              <div className="relative w-full sm:w-40">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  placeholder="Year (e.g. 2026)"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base placeholder:text-gray-400"
                />
              </div>
              <div className="w-full sm:w-56">
                <select
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-base text-gray-700 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Classes</option>
                  {classesData.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-5 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap text-base font-medium"
                >
                  Filter
                </button>
                {(activeYear || activeClassId) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap text-base font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
            <div className="flex md:justify-end">
              <Link
                href="/dashboard/routine/create"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap text-base font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Create Routine</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Class
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Exam Name
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Year
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Weeks
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-5 text-right text-base font-medium text-gray-600 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {routinesData.length > 0 ? (
                routinesData.map((routine) => {
                  const hasMismatch = routine.weeks.some(
                    (week) => week.marksMismatch
                  );
                  return (
                    <tr
                      key={routine.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-5 text-gray-700 font-medium whitespace-nowrap text-base">
                        {routine.stdClass?.className || "N/A"}
                      </td>
                      <td className="px-6 py-5 text-gray-600 text-base">
                        {routine.examName}
                      </td>
                      <td className="px-6 py-5 text-gray-600 text-base whitespace-nowrap">
                        {routine.year}
                      </td>
                      <td className="px-6 py-5 text-gray-600 text-base whitespace-nowrap">
                        {routine.weeks.length}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {hasMismatch ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-sm font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Marks mismatch
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            title="View"
                            onClick={() => setViewId(routine.id)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:text-orange-600 hover:border-orange-300 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link
                            title="Edit"
                            href={`/dashboard/routine/edit/${routine.id}`}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:text-orange-600 hover:border-orange-300 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            title="Duplicate"
                            onClick={() => setDuplicateTarget(routine)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:text-orange-600 hover:border-orange-300 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <DeleteRoutineDialog
                            routine={routine}
                            trigger={
                              <button
                                type="button"
                                title="Delete"
                                className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-300 transition-colors"
                              >
                                <span className="sr-only">Delete</span>
                                <Trash2 className="w-4 h-4" />
                              </button>
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 text-base"
                  >
                    No routines found. Adjust the filters or create a new
                    routine.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ViewRoutineDialog routineId={viewId} onClose={() => setViewId(null)} />
      <DuplicateRoutineDialog
        routine={duplicateTarget}
        classesData={classesData}
        onClose={() => setDuplicateTarget(null)}
      />
    </div>
  );
};

export default RoutineTable;
