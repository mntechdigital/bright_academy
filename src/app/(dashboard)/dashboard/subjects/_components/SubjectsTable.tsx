"use client";

import React from "react";
import { Search, Plus, Edit2, HelpCircle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteSubjectDialog from "./DeleteSubjectDialog";
import { useState } from "react";

interface Subject {
  id: string;
  subjectName: string;
  classId: string;
  stdClass: {
    id: string;
    className: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface GroupedClass {
  classId: string;
  className: string;
  subjects: Subject[];
  createdAt: string;
}

const SubjectsTable = ({ subjectsData = [] }: { subjectsData?: Subject[] }) => {
  const router = useRouter();
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    router.push(
      `/dashboard/subjects?search=${encodeURIComponent(search)}&page=1`,
    );
  };

  // Group subjects by class
  const groupedByClass = subjectsData.reduce<Record<string, GroupedClass>>(
    (acc, subject) => {
      const classId = subject.classId;
      if (!acc[classId]) {
        acc[classId] = {
          classId,
          className: subject.stdClass?.className || "N/A",
          subjects: [],
          createdAt: subject.createdAt,
        };
      }
      acc[classId].subjects.push(subject);
      return acc;
    },
    {},
  );

  const groupedData = Object.values(groupedByClass).sort((a, b) => {
    const numA = parseInt(a.className.replace(/\D/g, "")) || 0;
    const numB = parseInt(b.className.replace(/\D/g, "")) || 0;
    return numA - numB;
  });

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
            <form onSubmit={handleSearch} className="w-full md:w-1/3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search for subjects"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base placeholder:text-gray-400"
                />
              </div>
            </form>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-2/3 md:justify-end">
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
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 lg:px-12 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Class Name
                    <HelpCircle className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Subjects
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groupedData.length > 0 ? (
                groupedData.map((cls) => (
                  <tr
                    key={cls.classId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 lg:px-12 py-6 text-gray-700 font-medium whitespace-nowrap text-base">
                      {cls.className}
                    </td>
                    <td className="px-6 py-6 text-gray-600 text-base">
                      <div className="flex flex-wrap gap-2">
                        {cls?.subjects?.map((subject) => (
                          <span
                            key={subject.id}
                            className="group inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-medium"
                          >
                            {subject.subjectName}
                            <Link
                              href={`/dashboard/subjects/edit/${subject.id}`}
                              className="hidden group-hover:inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-orange-200 transition-colors"
                              onMouseEnter={() => setHoveredSubject(subject.id)}
                              onMouseLeave={() => setHoveredSubject(null)}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Link>
                            <DeleteSubjectDialog
                              id={subject.id}
                              trigger={
                                <button className="hidden group-hover:inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-orange-200 transition-colors">
                                  <X className="w-3 h-3" />
                                </button>
                              }
                            />
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500 text-base"
                  >
                    No subjects found
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
