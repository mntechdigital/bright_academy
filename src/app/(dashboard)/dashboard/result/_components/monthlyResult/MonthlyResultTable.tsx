"use client";

import { createMonthlyResult } from "@/src/services/monthlyResult";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { getGroupSubjectLabel } from "@/src/utils/groupSubjects";
import { getGradeFromMarks, calculateGPAFromPoints, getGradeFromGPA } from "@/src/utils/gradeUtils";
import { getStudentGroup } from "@/src/utils/studentGroup";
import { useState, useCallback, useEffect } from "react";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type SubjectRow = {
  name: string;
  fullMarks: string;
  highestMark: string;
  marksObtained: string;
  point: string;
  grade: string;
};

type Summary = {
  totalMarks: string;
  gpa: string;
  grade: string;
  position: string;
  present: string;
  absent: string;
};

// â”€â”€â”€ Initial data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const INITIAL_ROWS: SubjectRow[] = [
  "Bangla First Paper",
  "Bangla Second Paper",
  "English First Paper",
  "English Second Paper",
  "Mathematics",
].map((name) => ({
  name,
  fullMarks: "100",
  highestMark: "",
  marksObtained: "",
  point: "",
  grade: "",
}));

const INITIAL_SUMMARY: Summary = {
  totalMarks: "",
  gpa: "",
  grade: "",
  position: "",
  present: "",
  absent: "",
};

// â”€â”€â”€ Shared input styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const inputBase =
  "rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-center text-sm text-gray-800 placeholder:text-gray-300 outline-none tabular-nums transition-all duration-150 hover:border-gray-300 hover:bg-white focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100";

// â”€â”€â”€ Reusable inputs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  width?: string;
  uppercase?: boolean;
  maxLength?: number;
  readOnly?: boolean;
};

