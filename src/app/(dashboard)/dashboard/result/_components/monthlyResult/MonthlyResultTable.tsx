"use client";

import { createMonthlyResult } from "@/src/services/monthlyResult";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { getGradeFromMarks, calculateGPAFromPoints, getGradeFromGPA } from "@/src/utils/gradeUtils";
import { useState, useCallback, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_ROWS: SubjectRow[] = [
  "Bangla First Paper",
  "Bangla Second Paper",
  "English First Paper",
  "English Second Paper",
  "Mathematics",
].map((name) => ({
  name,
  fullMarks: "",
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

// ─── Shared input styles ──────────────────────────────────────────────────────

const inputBase =
  "rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-center text-sm text-gray-800 placeholder:text-gray-300 outline-none tabular-nums transition-all duration-150 hover:border-gray-300 hover:bg-white focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100";

// ─── Reusable inputs ──────────────────────────────────────────────────────────

type NumberInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
};

function NumberInput({ value, onChange, placeholder, readOnly = false }: NumberInputProps) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full min-w-16 ${inputBase} ${readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
    />
  );
}

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

// ─── Main Component ───────────────────────────────────────────────────────────

interface MonthlyResultTableProps {
  studentName: string;
  studentId: string;
  subjects: { id?: string; subjectName?: string; name?: string }[];
  month: string;
}

export default function MonthlyResultTable({
  studentId,
  studentName,
  subjects,
  month
}: MonthlyResultTableProps) {
  const subjectNames =
    subjects && subjects.length > 0
      ? subjects.map((s) => s.subjectName || s.name || "")
      : INITIAL_ROWS.map((r) => r.name);
  const [rows, setRows] = useState<SubjectRow[]>(
    subjectNames.map((name) => ({
      name,
      fullMarks: "",
      highestMark: "",
      marksObtained: "",
      point: "",
      grade: "",
    })),
  );
  const [summary, setSummary] = useState<Summary>(INITIAL_SUMMARY);
  const [gradingSystem, setGradingSystem] = useState<"100" | "50">("100");

  const updateRow = useCallback((idx: number, field: keyof SubjectRow, value: string) => {
    setRows((prev) => {
      const newRows = prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row));
      // Auto-calculate point & grade when marksObtained or fullMarks changes
      if (field === "marksObtained" || field === "fullMarks") {
        const marks = parseFloat(newRows[idx].marksObtained);
        const fullMarks = parseFloat(newRows[idx].fullMarks);
        if (!isNaN(marks) && !isNaN(fullMarks) && fullMarks > 0 && marks >= 0) {
          const { gradePoint, letterGrade } = getGradeFromMarks(marks, fullMarks, gradingSystem);
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
  }, [gradingSystem]);

  const updateSummary = (field: keyof Summary, value: string) =>
    setSummary((prev) => ({ ...prev, [field]: value }));

  // When grading system changes, auto-fill fullMarks and recalculate
  useEffect(() => {
    const defaultFullMarks = gradingSystem === "50" ? 50 : 100;
    setRows((prev) =>
      prev.map((row) => {
        const updatedRow = { ...row, fullMarks: defaultFullMarks.toString() };
        const marks = parseFloat(updatedRow.marksObtained);
        const fullMarks = parseFloat(updatedRow.fullMarks);
        if (!isNaN(marks) && !isNaN(fullMarks) && fullMarks > 0 && marks >= 0) {
          const { gradePoint, letterGrade } = getGradeFromMarks(marks, fullMarks, gradingSystem);
          return { ...updatedRow, point: gradePoint.toFixed(2), grade: letterGrade };
        }
        return updatedRow;
      })
    );
  }, [gradingSystem]);

  // Auto-recalculate summary whenever subject rows change
  useEffect(() => {
    const allMarks = rows.map((r) => parseFloat(r.marksObtained)).filter((v) => !isNaN(v));
    const totalMarks = allMarks.reduce((sum, m) => sum + m, 0);
    const points = rows.map((r) => parseFloat(r.point)).filter((v) => !isNaN(v));
    const gpa = points.length > 0 ? calculateGPAFromPoints(points) : 0;

    setSummary((prev) => ({
      ...prev,
      totalMarks: totalMarks > 0 ? totalMarks.toString() : "",
      gpa: gpa > 0 ? gpa.toFixed(2) : "",
      grade: gpa > 0 ? getGradeFromGPA(gpa) : "",
    }));
  }, [rows]);

  const handleSubmit = async () => {
    const payload = {
      studentId: studentId,
      totalMarks: Number(summary.totalMarks),
      gpa: Number(summary.gpa),
      grade: summary.grade,
      position: summary.position,
      present: Number(summary.present),
      absent: Number(summary.absent),
      month: month,
      results: {
        create: rows.map((r) => ({
          subjectName: r.name,
          marks: Number(r.marksObtained),
          fullMarks: Number(r.fullMarks),
          highestMark: Number(r.highestMark),
          point: Number(r.point),
          grade: r.grade,
        })),
      },
    };

    const res = await createMonthlyResult(payload);
    if (res.statusCode === 201) {
      showSuccessToast(res.message || "Monthly result created successfully.");
    } else {
      showErrorToast(
        res.message || "Failed to create monthly result. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full space-y-4">
        {/* ── Main Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-[15px] font-bold text-gray-900">
              {studentName}
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Grading System:</label>
              <select
                value={gradingSystem}
                onChange={(e) => setGradingSystem(e.target.value as "100" | "50")}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              >
                <option value="100">Marks out of 100</option>
                <option value="50">Marks out of 50</option>
              </select>
            </div>
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
                      {row.name}
                    </td>
                    <td className="px-3 py-3">
                      <NumberInput
                        value={row.fullMarks}
                        onChange={(v) => updateRow(idx, "fullMarks", v)}
                        placeholder="100"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <NumberInput
                        value={row.highestMark}
                        onChange={(v) => updateRow(idx, "highestMark", v)}
                        placeholder="100"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <NumberInput
                        value={row.marksObtained}
                        onChange={(v) => updateRow(idx, "marksObtained", v)}
                        placeholder="0"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <NumberInput
                        value={row.point}
                        onChange={(v) => updateRow(idx, "point", v)}
                        placeholder="0.00"
                        readOnly
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

          {/* ── Exam Summary ── */}
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
                    <NumberInput
                      value={summary.totalMarks}
                      onChange={(v) => updateSummary("totalMarks", v)}
                      placeholder="0"
                      readOnly
                    />
                  </td>
                  <td className="px-4 py-4">
                    <NumberInput
                      value={summary.gpa}
                      onChange={(v) => updateSummary("gpa", v)}
                      placeholder="0.00"
                      readOnly
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
                      placeholder="12th"
                      width="w-20"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <NumberInput
                      value={summary.present}
                      onChange={(v) => updateSummary("present", v)}
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <NumberInput
                      value={summary.absent}
                      onChange={(v) => updateSummary("absent", v)}
                      placeholder="0"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Submit Button ── */}
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