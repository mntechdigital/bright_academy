"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Lock } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  regNo: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TeacherTableProps {
  teacherData?: Teacher[];
}

const TeacherTable = ({ teacherData = [] }: TeacherTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter teachers based on search query
  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return teacherData;
    return teacherData.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.regNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teacherData, searchQuery]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-lg font-semibold text-gray-900">Teacher</span>
        <span className="text-lg font-semibold text-orange-500">
          Bright Academy
        </span>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for teachers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="col-span-6">
            <h3 className="text-sm font-semibold text-gray-700">
              Teacher&apos;s Name
            </h3>
          </div>
          <div className="col-span-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Teacher&apos;s ID
            </h3>
          </div>
          <div className="col-span-3 text-right">
            <h3 className="text-sm font-semibold text-gray-700">
              Action
            </h3>
          </div>
        </div>

        {/* Teachers Rows */}
        <div className="divide-y divide-gray-100">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-6 flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {teacher.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      @{teacher.name.toLowerCase().replace(/\s+/g, "")}
                    </p>
                  </div>
                </div>
                <div className="col-span-3 flex items-center">
                  <span className="text-sm font-medium text-blue-600">
                    {teacher.regNo}
                  </span>
                </div>
                <div className="col-span-3 flex items-center justify-end">
                  <Link
                    href={`/dashboard/teachers/edit/${teacher.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors group"
                  >
                    <Lock size={16} className="group-hover:rotate-12 transition-transform" />
                    <span className="text-xs font-medium">Change Password</span>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-gray-500">No teachers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      {filteredTeachers.length > 0 && (
        <p className="mt-4 text-xs text-gray-500">
          Showing {filteredTeachers.length} of {teacherData.length} teachers
        </p>
      )}
    </div>
  );
};

export default TeacherTable;
