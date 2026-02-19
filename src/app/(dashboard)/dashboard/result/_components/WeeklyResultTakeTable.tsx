"use client";
import React, { useTransition } from "react";
import { Student } from "./studentTableTypes";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { createWeeklyResultForSingleStd } from "@/src/services/weeklyResult";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";

// Extract a single row into its own component so each has its own useForm instance
const StudentRow = ({
  student,
  totalMark,
}: {
  student: Student;
  totalMark: number;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      obtainedMarks: student.obtainedMarks || "",
    },
  });

const onSubmit = async (data: any) => {
  startTransition(async () => {
    const payload = {
      studentId: student.id,
      obtainedMarks: data.obtainedMarks,
    };
    console.log(`Student ${student.id} submitted:`, data);

    const res = await createWeeklyResultForSingleStd(payload);

    console.log("see single student obtain mark==>", res);

    if (res.statusCode === 200) {
      showSuccessToast("Student created successfully!");
      form.reset();
    } else {
      showErrorToast(res.message || "Failed to create student.");
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
      <td className="px-4 py-3 text-gray-900 text-sm font-medium">{totalMark}</td>
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
              />
              {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
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
  totalMark,
}: {
  studentsData: Student[];
  totalMark: number;
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 my-10">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mr-3">Students</h2>
        <span className="bg-orange-100 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">
          Class 6
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs">
              <th className="px-4 py-3 font-medium text-left">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              </th>
              <th className="px-4 py-3 font-medium text-left">Student's Name</th>
              <th className="px-4 py-3 font-medium text-left">Student's ID</th>
              <th className="px-4 py-3 font-medium text-left">
                Total Marks <span className="ml-1 cursor-pointer" title="Total marks">&#9432;</span>
              </th>
              <th className="px-4 py-3 font-medium text-left">
                Obtain Marks <span className="ml-1 cursor-pointer" title="Obtain marks">&#9432;</span>
              </th>
              <th className="px-4 py-3 font-medium text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {studentsData.map((student) => (
              <StudentRow key={student.id} student={student} totalMark={totalMark} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyResultTakeTable;