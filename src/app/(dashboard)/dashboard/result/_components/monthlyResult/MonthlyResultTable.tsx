"use client";

import { createMonthlyResult } from "@/src/services/monthlyResult";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { getGroupSubjectLabel, sortSubjectsForClass } from "@/src/utils/groupSubjects";
import { getGradeFromMarks } from "@/src/utils/gradeUtils";
import { getStudentGroup } from "@/src/utils/studentGroup";
import { useState, useCallback, useEffect } from "react";
import {
  computeMonthlyResultSummary,
  computePractical,
  getDefaultFullMarksForSubject,
  getPracticalSubjectSlot,
  ICT_EXAM_PASS_MARK,
  ICT_FULL_MARKS,
  isPracticalApplicable,
  SCIENCE_EXAM_PASS_MARK,
  SCIENCE_FULL_MARKS,
} from "@/src/utils/monthlyResultSummary";

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Types Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

type SubjectRow = {
  name: string;
  fullMarks: string;
  highestMark: string;
  marksObtained: string;
  point: string;
  grade: string;
  isAbsent: boolean;
};

type Summary = {
  totalMarks: string;
  gpa: string;
  grade: string;
  position: string;
  present: string;
  absent: string;
};

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Initial data Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

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
  isAbsent: false,
}));

const INITIAL_SUMMARY: Summary = {
  totalMarks: "",
  gpa: "",
  grade: "",
  position: "",
  present: "",
  absent: "",
};

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Shared input styles Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

const inputBase =
  "rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-center text-sm text-gray-800 placeholder:text-gray-300 outline-none tabular-nums transition-all duration-150 hover:border-gray-300 hover:bg-white focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100";

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Reusable inputs Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

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

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Main Component Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

