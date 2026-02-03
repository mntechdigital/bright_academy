"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Edit2, HelpCircle } from "lucide-react";
import Link from "next/link";
import DeleteSubjectDialog from "./DeleteSubjectDialog";

const SubjectsTable = ({ subjectsData = [] }: { subjectsData?: any[] }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClasses = subjectsData.filter((cls) =>
    cls.className.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get maximum number of subjects across all classes for column headers
  const maxSubjects = Math.max(
    ...subjectsData.map((cls) => cls.subjects?.length || 0),
    6,
  );

  return (
    <div className="">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold text-gray-900">Subjects</h1>
            <span className="text-orange-500 font-medium bg-orange-100 px-2 py-1 rounded-full text-md">
              Bright Academy
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-6 my-6">
            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for subjects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base placeholder:text-gray-400"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-2/3 md:justify-end">
              <Link
                href="/dashboard/sections/create"
                className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap text-base font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Create Section</span>
              </Link>
              <Link
                href="/dashboard/subjects/create"
                className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap text-base font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Create Subject</span>
              </Link>
              <Link
                href="/dashboard/classes/create"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap text-base font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Create Class</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 lg:px-12 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Class Name
                    <HelpCircle className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </th>
                {[...Array(Math.min(maxSubjects, 6))].map((_, index) => (
                  <th
                    key={index}
                    className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap"
                  >
                    Subject
                  </th>
                ))}
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <tr
                    key={cls._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 lg:px-12 py-6 text-gray-700 font-medium whitespace-nowrap text-base">
                      {cls.className || "N/A"}
                    </td>
                    {[...Array(Math.min(maxSubjects, 6))].map((_, index) => (
                      <td
                        key={index}
                        className="px-6 py-6 text-gray-600 whitespace-nowrap text-base"
                      >
                        {cls.subjects?.[index]?.subjectName || "Social Science"}
                      </td>
                    ))}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <DeleteSubjectDialog id={cls._id} />
                        <Link
                          href={`/dashboard/subjects/edit/${cls._id}`}
                          className="text-orange-500 hover:text-orange-600 transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={Math.min(maxSubjects, 6) + 2}
                    className="px-6 py-12 text-center text-gray-500 text-base"
                  >
                    No classes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubjectsTable;
