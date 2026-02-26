"use client";
import Link from "next/link";
import React, { useState } from "react";

const GradeIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <rect x="4" y="3" width="16" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6M9 11h6M9 15h4" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PencilIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

// ---- Types ----
interface ResultSubject {
  id: string;
  subjectName: string;
  marks: number;
  fullMarks: number;
  highestMark: number;
}

interface Student {
  id: string;
  name: string;
  classId: string;
  sectionId: string;
  parentPhone: string;
  avatar?: string;
  username?: string;
  section?: { id: string; sectionName: string; createdAt: string; updatedAt: string };
}

export interface MonthlyResult {
  id: string;
  studentId: string;
  student: Student;
  results: ResultSubject[];
  totalMarks: number;
  gpa: number;
  grade: string;
  position: string;
  present: number;
  absent: number;
  subjectId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Section {
  id: string;
  sectionName: string;
  createdAt: string;
  updatedAt: string;
}

interface ClassData {
  id: string;
  className: string;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
  students?: any[];
  subjects?: any[];
  _count?: { students: number };
}

interface Props {
  monthlyResultsData: MonthlyResult[];
  classesData: ClassData[];
}

export default function ShowMonthlyResultTable({ monthlyResultsData = [], classesData = [] }: Props) {
  const [checkedAll, setCheckedAll] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [search, setSearch] = useState("");

  const toggleAll = () => {
    const next = !checkedAll;
    setCheckedAll(next);
    const newChecked: Record<string, boolean> = {};
    monthlyResultsData.forEach((r) => (newChecked[r.id] = next));
    setChecked(newChecked);
  };

  const toggleOne = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getAchievedMarks = (results: ResultSubject[]) =>
    results.reduce((sum, r) => sum + r.marks, 0);

  const getFullMarks = (results: ResultSubject[], fallback: number) =>
    results.length > 0 ? results.reduce((sum, r) => sum + r.fullMarks, 0) : fallback;

  // Sections for the selected class
  const availableSections =
    classesData.find((c) => c.id === selectedClassId)?.sections ?? [];

  // Handle class change — reset section when class changes
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClassId(e.target.value);
    setSelectedSectionId("");
  };

  // Filter table rows
  const filteredResults = monthlyResultsData.filter((result) => {
    const matchesSearch = search
      ? result.student?.name?.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesClass = selectedClassId
      ? result.student?.classId === selectedClassId
      : true;
    const matchesSection = selectedSectionId
      ? result.student?.sectionId === selectedSectionId
      : true;
    return matchesSearch && matchesClass && matchesSection;
  });

  const selectedClassName = classesData.find((c) => c.id === selectedClassId)?.className;

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-5">
        <h1 className="text-xl font-bold text-gray-900">Result</h1>
        {selectedClassName && (
          <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-0.5 rounded-full">
            {selectedClassName}
          </span>
        )}
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-52">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search for students"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm text-gray-700 bg-transparent outline-none w-full placeholder-gray-400"
            />
          </div>

          {/* Select Class */}
          <select
            value={selectedClassId}
            onChange={handleClassChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white cursor-pointer outline-none min-w-32.5"
          >
            <option value="">Select Class</option>
            {classesData.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className}
              </option>
            ))}
          </select>

          {/* Select Section — only show sections of selected class */}
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            disabled={!selectedClassId}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white cursor-pointer outline-none min-w-32.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select Section</option>
            {availableSections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.sectionName}
              </option>
            ))}
          </select>

          {/* Download CSV */}
          <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV
          </button>

          {/* Give Result */}
          <Link
            href="/dashboard/result/give-result"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Give Result
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto whitespace-nowrap">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2.5 text-left w-9">
                  <input
                    type="checkbox"
                    checked={checkedAll}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">Student's Name</th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Student's ID
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Section
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Total Mark
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">Achieved Mark</th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">Grade</th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">GPA</th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">Position</th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-10 text-center text-gray-400 text-sm">
                    No results found.
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => {
                  const achievedMarks = getAchievedMarks(result.results);
                  const fullMarks = getFullMarks(result.results, result.totalMarks);
                  const sectionName = result.student?.section?.sectionName ?? "—";
                  
                  return (
                    <tr key={result.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3.5">
                        <input
                          type="checkbox"
                          checked={!!checked[result.id]}
                          onChange={() => toggleOne(result.id)}
                          className="w-4 h-4 accent-orange-500 cursor-pointer"
                        />
                      </td>

                      {/* Name + Avatar */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div>
                            <p className="font-semibold text-gray-900">{result.student?.name}</p>
                            <p className="text-xs text-gray-400">
                              {result.student?.username ?? result.student?.parentPhone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {result.studentId.slice(0, 8)}
                        </span>
                      </td>

                      {/* Section */}
                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {sectionName}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-gray-700 font-medium">{fullMarks}</td>
                      <td className="px-3 py-3.5 text-gray-700 font-medium">{achievedMarks}</td>

                      {/* Grade */}
                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {result.grade}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-gray-700 font-medium">{result.gpa}</td>
                      <td className="px-3 py-3.5 text-gray-700 font-medium">#{result.position}</td>

                      {/* Actions */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="View Grade">
                            <GradeIcon />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors" title="Delete">
                            <TrashIcon />
                          </button>
                          <Link
                            href={`/dashboard/result/edit/${result.id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-500 hover:bg-purple-100 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}