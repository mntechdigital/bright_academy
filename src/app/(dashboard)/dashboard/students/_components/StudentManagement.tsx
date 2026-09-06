"use client";

import React from "react";
import { Search, Plus, Edit2, HelpCircle, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DeleteStudentDialog from "./DeleteStudentDialog";

interface Student {
  name: string;
  id: string;
  studentName: string;
  parentPhone: string;
  address: string;
  gender: string;
  classId: string;
  batch?: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    classId: string;
    createdAt: string;
    updatedAt: string;
  };
  stdClass?: {
    id: string;
    className: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface StudentManagementProps {
  studentsData?: Student[];
  classesData?: any[];
  totalStudents?: number;
}

const StudentManagement = ({ studentsData = [], classesData = [], totalStudents = 0 }: StudentManagementProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const selectedClass = searchParams.get("class") || searchParams.get("classId") || "";
  const selectedBatch = searchParams.get("batch") || searchParams.get("batchId") || "";
  const selectedGender = searchParams.get("gender") || "All";

  const selectedClassObj = classesData.find(
    (c) => c.id === selectedClass || c.className === selectedClass
  );
  const availableBatches: { id: string; name: string }[] = selectedClassObj?.batches
    ? selectedClassObj.batches
    : classesData.flatMap((c) => c.batches ?? []);
  const uniqueBatches = Array.from(new Map(availableBatches.map((b: any) => [b.name, b])).values());

  const updateFilters = (next: { class?: string; batch?: string; gender?: string; search?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    const apply = (key: string, value: string | undefined) => {
      if (value && value !== "All" && value !== "") params.set(key, value);
      else params.delete(key);
      if (key === "class") params.delete("classId");
      if (key === "batch") params.delete("batchId");
    };
    if ("class" in next) apply("class", next.class);
    if ("batch" in next) apply("batch", next.batch);
    if ("gender" in next) apply("gender", next.gender);
    if ("search" in next) {
      if (next.search && next.search.trim() !== "") params.set("search", next.search);
      else params.delete("search");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = (formData.get("search") as string) || "";
    updateFilters({ search });
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ class: e.target.value, batch: "" });
  };
  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ batch: e.target.value });
  };
  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ gender: e.target.value });
  };

  const hasActiveFilters = !!(selectedClass || selectedBatch || (selectedGender && selectedGender !== "All"));

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("class");
    params.delete("classId");
    params.delete("batch");
    params.delete("batchId");
    params.delete("gender");
    params.set("page", "1");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const isHighlighted = (studentName: string) => {
    if (!currentSearch) return false;
    return studentName.toLowerCase().includes(currentSearch.toLowerCase());
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
            {/* Total reflects filtered count from paginated API meta.totalItems */}
            <span className="ml-auto text-lg text-gray-600">
              Total Students: <strong>{totalStudents}</strong>
            </span>
          </div>

          {/* Toolbar: filter/search group (left, wraps as one unit) vs actions (right) */}
          {/* Outer: justify-between separates filter group from CTA buttons; wraps to two rows when space is tight */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            {/* LEFT — Search + 3 dropdowns + Clear inline as ONE flex-wrap group */}
            {/* Consistent gap-3 between all elements, wraps cleanly on small screens */}
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
              {/* Search — w-full on mobile (own line), 300px fixed + inline with filters on sm+ */}
              <form onSubmit={handleSearch} className="w-full sm:w-[300px] shrink-0">
                <div className="relative h-11">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    key={currentSearch}
                    type="text"
                    name="search"
                    defaultValue={currentSearch}
                    placeholder="Search for students"
                    className="h-11 w-full pl-10 pr-4 border border-gray-200 rounded-lg bg-white text-sm text-slate-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </form>

              {/* Class — value is classId (uuid) for backend filter compatibility */}
              <div className="relative shrink-0">
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="h-11 appearance-none border border-gray-200 rounded-lg bg-white pl-4 pr-9 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer min-w-[150px]"
                >
                  <option value="">All Classes</option>
                  {classesData.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.className}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Batch — options scoped to selected class, value is batchId */}
              <div className="relative shrink-0">
                <select
                  value={selectedBatch}
                  onChange={handleBatchChange}
                  className="h-11 appearance-none border border-gray-200 rounded-lg bg-white pl-4 pr-9 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer min-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All Batches</option>
                  {uniqueBatches.map((batch: any) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Gender */}
              <div className="relative shrink-0">
                <select
                  value={selectedGender}
                  onChange={handleGenderChange}
                  className="h-11 appearance-none border border-gray-200 rounded-lg bg-white pl-4 pr-9 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer min-w-[150px]"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Clear filters — inline end of same row, ghost style, only when active */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="h-11 inline-flex items-center gap-1.5 px-4 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors whitespace-nowrap shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear filters
                </button>
              )}
            </div>

            {/* RIGHT — Action buttons visually separated from filter group */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/dashboard/classes"
                className="h-11 inline-flex items-center justify-center gap-2 px-5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium text-slate-700 transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Manage Classes</span>
              </Link>
              <Link
                href="/dashboard/students/create"
                className="h-11 inline-flex items-center justify-center gap-2 px-5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium whitespace-nowrap shadow-sm"
              >
                <Plus className="w-4 h-4" />
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
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">Class</th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">Batch</th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">Parent Phone</th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">Gender</th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {studentsData.length > 0 ? (
                studentsData.map((student) => (
                  <tr
                    key={student.id}
                    className={`transition-colors ${isHighlighted(student.name || student.studentName || "") ? "bg-yellow-100 border-l-4 border-yellow-500 font-semibold" : "hover:bg-gray-50"}`}
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
                        {student.batch?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-gray-600 whitespace-nowrap text-base">{student.parentPhone || "N/A"}</td>
                    <td className="px-6 py-6 text-gray-600 whitespace-nowrap text-base">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${student.gender === "Male" ? "bg-purple-50 text-purple-600" : "bg-pink-50 text-pink-600"}`}>
                        {student.gender || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <DeleteStudentDialog id={student.id} />
                        <Link href={`/dashboard/students/edit/${student.id}`} className="text-orange-500 hover:text-orange-600 transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-base">
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
