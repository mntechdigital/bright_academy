"use client";

import React from "react";
import { Search, Plus, Edit2, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteStudentDialog from "./DeleteStudentDialog";

interface Student {
  name: string;
  id: string;
  studentName: string;
  parentPhone: string;
  address: string;
  gender: string;
  classId: string;
  sectionId: string;
  stdClass?: {
    id: string;
    className: string;
  };
  section?: {
    id: string;
    sectionName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface StudentManagementProps {
  studentsData?: Student[];
  classesData?: any[];
}

const StudentManagement = ({ studentsData = [], classesData = [] }: StudentManagementProps) => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    router.push(`/dashboard/students?search=${encodeURIComponent(search)}&page=1`);
  };

  return (
    <div className="">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold text-gray-900">Students</h1>
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
                  placeholder="Search for students"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base placeholder:text-gray-400"
                />
              </div>
            </form>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-2/3 md:justify-end">
              <Link
                href="/dashboard/classes"
                className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap text-base font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Manage Classes</span>
              </Link>
              <Link
                href="/dashboard/students/create"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap text-base font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Add Student</span>
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
                    Student Name
                    <HelpCircle className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Class
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Section
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Parent Phone
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Gender
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {studentsData.length > 0 ? (
                studentsData.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 lg:px-12 py-6 text-gray-700 font-medium whitespace-nowrap text-base">
                      {student.name || "N/A"}
                    </td>
                    <td className="px-6 py-6 text-gray-600 whitespace-nowrap text-base">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                        {student.stdClass?.className || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-gray-600 whitespace-nowrap text-base">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-green-600 rounded-lg text-sm font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {student.section?.sectionName || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-gray-600 whitespace-nowrap text-base">
                      {student.parentPhone || "N/A"}
                    </td>
                    <td className="px-6 py-6 text-gray-600 whitespace-nowrap text-base">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        student.gender === "Male" 
                          ? "bg-purple-50 text-purple-600" 
                          : "bg-pink-50 text-pink-600"
                      }`}>
                        {student.gender || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <DeleteStudentDialog id={student.id} />
                        <Link
                          href={`/dashboard/students/edit/${student.id}`}
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
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 text-base"
                  >
                    No students found
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

export default StudentManagement;