interface MonthlyResultTableProps {
  studentName: string;
  studentId: string;
  subjects: { id?: string; subjectName?: string; name?: string }[];
  month: string;
  year?: string | number;
  publishedDate?: Date | string | null;
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
  year,
  publishedDate,
  monthlyExamName,
  subjectHighestMarks = {},
  studentRegNo,
  classNumber,
}: MonthlyResultTableProps) {
  const studentGroup = studentRegNo ? getStudentGroup(studentRegNo) : "";
  const sortedSubjects = sortSubjectsForClass(subjects || [], classNumber);
  const subjectItems =
    sortedSubjects && sortedSubjects.length > 0
      ? sortedSubjects.map((s) => ({
          id: s.id || "",
          name: s.subjectName || s.name || "",
        }))
      : INITIAL_ROWS.map((r) => ({ id: "", name: r.name }));
  const ictCutoff = undefined; // use default shared constant
  const [rows, setRows] = useState<SubjectRow[]>(
    subjectItems.map(({ id, name }) => {
      const slot = getPracticalSubjectSlot(name, studentGroup, classNumber);
      const full =
        slot === "ict" ? String(ICT_FULL_MARKS) :
        slot && slot.startsWith("science-") ? String(SCIENCE_FULL_MARKS) :
        String(getDefaultFullMarksForSubject(name));
      return {
        name,
        fullMarks: full,
        highestMark: subjectHighestMarks[id] ?? subjectHighestMarks[name] ?? "",
        marksObtained: "",
        point: "",
        grade: "",
        isAbsent: false,
      };
    }),
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
        isAbsent: false,
      }))
    );
    setSummary(INITIAL_SUMMARY);
  }, [studentId]);

  const getRowStoredMarks = useCallback((row: SubjectRow) => {
    if (row.isAbsent) return 0;
    const entered = row.marksObtained === "" ? NaN : Number(row.marksObtained);
    if (Number.isNaN(entered)) return NaN;
    const slot = getPracticalSubjectSlot(row.name, studentGroup, classNumber);
    const applicable = !!slot && isPracticalApplicable(row.name, studentGroup, classNumber, new Date(), ictCutoff);
    if (applicable) return computePractical(slot, studentGroup, classNumber, entered, false).total;
    return entered;
  }, [classNumber, ictCutoff, studentGroup]);

  const updateRow = useCallback((idx: number, field: keyof SubjectRow, value: string | boolean) => {
    setRows((prev) => {
      const newRows = prev.map((row, i) => (i === idx ? { ...row, [field]: value as any } : row));
      const row = newRows[idx];
      const slot = getPracticalSubjectSlot(row.name, studentGroup, classNumber);
      const applicable = !!slot && isPracticalApplicable(row.name, studentGroup, classNumber, new Date(), ictCutoff);
      const fullMarksNum =
        slot === "ict" ? ICT_FULL_MARKS :
        slot && slot.startsWith("science-") ? SCIENCE_FULL_MARKS :
        (parseFloat(row.fullMarks) || getDefaultFullMarksForSubject(row.name));
      row.fullMarks = String(fullMarksNum);

      if (field === "isAbsent" && value === true) {
        row.marksObtained = "";
        row.point = "0.00";
        row.grade = "F";
        return newRows;
      }
      if (field === "isAbsent" && value === false) {
        row.point = "";
        row.grade = "";
      }

      if (field === "highestMark") {
        const highestMark = parseFloat(row.highestMark);
        if (!isNaN(highestMark) && highestMark > fullMarksNum) {
          row.highestMark = String(fullMarksNum);
        }
      }

      if (field === "marksObtained" || field === "fullMarks" || field === "isAbsent") {
        if (row.isAbsent) {
          row.marksObtained = "";
          row.point = "0.00";
          row.grade = "F";
          return newRows;
        }
        const entered = row.marksObtained === "" ? NaN : Number(row.marksObtained);
        const maxInput = applicable ? computePractical(slot, studentGroup, classNumber, 0, false).examMax : fullMarksNum;
        if (!Number.isNaN(entered)) {
          const clamped = Math.max(0, Math.min(maxInput, entered));
          row.marksObtained = String(clamped);
          const storedMarks = applicable ? computePractical(slot, studentGroup, classNumber, clamped, false).total : clamped;
          const { gradePoint, letterGrade } = getGradeFromMarks(storedMarks, fullMarksNum);
          row.point = gradePoint.toFixed(2);
          row.grade = letterGrade;
        } else {
          row.point = "";
          row.grade = "";
        }
      }
      return newRows;
    });
  }, [classNumber, ictCutoff, studentGroup]);

  const updateSummary = (field: keyof Summary, value: string) =>
    setSummary((prev) => ({ ...prev, [field]: value }));

  // Auto-recalculate summary whenever subject rows change
  useEffect(() => {
    const resultSummary = computeMonthlyResultSummary({
      resultSubjects: rows.map((r) => {
        const slot = getPracticalSubjectSlot(r.name, studentGroup, classNumber);
        const applicable = !!slot && isPracticalApplicable(r.name, studentGroup, classNumber, new Date(), ictCutoff);
        const entered = r.marksObtained === "" ? null : Number(r.marksObtained);
        const storedMarks = r.isAbsent ? 0 : (applicable ? computePractical(slot, studentGroup, classNumber, entered, false).total : (entered ?? 0));
        const fullMarks =
          slot === "ict" ? ICT_FULL_MARKS :
          slot && slot.startsWith("science-") ? SCIENCE_FULL_MARKS :
          (r.fullMarks === "" ? getDefaultFullMarksForSubject(r.name) : Number(r.fullMarks));
        return {
          subjectName: r.name,
          marks: storedMarks,
          fullMarks,
          isAbsent: r.isAbsent,
        };
      }),
      classSubjects: subjects || [],
      group: studentGroup,
      classNumber,
      createdAt: new Date(),
    });
    const present = rows.filter((r) => !r.isAbsent && r.marksObtained.trim() !== "").length;
    const absent = Math.max(0, resultSummary.subjectCount - present);
    setSummary((prev) => ({
      ...prev,
      totalMarks: String(resultSummary.obtained),
      gpa: String(resultSummary.gpa),
      grade: resultSummary.grade,
      present: String(present),
      absent: String(absent),
    }));
  }, [rows, subjects, studentGroup, classNumber, ictCutoff]);
