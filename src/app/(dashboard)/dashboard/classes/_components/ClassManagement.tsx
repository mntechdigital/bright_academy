"use client";
import React, { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ClassManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const classes = [
    { id: 1, name: "Class 1", sectionA: 50, sectionB: 50 },
    { id: 2, name: "Class 2", sectionA: 34, sectionB: 34 },
    { id: 3, name: "Class 3", sectionA: 45, sectionB: 45 },
    { id: 4, name: "Class 4", sectionA: 45, sectionB: 45 },
    { id: 5, name: "Class 5", sectionA: 43, sectionB: 43 },
    { id: 6, name: "Class 6", sectionA: 53, sectionB: 53 },
    { id: 7, name: "Class 7", sectionA: 67, sectionB: 67 },
    { id: 8, name: "Class 8", sectionA: 89, sectionB: 89 },
    { id: 9, name: "Class 9", sectionA: 89, sectionB: 89 },
    { id: 10, name: "Class 10", sectionA: 76, sectionB: 76 },
  ];

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold text-gray-900">Classes</h1>
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
                placeholder="Search for classes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base placeholder:text-gray-400"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-2/3 md:justify-end">
              <button className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap text-base font-medium">
                <Plus className="w-5 h-5" />
                <span>Create Section</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap text-base font-medium">
                <Plus className="w-5 h-5" />
                <span>Create Subject</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap text-base font-medium">
                <Plus className="w-5 h-5" />
                <span>Create Class</span>
              </button>
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
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Section
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Students
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Section
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Students
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 lg:px-12 py-6 text-gray-700 font-medium whitespace-nowrap text-base">
                    {cls.name}
                  </td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-green-600 rounded-lg text-sm font-medium whitespace-nowrap">
                      <span className="w-2 h-2 bg-green-500 rounded-full shrink-0"></span>
                      A
                    </span>
                  </td>
                  <td className="px-6 py-6 text-gray-700 whitespace-nowrap text-base">
                    {cls.sectionA}
                  </td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-green-600 rounded-lg text-sm font-medium whitespace-nowrap">
                      <span className="w-2 h-2 bg-green-500 rounded-full shrink-0"></span>
                      B
                    </span>
                  </td>
                  <td className="px-6 py-6 text-gray-700 whitespace-nowrap text-base">
                    {cls.sectionB}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <button className="text-orange-500 hover:text-orange-600 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="text-purple-500 hover:text-purple-600 transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium">
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <button className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-orange-500 text-white font-semibold text-base">
                1
              </button>
              <button className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors text-base">
                2
              </button>
              <button className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors text-base">
                3
              </button>
              <span className="px-2 text-gray-400 text-base">...</span>
              <button className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors text-base">
                8
              </button>
              <button className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors text-base">
                9
              </button>
              <button className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors text-base">
                10
              </button>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium">
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassManagement;
