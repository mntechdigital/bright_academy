"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { getStudentGroup } from "@/src/utils/studentGroup";
import { getGroupSubjectLabel } from "@/src/utils/groupSubjects";
import { computeMonthlyResultSummary } from "@/src/utils/monthlyResultSummary";

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
  batchId?: string;
  parentPhone: string;
  stdRegNo?: string;
  avatar?: string;
  batch?: { id: string; name: string };
  stdClass?: { id: string; className: string };
}

export interface MonthlyResult {
  month?: string | null;
  year?: number | null;
  publishedDate?: string | null;
  id: string;
  studentId: string;
  student: Student;
  className?: string;
  batchName?: string;
  monthlyExamName?: string;
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
  classSubjects?: { id?: string; subjectName?: string; name?: string; fullMarks?: number }[];
}

export default function ViewMonthlyResultForm({ result, classSubjects = [] }: Props) {
  const router = useRouter();
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const studentClassName =
    result.student?.stdClass?.className || result.className || "N/A";
  const studentBatchName =
    result.student?.batch?.name || result.batchName || "N/A";
  const studentGroup = getStudentGroup(result.student?.stdRegNo || "");

  const summary = useMemo(
    () =>
      computeMonthlyResultSummary({
        resultSubjects: result.results || [],
        classSubjects,
        group: studentGroup,
        classNumber: studentClassName,
        fallbackTotalMarks: result.totalMarks,
        createdAt: result.createdAt,
      }),
    [result.results, result.totalMarks, classSubjects, studentGroup, studentClassName, result.createdAt],
  );

  const totalAchieved = summary.obtained;
  const totalFull = summary.full;

  const handleDownloadPdf = async () => {
    setGeneratingPdf(true);

    try {
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.setFontSize(16);
      pdf.text(result.monthlyExamName || "Monthly Result Report", 14, 16);

      pdf.setFontSize(10);
      pdf.text(`${result.month || ""}${result.year ? ` ${result.year}` : ""}`.trim(), 14, 22);
      if (result.publishedDate) {
        const pd = new Date(result.publishedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        pdf.text(`Published: ${pd}`, 14, 27);
      }

      pdf.text(`Student: ${result.student?.name || "N/A"}`, 14, 30);
      pdf.text(`Class: ${studentClassName}`, 14, 36);

      if (studentGroup) {
        pdf.text(`Group: ${studentGroup}`, 14, 42);
        pdf.text(`Parent Phone: ${result.student?.parentPhone || "N/A"}`, 14, 48);
      } else {
        pdf.text(`Parent Phone: ${result.student?.parentPhone || "N/A"}`, 14, 42);
      }

      pdf.text(`Total Marks: ${totalAchieved}/${totalFull}`, 120, 30);
      pdf.text(`Grade: ${summary.grade}`, 120, 36);
      pdf.text(`GPA: ${summary.gpa}`, 120, 42);
      pdf.text(`Position: ${result.position}`, 120, 48);
      pdf.text(`Present: ${result.present}  Absent: ${result.absent}`, 120, 54);

      autoTable(pdf, {
        startY: 60,
        head: [["Subject", "Marks Obtained", "Full Marks", "Highest Mark"]],
        body: summary.rows.map((subject) => [
          subject.displayLabel,
          subject.marks == null ? "" : String(subject.marks),
          String(subject.fullMarks),
          subject.highestMark == null ? "" : String(subject.highestMark),
        ]),
        styles: {
          fontSize: 10,
          cellPadding: 2.5,
        },
        headStyles: {
          fillColor: [249, 115, 22],
          textColor: [255, 255, 255],
        },
      });

      const studentName = result.student?.name?.replace(/\s+/g, "_") ?? "student";
      pdf.save(`${studentName}_monthly_result.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="mx-auto space-y-4">
      {/* Top Bar: Back + Download */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={generatingPdf}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <Download size={16} />
          {generatingPdf ? "Generating..." : "Download PDF"}
        </button>
      </div>

      {/* Printable Content */}
      <div className="space-y-6 bg-gray-50 p-4 rounded-xl">
        {/* Header for PDF */}
        <div className="text-center pb-2 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-800">
            {result.monthlyExamName || "Monthly Result Report"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">{result.month}{result.year ? ` ${result.year}` : ""}</p>
          {result.publishedDate && (
            <p className="text-xs text-gray-400 mt-0.5">Published: {new Date(result.publishedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          )}
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-4">
            
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {result.student?.name}
              </h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-xs bg-orange-50 text-orange-500 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
                  {studentClassName}
                </span>
                {getStudentGroup(result.student?.stdRegNo || "") && (
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                    {getStudentGroup(result.student?.stdRegNo || "")}
                  </span>
                )}
                {(result.student?.batch?.name || result.batchName) && (
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                    Batch {result.student?.batch?.name || result.batchName}
                  </span>
                )}
                {result.monthlyExamName && (
                  <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-medium">
                    {result.monthlyExamName}
                  </span>
                )}
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                  {result.student?.parentPhone}
                </span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-gray-400">Total Marks</p>
              <div className="flex items-center justify-end gap-1.5">
                <p className="text-2xl font-bold text-gray-900">
                  {totalAchieved}
                  <span className="text-sm font-normal text-gray-400">
                    /{totalFull}
                  </span>
                </p>
                {summary.excludedRows?.length ? (
                  <span title={`${summary.excludedRows.length} subject(s) outside this student's group were ignored`} className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold cursor-help">!</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Subject Marks */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Subject Results
          </h3>
          <div className="space-y-3">
            {summary.rows.map((subject, idx) => (
              <div
                key={subject.id ?? `${subject.subjectName}-${idx}`}
                className="grid grid-cols-12 items-center gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <div className="col-span-4">
                  <p className="text-sm font-medium text-gray-800">
                    {subject.displayLabel}
                  </p>
                  <p className="text-xs text-gray-400">Full: {subject.fullMarks}</p>
                </div>

                <div className="col-span-4">
                  <p className="text-xs text-gray-500 mb-1">Marks Obtained</p>
                  <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
                    {subject.marks ?? ""}
                  </p>
                </div>

                <div className="col-span-4">
                  <p className="text-xs text-gray-500 mb-1">Highest Mark</p>
                  <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
                    {subject.highestMark ?? ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Result Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Grade</p>
              <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
                {summary.grade}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">GPA</p>
              <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
                {summary.gpa}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Position</p>
              <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
                {result.position}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Present Days</p>
              <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
                {result.present}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-xs font-medium text-gray-500 mb-1">Absent Days</p>
              <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
                {result.absent}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}