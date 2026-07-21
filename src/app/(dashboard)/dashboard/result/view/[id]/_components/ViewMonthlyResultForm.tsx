"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";

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
  avatar?: string;
  batch?: { id: string; name: string };
  stdClass?: { id: string; className: string };
}

export interface MonthlyResult {
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
}

export default function ViewMonthlyResultForm({ result }: Props) {
  const router = useRouter();
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const totalAchieved =
    result.results?.reduce((sum, r) => sum + Number(r.marks), 0) ?? 0;

  const studentClassName =
    result.student?.stdClass?.className || result.className || "N/A";
  const studentBatchName =
    result.student?.batch?.name || result.batchName || "N/A";

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

      const generatedOn = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      pdf.setFontSize(16);
      pdf.text(result.monthlyExamName || "Monthly Result Report", 14, 16);

      pdf.setFontSize(10);
      pdf.text(`Generated on: ${generatedOn}`, 14, 22);

      pdf.text(`Student: ${result.student?.name || "N/A"}`, 14, 30);
      pdf.text(`Class: ${studentClassName}`, 14, 36);
      pdf.text(`Parent Phone: ${result.student?.parentPhone || "N/A"}`, 14, 42);

      pdf.text(`Total Marks: ${totalAchieved}/${result.totalMarks}`, 120, 30);
      pdf.text(`Grade: ${result.grade}`, 120, 36);
      pdf.text(`GPA: ${result.gpa}`, 120, 42);
      pdf.text(`Position: ${result.position}`, 120, 48);
      pdf.text(`Present: ${result.present}  Absent: ${result.absent}`, 120, 54);

      autoTable(pdf, {
        startY: 60,
        head: [["Subject", "Marks Obtained", "Full Marks", "Highest Mark"]],
        body: result.results.map((subject) => [
          subject.subjectName,
          String(subject.marks),
          String(subject.fullMarks),
          String(subject.highestMark),
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
          <p className="text-xs text-gray-400 mt-0.5">
            Generated on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {totalAchieved}
                <span className="text-sm font-normal text-gray-400">
                  /{result.totalMarks}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Subject Marks */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Subject Results
          </h3>
          <div className="space-y-3">
            {result.results.map((subject) => (
              <div
                key={subject.id}
                className="grid grid-cols-12 items-center gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <div className="col-span-4">
                  <p className="text-sm font-medium text-gray-800">
                    {subject.subjectName}
                  </p>
                  <p className="text-xs text-gray-400">Full: {subject.fullMarks}</p>
                </div>

                <div className="col-span-4">
                  <p className="text-xs text-gray-500 mb-1">Marks Obtained</p>
                  <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
                    {subject.marks}
                  </p>
                </div>

                <div className="col-span-4">
                  <p className="text-xs text-gray-500 mb-1">Highest Mark</p>
                  <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
                    {subject.highestMark}
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
                {result.grade}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">GPA</p>
              <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
                {result.gpa}
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