"use client";
import React, { useTransition, useState, useCallback } from "react";
import { Student } from "../studentTableTypes";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  createWeeklyResultForSingleStd,
  updateWeeklyResultForSingleStd,
} from "@/src/services/weeklyResult";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";

type WeeklyResult = {
  id: string;
  totalMarks: number;
  subject: { id: string; subjectName: string };
  week: string;
  year: string;
  month: string;
  publishedDate: string;
  batch: { id: string; name: string };
  stdClass: { id: string; className: string };
  studentId: string | null;
  stdRegNo: string | null;
  obtainedMarks: number | null;
};

const StudentRow = ({
  student,
  totalMark,
  marksMap,
  onMarksChange,
  existingResult,
  onUpdate,
  isUpdating,
}: {
  student: Student;
  totalMark: number;
  marksMap: Record<string, string>;
  onMarksChange: (studentId: string, value: string) => void;
  existingResult: WeeklyResult | undefined;
  onUpdate: (studentId: string, resultId: string, marks: number) => void;
  isUpdating: boolean;
}) => {
  const isEditing = !!existingResult;
  const inputValue =
    marksMap[student.id] !== undefined
      ? marksMap[student.id]
      : existingResult?.obtainedMarks ?? "";

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900 text-sm">{student.name}</div>
        <div className="text-xs text-gray-500">{student.username}</div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
          {student.stdRegNo}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
          {existingResult?.stdClass?.className ||
            student.stdClass?.className ||
            "No Class"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
          {existingResult?.batch?.name ||
            student.batch?.name ||
            "No Batch"}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-900 text-sm font-medium">
        {totalMark}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <input
            type="number"
            placeholder="Enter obtain mark"
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
            value={inputValue}
            onChange={(e) => onMarksChange(student.id, e.target.value)}
          />
        </div>
      </td>
      <td className="px-4 py-3">
        {isEditing && (
          <Button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              onUpdate(
                student.id,
                existingResult.id,
                Number(inputValue || 0),
              )
            }
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-all hover:bg-blue-700 h-10 cursor-pointer whitespace-nowrap"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        )}
      </td>
    </tr>
  );
};

const WeeklyResultTakeTable = ({
  studentsData,
  weeklyResults: initialWeeklyResults,
  weeklyResultMeta,
}: {
  studentsData: Student[];
  weeklyResults: WeeklyResult[];
  weeklyResultMeta: WeeklyResult;
}) => {
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [marksMap, setMarksMap] = useState<Record<string, string>>({});
  const [localWeeklyResults, setLocalWeeklyResults] = useState<WeeklyResult[]>(initialWeeklyResults);

  const {
    totalMarks,
    subject,
    week,
    year,
    month,
    publishedDate,
    batch,
    stdClass,
  } = weeklyResultMeta;

  const batchId = batch?.id || "";
  const stdClassId = stdClass?.id || "";
  const filteredStudents = studentsData;

  const onMarksChange = useCallback((studentId: string, value: string) => {
    setMarksMap((prev) => ({ ...prev, [studentId]: value }));
  }, []);

  const handleUpdate = useCallback(
    (studentId: string, resultId: string, obtainedMarks: number) => {
      setUpdatingId(studentId);
      startTransition(async () => {
        const payload = {
          studentId,
          stdClassId,
          batchId,
          subjectId: subject?.id,
          obtainedMarks,
          totalMarks,
          week,
          year,
          month,
          publishedDate,
        };
        const res = await updateWeeklyResultForSingleStd(resultId, payload);
        if (res.statusCode === 200) {
          showSuccessToast(res.message);
        } else {
          showErrorToast(res.message);
        }
        setUpdatingId(null);
      });
    },
    [stdClassId, batchId, subject?.id, totalMarks, week, year, month, publishedDate],
  );

  const handleSubmitAll = useCallback(() => {
    // Collect all students WITHOUT existing results (use localWeeklyResults to check)
    const newStudents = filteredStudents.filter(
      (s) => !localWeeklyResults.find((r) => r.studentId === s.id),
    );

    startTransition(async () => {
      let successCount = 0;
      let errorCount = 0;
      const newlyCreatedResults: WeeklyResult[] = [];

      for (const student of newStudents) {
        const obtainedMarks = marksMap[student.id];
        if (!obtainedMarks || obtainedMarks === "") {
          errorCount++;
          continue;
        }

        const payload = {
          studentId: student.id,
          stdClassId,
          batchId,
          subjectId: subject?.id,
          obtainedMarks: parseInt(obtainedMarks, 10),
          totalMarks,
          week,
          year,
          month,
          publishedDate,
        };

        const res = await createWeeklyResultForSingleStd(payload);
        if (res.statusCode === 201) {
          successCount++;
          // Construct a local result object so the Update button appears immediately
          newlyCreatedResults.push({
            id: res?.data?.id || res?.data?._id || `temp-${student.id}`,
            totalMarks,
            subject: subject || { id: "", subjectName: "" },
            week,
            year,
            month,
            publishedDate,
            batch: batch || { id: "", name: "" },
            stdClass: stdClass || { id: "", name: "" },
            studentId: student.id,
            stdRegNo: null,
            obtainedMarks: parseInt(obtainedMarks, 10),
          });
        } else {
          errorCount++;
        }
      }

      if (newlyCreatedResults.length > 0) {
        setLocalWeeklyResults((prev) => [...prev, ...newlyCreatedResults]);
        // Clear marks for these students
        setMarksMap((prev) => {
          const updated = { ...prev };
          newlyCreatedResults.forEach((r) => {
            if (r.studentId) delete updated[r.studentId];
          });
          return updated;
        });
      }

      if (successCount > 0) {
        showSuccessToast(
          `Successfully submitted ${successCount} student(s) result!`,
        );
      }
      if (errorCount > 0) {
        showErrorToast(`Failed to submit ${errorCount} student(s) result.`);
      }
    });
  }, [
    filteredStudents,
    localWeeklyResults,
    marksMap,
    stdClassId,
    batchId,
    subject,
    totalMarks,
    week,
    year,
    month,
    publishedDate,
    batch,
    stdClass,
  ]);

  const hasNewStudents = filteredStudents.some(
    (s) => !localWeeklyResults.find((r) => r.studentId === s.id),
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 my-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-900 mr-3">Students</h2>
          <span className="bg-orange-100 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">
            {filteredStudents.length} Students
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold text-left whitespace-nowrap">
                Student's Name
              </th>
              <th className="px-4 py-3 font-semibold text-left whitespace-nowrap">
                Student's ID
              </th>
              <th className="px-4 py-3 font-semibold text-left whitespace-nowrap">
                Student's Class
              </th>
              <th className="px-4 py-3 font-semibold text-left whitespace-nowrap">
                Batch
              </th>
              <th className="px-4 py-3 font-semibold text-left whitespace-nowrap">
                <span className="flex items-center gap-1">
                  Total Marks
                  <span
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    title="Total marks"
                  >
                    &#9432;
                  </span>
                </span>
              </th>
              <th className="px-4 py-3 font-semibold text-left whitespace-nowrap">
                <span className="flex items-center gap-1">
                  Obtain Marks
                  <span
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    title="Obtain marks"
                  >
                    &#9432;
                  </span>
                </span>
              </th>
              <th className="px-4 py-3 font-semibold text-left whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const existingResult = localWeeklyResults.find(
                  (r: WeeklyResult) => r.studentId === student.id,
                );
                return (
                  <StudentRow
                    key={student.id}
                    student={student}
                    totalMark={existingResult?.totalMarks ?? totalMarks ?? 0}
                    marksMap={marksMap}
                    onMarksChange={onMarksChange}
                    existingResult={existingResult}
                    onUpdate={handleUpdate}
                    isUpdating={updatingId === student.id}
                  />
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-gray-400 text-sm"
                >
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Single Submit All button at the bottom */}
      {hasNewStudents && (
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
          <Button
            type="button"
            disabled={isPending}
            onClick={handleSubmitAll}
            className="rounded-lg bg-[#F97316] px-6 py-3 font-semibold text-white transition-all hover:bg-[#EA580C] h-12 cursor-pointer whitespace-nowrap text-base"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Submitting All...
              </>
            ) : (
              "Submit All Results"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WeeklyResultTakeTable;