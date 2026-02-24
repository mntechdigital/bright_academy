"use client";
import React, { useTransition } from "react";
import { Student } from "../studentTableTypes";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  createWeeklyResultForSingleStd,
  updateWeeklyResultForSingleStd,
} from "@/src/services/weeklyResult";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";

type WeeklyResult = {
  id: string;
  totalMarks: number;
  subject: { id: string };
  week: string;
  year: string;
  month: string;
  publishedDate: string;
  sectionId: string;
  stdClassId: string;
  studentId: string | null;
  obtainedMarks: number | null;
  section?: { id: string; sectionName: string };
  stdClass?: { id: string; className: string };
};

const StudentRow = ({
  student,
  totalMark,
  subjectId,
  week,
  year,
  month,
  publishedDate,
  sectionId,
  stdClassId,
  defaultObtainedMarks,
  weeklyResults,
}: {
  student: Student;
  totalMark: number;
  subjectId: string;
  week: string;
  year: string;
  month: string;
  publishedDate: string;
  sectionId: string;
  stdClassId: string;
  defaultObtainedMarks: number | null;
  weeklyResults: WeeklyResult[];
}) => {
  const [isPending, startTransition] = useTransition();
  const existingResult = weeklyResults.find((r) => r.studentId === student.id);
  const isEditing = !!existingResult;

  const form = useForm({
    defaultValues: {
      obtainedMarks: defaultObtainedMarks ? Number(defaultObtainedMarks) : "",
    },
  });

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      const payload = {
        studentId: student.id,
        stdClassId,
        sectionId,
        subjectId,
        obtainedMarks: parseInt(data.obtainedMarks, 10),
        totalMarks: totalMark,
        week,
        year,
        month,
        publishedDate,
      };

      let res;
      if (isEditing) {
        res = await updateWeeklyResultForSingleStd(existingResult.id, payload);
      } else {
        res = await createWeeklyResultForSingleStd(payload);
      }

      if (res.statusCode === (isEditing ? 200 : 201)) {
        showSuccessToast(res.message);
      } else {
        showErrorToast(res.message);
      }
    });
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900 text-sm">{student.name}</div>
        <div className="text-xs text-gray-500">{student.username}</div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
          {student.studentId}
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
          {existingResult?.section?.sectionName ||
            student.section?.sectionName ||
            "No Section"}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-900 text-sm font-medium">
        {totalMark}
      </td>
      <td className="px-4 py-3">
        <Controller
          name="obtainedMarks"
          control={form.control}
          rules={{ required: "Obtain mark is required" }}
          render={({ field, fieldState: { error } }) => (
            <div className="flex flex-col">
              <input
                {...field}
                type="number"
                placeholder="Enter obtain mark"
                className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
              {error && (
                <p className="mt-1 text-sm text-red-500">{error.message}</p>
              )}
            </div>
          )}
        />
      </td>
      <td className="px-4 py-3">
        <Button
          type="button"
          disabled={isPending}
          onClick={form.handleSubmit(onSubmit)}
          className="rounded-lg bg-[#F97316] px-4 py-2 font-semibold text-white transition-all hover:bg-[#EA580C] h-10 cursor-pointer whitespace-nowrap"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Submit
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </td>
    </tr>
  );
};

const WeeklyResultTakeTable = ({
  studentsData,
  weeklyResults,
  weeklyResultMeta,
}: {
  studentsData: Student[];
  weeklyResults: WeeklyResult[];
  weeklyResultMeta: WeeklyResult;
}) => {
  const {
    totalMarks,
    subject,
    week,
    year,
    month,
    publishedDate,
    sectionId,
    stdClassId,
  } = weeklyResultMeta;

  const filteredStudents = studentsData;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 my-10">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mr-3">Students</h2>
        <span className="bg-orange-100 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">
          {filteredStudents.length} Students
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold text-left whitespace-nowrap w-10">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
              </th>
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
                Student's Section
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
                const existingResult = weeklyResults.find(
                  (r) => r.studentId === student.id,
                );
                return (
                  <StudentRow
                    key={student.id}
                    student={student}
                    totalMark={existingResult?.totalMarks ?? totalMarks ?? 0}
                    subjectId={subject?.id}
                    week={week}
                    year={year}
                    month={month}
                    publishedDate={publishedDate}
                    sectionId={sectionId}
                    stdClassId={stdClassId}
                    defaultObtainedMarks={existingResult?.obtainedMarks ?? null}
                    weeklyResults={weeklyResults}
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
    </div>
  );
};

export default WeeklyResultTakeTable;
