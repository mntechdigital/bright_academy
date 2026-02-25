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

// ─── Initial rows ─────────────────────────────────────────────────────────────

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

// ─── NumberInput component ────────────────────────────────────────────────────

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
      className="w-full min-w-[64px] rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-center text-sm text-gray-800 placeholder:text-gray-300 outline-none tabular-nums transition-all duration-150 hover:border-gray-300 hover:bg-white focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MonthlyResultTable() {
  const [rows, setRows] = useState<SubjectRow[]>(INITIAL_ROWS);

  const updateRow = (idx: number, field: keyof SubjectRow, value: string) =>
    setRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );

  // Live footer stats
  const filled = rows.filter((r) => r.marksObtained !== "");
  const avgMarks = filled.length
    ? (filled.reduce((s, r) => s + Number(r.marksObtained), 0) / filled.length).toFixed(1)
    : "—";

  const filledGPA = rows.filter((r) => r.point !== "");
  const avgGpa = filledGPA.length
    ? (filledGPA.reduce((s, r) => s + Number(r.point), 0) / filledGPA.length).toFixed(2)
    : "—";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-bold text-gray-900">Raisul R.</h2>
          <span className="rounded-md bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-500 ring-1 ring-red-100">
            Roll: bright0191
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3 text-left">Student's Name</th>
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
                  {/* Subject name */}
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                    {row.name}
                  </td>

                  {/* Number inputs */}
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
                    />
                  </td>

                  {/* Grade text input */}
                  <td className="px-3 py-3 text-center">
                    <input
                      type="text"
                      value={row.grade}
                      onChange={(e) => updateRow(idx, "grade", e.target.value.toUpperCase())}
                      placeholder="A+"
                      maxLength={2}
                      className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-center text-sm font-semibold text-gray-800 placeholder:text-gray-300 placeholder:font-normal outline-none uppercase transition-all duration-150 hover:border-gray-300 hover:bg-white focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/40">
          <p className="text-xs text-gray-400">{rows.length} subjects total</p>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <span>
              Avg. Marks:{" "}
              <span className="font-semibold text-gray-700">{avgMarks}</span>
            </span>
            <span>
              GPA:{" "}
              <span className="font-semibold text-gray-700">{avgGpa}</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}