function TextInput({
  value,
  onChange,
  placeholder,
  width = "w-full",
  uppercase = false,
  maxLength,
  readOnly = false,
}: TextInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) =>
        onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)
      }
      placeholder={placeholder}
      maxLength={maxLength}
      readOnly={readOnly}
      className={`${width} ${inputBase} ${uppercase ? "uppercase font-semibold" : ""} ${readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
    />
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface MonthlyResultTableProps {
  studentName: string;
  studentId: string;
  subjects: { id?: string; subjectName?: string; name?: string }[];
  month: string;
  monthlyExamName?: string;
  subjectHighestMarks?: Record<string, string>;
  studentRegNo?: string;
  classNumber?: string | number | null;
}

export default function MonthlyResultTable({
  studentId,
  studentName,
  subjects,
  month,
  monthlyExamName,
  subjectHighestMarks = {},
  studentRegNo,
  classNumber,
}: MonthlyResultTableProps) {
  const studentGroup = studentRegNo ? getStudentGroup(studentRegNo) : "";
  const subjectItems =
    subjects && subjects.length > 0
      ? subjects.map((s) => ({
          id: s.id || "",
          name: s.subjectName || s.name || "",
        }))
      : INITIAL_ROWS.map((r) => ({ id: "", name: r.name }));
  const [rows, setRows] = useState<SubjectRow[]>(
    subjectItems.map(({ id, name }) => ({
      name,
      fullMarks: "100",
      highestMark: subjectHighestMarks[id] ?? subjectHighestMarks[name] ?? "",
      marksObtained: "",
      point: "",
      grade: "",
    })),
  );
  const [summary, setSummary] = useState<Summary>(INITIAL_SUMMARY);

  // When studentId changes (new student submitted), clear only marks obtained, point, grade & summary
  // Keep fullMarks and highestMark intact so user doesn't need to re-enter them
  useEffect(() => {
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        marksObtained: "",
        point: "",
        grade: "",
      }))
    );
    setSummary(INITIAL_SUMMARY);
  }, [studentId]);

  const updateRow = useCallback((idx: number, field: keyof SubjectRow, value: string) => {
    setRows((prev) => {
      const newRows = prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row));
      // Validate: Highest Mark cannot exceed Full Marks
      if (field === "highestMark") {
        const fullMarks = parseFloat(newRows[idx].fullMarks);
        const highestMark = parseFloat(value);
        if (!isNaN(fullMarks) && fullMarks > 0 && !isNaN(highestMark) && highestMark > fullMarks) {
          // Reset highest mark if it exceeds full marks
          newRows[idx] = { ...newRows[idx], highestMark: "" };
          return newRows;
        }
      }

      // Validate: Marks Obtained cannot exceed Highest Mark
      if (field === "marksObtained") {
        const highestMark = parseFloat(newRows[idx].highestMark);
        const marks = parseFloat(value);
        if (!isNaN(highestMark) && highestMark > 0 && !isNaN(marks) && marks > highestMark) {
          // If marks exceed highest mark, reset marksObtained to empty
          newRows[idx] = { ...newRows[idx], marksObtained: "", point: "", grade: "" };
          return newRows;
        }
      }

      // Auto-calculate point & grade when marksObtained or fullMarks changes
      if (field === "marksObtained" || field === "fullMarks") {
        const marks = parseFloat(newRows[idx].marksObtained);
        const fullMarks = parseFloat(newRows[idx].fullMarks);
        if (!isNaN(marks) && !isNaN(fullMarks) && fullMarks > 0 && marks >= 0) {
          // getGradeFromMarks automatically uses 50-mark system when fullMarks === 50
          const { gradePoint, letterGrade } = getGradeFromMarks(marks, fullMarks);
          newRows[idx] = {
            ...newRows[idx],
            point: gradePoint.toFixed(2),
            grade: letterGrade,
          };
        } else {
          newRows[idx] = {
            ...newRows[idx],
            point: "",
            grade: "",
          };
        }
      }
      return newRows;
    });
  }, []);

  const updateSummary = (field: keyof Summary, value: string) =>
    setSummary((prev) => ({ ...prev, [field]: value }));

  // Auto-recalculate summary whenever subject rows change
  useEffect(() => {
    const allMarks = rows.map((r) => parseFloat(r.marksObtained)).filter((v) => !isNaN(v));
    const totalMarks = allMarks.reduce((sum, m) => sum + m, 0);
    const points = rows.map((r) => parseFloat(r.point)).filter((v) => !isNaN(v));
    const gpa = points.length > 0 ? calculateGPAFromPoints(points) : 0;

    const present = rows.filter((r) => r.marksObtained.trim() !== "").length;
    const absent = rows.length - present;

    setSummary((prev) => ({
      ...prev,
      totalMarks: totalMarks > 0 ? totalMarks.toString() : "",
      gpa: gpa > 0 ? gpa.toFixed(2) : "",
      grade: gpa > 0 ? getGradeFromGPA(gpa) : "",
      present: present > 0 ? present.toString() : "",
      absent: absent > 0 ? absent.toString() : "",
    }));
  }, [rows]);

const handleSubmit = async () => {
  const payload = {
    studentId,

    monthlyExamName,

    totalMarks: Number(summary.totalMarks),
    gpa: Number(summary.gpa),
    grade: summary.grade,
    position: summary.position || "",

    present: Number(summary.present),
    absent: Number(summary.absent),

    month,

    results: rows.map((r) => ({
      subjectName: r.name,
      marks: Number(r.marksObtained),
      fullMarks: Number(r.fullMarks),
      highestMark: Number(r.highestMark),
      point: Number(r.point),
      grade: r.grade,
    })),
  };

  const res = await createMonthlyResult(payload);

  if (res.statusCode === 201) {
    showSuccessToast(
      res.message || "Monthly result created successfully."
    );
  } else {
    showErrorToast(
      res.message || "Failed to create monthly result."
    );
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full space-y-4">
        {/* â”€â”€ Main Card â”€â”€ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-gray-900">
              {studentName}
            </h2>
            {monthlyExamName && (
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                {monthlyExamName}
              </span>
            )}
          </div>

          {/* Subject Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3 text-left">Subject</th>
                  <th className="px-3 py-3 text-center">Full Marks</th>
                  <th className="px-3 py-3 text-center">Highest Mark</th>
                  <th className="px-3 py-3 text-center">Marks Obtained</th>
                  <th className="px-3 py-3 text-center">Point</th>
                  <th className="px-3 py-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.name}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors duration-100"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">

                      {getGroupSubjectLabel(row.name, studentGroup, classNumber)}

                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={row.fullMarks}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, "");
                          updateRow(idx, "fullMarks", val);
                        }}
                        placeholder="100"
                        className={`w-full min-w-16 ${inputBase}`}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={row.highestMark}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, "");
                          updateRow(idx, "highestMark", val);
                        }}
                        placeholder="100"
                        className={`w-full min-w-16 ${inputBase}`}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={row.marksObtained}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, "");
                          updateRow(idx, "marksObtained", val);
                        }}
                        placeholder="0"
                        className={`w-full min-w-16 ${inputBase}`}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={row.point}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, "");
                          updateRow(idx, "point", val);
                        }}
                        placeholder="0.00"
                        readOnly
                        className={`w-full min-w-16 ${inputBase} bg-gray-100 text-gray-500 cursor-not-allowed`}
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <TextInput
                        value={row.grade}
                        onChange={(v) => updateRow(idx, "grade", v)}
                        placeholder="A+"
                        width="w-16"
                        uppercase
                        maxLength={2}
                        readOnly
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* â”€â”€ Exam Summary â”€â”€ */}
          <div className="border-t border-gray-100">
            <div className="py-3 text-center border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 tracking-wide">
                Exam Summary
              </h3>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                  <th className="px-4 py-3 text-center">Total Marks</th>
                  <th className="px-4 py-3 text-center">GPA</th>
                  <th className="px-4 py-3 text-center">Grade</th>
                  <th className="px-4 py-3 text-center">Position</th>
                  <th className="px-4 py-3 text-center">Present</th>
                  <th className="px-4 py-3 text-center">Absent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={summary.totalMarks}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, "");
                        updateSummary("totalMarks", val);
                      }}
                      placeholder="0"
                      readOnly
                      className={`w-full min-w-16 ${inputBase} bg-gray-100 text-gray-500 cursor-not-allowed`}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={summary.gpa}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, "");
                        updateSummary("gpa", val);
                      }}
                      placeholder="0.00"
                      readOnly
                      className={`w-full min-w-16 ${inputBase} bg-gray-100 text-gray-500 cursor-not-allowed`}
                    />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <TextInput
                      value={summary.grade}
                      onChange={(v) => updateSummary("grade", v)}
                      placeholder="B"
                      width="w-16"
                      uppercase
                      maxLength={2}
                      readOnly
                    />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <TextInput
                      value={summary.position}
                      onChange={(v) => updateSummary("position", v)}
                      placeholder="Auto"
                      width="w-20"
                      readOnly
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={summary.present}
                      placeholder="0"
                      readOnly
                      className={`w-full min-w-16 ${inputBase} bg-gray-100 text-gray-500 cursor-not-allowed`}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={summary.absent}
                      placeholder="0"
                      readOnly
                      className={`w-full min-w-16 ${inputBase} bg-gray-100 text-gray-500 cursor-not-allowed`}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* â”€â”€ Submit Button â”€â”€ */}
        <button
          onClick={handleSubmit}
          className="w-full rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white tracking-wide transition-all duration-150 hover:bg-orange-600 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
