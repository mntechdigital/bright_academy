"use client";
import React, { useState } from "react";

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
  section?: { id: string; sectionName: string };
  stdClass?: { id: string; className: string };
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

interface Props {
  result: MonthlyResult;
}


const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"];

export default function UpdateResultForm({ result }: Props) {
  const [gpa, setGpa] = useState<number>(result.gpa);
  const [grade, setGrade] = useState<string>(result.grade);
  const [position, setPosition] = useState<string>(result.position);
  const [present, setPresent] = useState<number>(result.present);
  const [absent, setAbsent] = useState<number>(result.absent);
  const [subjectResults, setSubjectResults] = useState<ResultSubject[]>(
    result.results.map((r) => ({ ...r }))
  );

  const updateSubjectField = (
    id: string,
    field: "marks" | "highestMark",
    value: number
  ) => {
    setSubjectResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const totalAchieved = subjectResults.reduce((sum, r) => sum + r.marks, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      id: result.id,
      gpa,
      grade,
      position,
      present,
      absent,
      results: subjectResults.map((r) => ({
        id: r.id,
        marks: r.marks,
        highestMark: r.highestMark,
      })),
    });
  };

  const avatarUrl =
    result.student?.avatar ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(result.student?.name ?? "S")}&background=f3f4f6&color=374151`;

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Student Info Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt={result.student?.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
            />
            <div>
              <h2 className="text-base font-bold text-gray-900">{result.student?.name}</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.student?.stdClass?.className && (
                  <span className="text-xs bg-orange-50 text-orange-500 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
                    {result.student.stdClass.className}
                  </span>
                )}
                {result.student?.section?.sectionName && (
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                    Section {result.student.section.sectionName}
                  </span>
                )}
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                  {result.student?.parentPhone}
                </span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-gray-400">Total Marks</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalAchieved}
                <span className="text-sm font-normal text-gray-400">/{result.totalMarks}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Subject Marks */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Subject Results</h3>
          <div className="space-y-3">
            {subjectResults.map((subject) => (
              <div key={subject.id} className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-4">
                  <p className="text-sm font-medium text-gray-800">{subject.subjectName}</p>
                  <p className="text-xs text-gray-400">Full: {subject.fullMarks}</p>
                </div>
                <div className="col-span-4">
                  <label className="text-xs text-gray-500 mb-1 block">Marks Obtained</label>
                  <input
                    type="number"
                    min={0}
                    max={subject.fullMarks}
                    value={subject.marks}
                    onChange={(e) =>
                      updateSubjectField(subject.id, "marks", Number(e.target.value))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
                  />
                </div>
                <div className="col-span-4">
                  <label className="text-xs text-gray-500 mb-1 block">Highest Mark</label>
                  <input
                    type="number"
                    min={0}
                    max={subject.fullMarks}
                    value={subject.highestMark}
                    onChange={(e) =>
                      updateSubjectField(subject.id, "highestMark", Number(e.target.value))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Result Summary</h3>
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition bg-white"
              >
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">GPA</label>
              <input
                type="number"
                step="0.01"
                min={0}
                max={5}
                value={gpa}
                onChange={(e) => setGpa(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Position</label>
              <input
                type="number"
                min={1}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Present Days</label>
              <input
                type="number"
                min={0}
                value={present}
                onChange={(e) => setPresent(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Absent Days</label>
              <input
                type="number"
                min={0}
                value={absent}
                onChange={(e) => setAbsent(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Update Result
          </button>
        </div>

      </form>
    </div>
  );
}