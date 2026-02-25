"use client";

import { useState } from "react";

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
};

function NumberInput({ value, onChange, placeholder }: NumberInputProps) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full min-w-[64px] ${inputBase}`}
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
};

function TextInput({ value, onChange, placeholder, width = "w-full", uppercase = false, maxLength }: TextInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`${width} ${inputBase} ${uppercase ? "uppercase font-semibold" : ""}`}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface MonthlyResultTableProps {
  studentName: string;
  subjects: { id?: string; subjectName?: string; name?: string }[];
}

export default function MonthlyResultTable({ studentName, subjects }: MonthlyResultTableProps) {
  const subjectNames = subjects && subjects.length > 0
    ? subjects.map(s => s.subjectName || s.name || "")
    : INITIAL_ROWS.map(r => r.name);
  const [rows, setRows] = useState<SubjectRow[]>(
    subjectNames.map(name => ({
      name,
      fullMarks: "",
      highestMark: "",
      marksObtained: "",
      point: "",
      grade: "",
    }))
  );
  const [summary, setSummary] = useState<Summary>(INITIAL_SUMMARY);

  const updateRow = (idx: number, field: keyof SubjectRow, value: string) =>
    setRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );

  const updateSummary = (field: keyof Summary, value: string) =>
    setSummary((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    console.log("Submitted:", { rows, summary });
    alert("Result submitted successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full space-y-4">

        {/* ── Main Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Card Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <h2 className="text-[15px] font-bold text-gray-900">{studentName}</h2>
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
                      <NumberInput value={row.fullMarks}     onChange={(v) => updateRow(idx, "fullMarks", v)}     placeholder="100"  />
                    </td>
                    <td className="px-3 py-3">
                      <NumberInput value={row.highestMark}   onChange={(v) => updateRow(idx, "highestMark", v)}   placeholder="100"  />
                    </td>
                    <td className="px-3 py-3">
                      <NumberInput value={row.marksObtained} onChange={(v) => updateRow(idx, "marksObtained", v)} placeholder="0"    />
                    </td>
                    <td className="px-3 py-3">
                      <NumberInput value={row.point}         onChange={(v) => updateRow(idx, "point", v)}         placeholder="0.00" />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <TextInput
                        value={row.grade}
                        onChange={(v) => updateRow(idx, "grade", v)}
                        placeholder="A+"
                        width="w-16"
                        uppercase
                        maxLength={2}
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
              <h3 className="text-sm font-semibold text-gray-700 tracking-wide">Exam Summary</h3>
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
                    <NumberInput value={summary.totalMarks} onChange={(v) => updateSummary("totalMarks", v)} placeholder="0"    />
                  </td>
                  <td className="px-4 py-4">
                    <NumberInput value={summary.gpa}        onChange={(v) => updateSummary("gpa", v)}        placeholder="0.00" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <TextInput
                      value={summary.grade}
                      onChange={(v) => updateSummary("grade", v)}
                      placeholder="B"
                      width="w-16"
                      uppercase
                      maxLength={2}
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
                    <NumberInput value={summary.present} onChange={(v) => updateSummary("present", v)} placeholder="0" />
                  </td>
                  <td className="px-4 py-4">
                    <NumberInput value={summary.absent}  onChange={(v) => updateSummary("absent", v)}  placeholder="0" />
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