const handleSubmit = async () => {
  // Contract: for NEW class 9/10 practical subjects, client sends EXAM mark (ICT 0-25, Science 0-75)
  // in marks/examMark; server computes practical/total via computePractical exactly once.
  const yearNum = year === undefined || year === null || String(year).trim() === "" ? undefined : Number(year);
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
    ...(Number.isInteger(yearNum) ? { year: yearNum } : {}),
    ...(publishedDate ? { publishedDate: new Date(publishedDate).toISOString() } : {}),
    results: rows.map((r) => {
      const slot = getPracticalSubjectSlot(r.name, studentGroup, classNumber);
      const applicable = !!slot && isPracticalApplicable(r.name, studentGroup, classNumber, new Date(), ictCutoff);
      const entered = r.marksObtained === "" ? 0 : Number(r.marksObtained);
      const exam = r.isAbsent ? 0 : entered;
      const fullMarks =
        slot === "ict" ? ICT_FULL_MARKS :
        slot && slot.startsWith("science-") ? SCIENCE_FULL_MARKS :
        Number(r.fullMarks);
      return {
        subjectName: r.name,
        marks: applicable ? exam : exam,
        ...(applicable ? { examMark: exam, ...(slot === "ict" ? { ictExamMark: exam } : {}) } : {}),
        fullMarks,
        highestMark: r.highestMark === "" ? 0 : Number(r.highestMark),
        point: r.point === "" ? 0 : Number(r.point),
        grade: r.grade || "F",
        isAbsent: !!r.isAbsent,
      };
    }),
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
        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Main Card Ã¢â€â‚¬Ã¢â€â‚¬ */}
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
                  <th className="px-3 py-3 text-center">Marks</th>
                  <th className="px-3 py-3 text-center">Absent</th>
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
                      {(() => {
                        const slot = getPracticalSubjectSlot(row.name, studentGroup, classNumber);
                        const applicable = !!slot && isPracticalApplicable(row.name, studentGroup, classNumber, new Date(), ictCutoff);
                        const conf = applicable ? computePractical(slot, studentGroup, classNumber, 0, false) : null;
                        const max = conf ? conf.examMax : (parseFloat(row.fullMarks) || 100);
                        const title = conf
                          ? (slot === "ict"
                            ? `ICT exam (max 25). ${ICT_EXAM_PASS_MARK}+ pass: practical=exam; below ${ICT_EXAM_PASS_MARK}: no practical.`
                            : `Exam (max 75). ${SCIENCE_EXAM_PASS_MARK}+ pass: exam+20 practical; below ${SCIENCE_EXAM_PASS_MARK}: no practical.`)
                          : undefined;
                        return (
                          <div>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={row.isAbsent ? "" : row.marksObtained}
                              disabled={row.isAbsent}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9.]/g, "");
                                const n = val === "" ? "" : String(Math.min(max, Number(val)));
                                updateRow(idx, "marksObtained", n);
                              }}
                              placeholder={conf ? `0-${conf.examMax}` : "0"}
                              title={title}
                              className={`w-full min-w-16 ${inputBase} ${row.isAbsent ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                            />
                            {conf ? (
                              <div className="text-[10px] text-gray-400 mt-0.5 text-center">
                                {row.isAbsent ? "absent" : (() => {
                                  const entered = row.marksObtained === "" ? NaN : Number(row.marksObtained);
                                  if (Number.isNaN(entered)) return `max ${conf.examMax}`;
                                  const c = computePractical(slot, studentGroup, classNumber, entered, false);
                                  return c.practical > 0 ? `exam ${c.exam} + practical ${c.practical}` : (entered >= conf.passMark ? `exam ${c.exam}` : "failed: no practical");
                                })()}
                              </div>
                            ) : null}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={row.isAbsent}
                        onChange={(e) => updateRow(idx, "isAbsent", e.target.checked)}
                        className="h-4 w-4 accent-orange-500 cursor-pointer"
                        title="Mark subject as absent"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={row.point}
                        readOnly
                        placeholder="0.00"
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

          {/* Ã¢â€â‚¬Ã¢â€â‚¬ Exam Summary Ã¢â€â‚¬Ã¢â€â‚¬ */}
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

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Submit Button Ã¢â€â‚¬Ã¢â€â‚¬ */}
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
