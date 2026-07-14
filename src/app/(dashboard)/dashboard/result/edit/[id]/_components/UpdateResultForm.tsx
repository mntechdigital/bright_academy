"use client";
import { updateMonthlyResult } from "@/src/services/monthlyResult";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { getGradeFromMarks, calculateGPAFromPoints, getGradeFromGPA } from "@/src/utils/gradeUtils";
import React, { useEffect, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// ---- Types ----
interface ResultSubject {
  id: string;
  subjectName: string;
  marks: number;
  fullMarks: number;
  highestMark: number;
  grade: string;
  point: number;
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

interface FormValues {
  gpa: number;
  grade: string;
  position: string;
  present: number;
  absent: number;
  results: {
    id: string;
    subjectName: string;
    fullMarks: number;
    marks: number;
    highestMark: number;
    grade: string;
    point: number;
  }[];
}

interface Props {
  result: MonthlyResult;
}

const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"];

export default function UpdateResultForm({ result }: Props) {
  const router = useRouter();

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      gpa: result.gpa,
      grade: result.grade,
      position: result.position,
      present: result.present,
      absent: result.absent,
      results: result.results.map((r) => ({
        id: r.id,
        subjectName: r.subjectName,
        fullMarks: r.fullMarks,
        marks: r.marks,
        highestMark: r.highestMark,
        grade: r.grade ?? "",
        point: r.point ?? 0,
      })),
    },
  });

  const { fields } = useFieldArray({ control, name: "results" });

  const watchedResults = watch("results");
  const totalAchieved =
    watchedResults?.reduce((sum, r) => sum + Number(r.marks), 0) ?? 0;

  // Auto-calculate subject grade & point when marks or fullMarks change
  const handleMarksChange = useCallback(
    (index: number, marks: number, fullMarks: number) => {
      if (!isNaN(marks) && !isNaN(fullMarks) && fullMarks > 0 && marks >= 0) {
        const { gradePoint, letterGrade } = getGradeFromMarks(marks, fullMarks);
        // Use setValue with shouldDirty to avoid marking entire form as dirty
        setValue(`results.${index}.grade`, letterGrade);
        setValue(`results.${index}.point`, gradePoint);
      } else {
        setValue(`results.${index}.grade`, "");
        setValue(`results.${index}.point`, 0);
      }
    },
    [setValue]
  );

  // Auto-calculate overall GPA & grade whenever results change
  useEffect(() => {
    if (!watchedResults) return;

    const points = watchedResults
      .map((r) => Number(r.point))
      .filter((p) => !isNaN(p) && p > 0);

    const gpa = points.length > 0 ? calculateGPAFromPoints(points) : 0;
    const letterGrade = gpa > 0 ? getGradeFromGPA(gpa) : "";

    setValue("gpa", gpa);
    setValue("grade", letterGrade);

    // Auto-calculate present/absent
    const present = watchedResults.filter(
      (r) => String(r.marks).trim() !== ""
    ).length;
    const absent = watchedResults.length - present;
    setValue("present", present);
    setValue("absent", absent);
  }, [watchedResults, setValue]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      id: result.id,
      studentId: result.studentId,
      gpa: data.gpa,
      grade: data.grade,
      position: data.position,
      present: data.present,
      absent: data.absent,
      results: data.results.map((r) => ({
        id: r.id,
        fullMarks: Number(r.fullMarks),
        marks: Number(r.marks),
        highestMark: Number(r.highestMark),
        grade: r.grade,
        point: Number(r.point),
      })),
    };
    const res = await updateMonthlyResult(result.id, payload);
    console.log("update result res==>", res);
    if (res.statusCode === 200) {
      showSuccessToast("Result updated successfully!");
    } else {
      showErrorToast("Failed to update result. Please try again.");
    }
  };

  const avatarUrl =
    result.student?.avatar ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(result.student?.name ?? "S")}&background=f3f4f6&color=374151`;

  return (
    <div className="mx-auto">
      {/* Back Arrow */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-4 group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        <span>Back</span>
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Student Info Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt={result.student?.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
            />
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {result.student?.name}
              </h2>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.student?.stdClass?.className && (
                  <span className="text-xs bg-orange-50 text-orange-500 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
                    {result.student.stdClass.className}
                  </span>
                )}
                {result.student?.batch?.name && (
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                    Batch {result.student.batch.name}
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
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 items-center gap-3"
              >
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-800">
                    {field.subjectName}
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Full Marks
                  </label>
                  <Controller
                    control={control}
                    name={`results.${index}.fullMarks`}
                    render={({ field: f }) => (
                      <input
                        {...f}
                        type="text"
                        inputMode="numeric"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          f.onChange(val);
                        }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
                      />
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Marks
                  </label>
                  <Controller
                    control={control}
                    name={`results.${index}.marks`}
                    render={({ field: f }) => (
                      <input
                        {...f}
                        type="text"
                        inputMode="numeric"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          f.onChange(val);
                          // Auto-calculate grade & point on marks change
                          const numericMarks = parseFloat(val);
                          const fullMarks = parseFloat(
                            String(watchedResults?.[index]?.fullMarks ?? 0)
                          );
                          handleMarksChange(index, numericMarks, fullMarks);
                        }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
                      />
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Highest
                  </label>
                  <Controller
                    control={control}
                    name={`results.${index}.highestMark`}
                    render={({ field: f }) => (
                      <input
                        {...f}
                        type="text"
                        inputMode="numeric"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          f.onChange(val);
                        }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
                      />
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Grade
                  </label>
                  <Controller
                    control={control}
                    name={`results.${index}.grade`}
                    render={({ field: f }) => (
                      <input
                        {...f}
                        value={f.value ?? ""}
                        readOnly
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 outline-none bg-gray-100 cursor-not-allowed"
                      />
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Point
                  </label>
                  <Controller
                    control={control}
                    name={`results.${index}.point`}
                    defaultValue={field.point ?? 0}
                    render={({ field: f }) => (
                      <input
                        {...f}
                        value={f.value ?? 0}
                        readOnly
                        type="text"
                        inputMode="decimal"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 outline-none bg-gray-100 cursor-not-allowed"
                      />
                    )}
                  />
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
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Grade
              </label>
              <Controller
                control={control}
                name="grade"
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value ?? ""}
                    readOnly
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 outline-none bg-gray-100 cursor-not-allowed"
                  />
                )}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                GPA
              </label>
              <Controller
                control={control}
                name="gpa"
                render={({ field }) => (
                  <input
                    {...field}
                    value={typeof field.value === "number" ? field.value.toFixed(2) : field.value}
                    readOnly
                    type="text"
                    inputMode="decimal"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 outline-none bg-gray-100 cursor-not-allowed"
                  />
                )}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Position
              </label>
              <Controller
                control={control}
                name="position"
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      field.onChange(val);
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
                  />
                )}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Present
              </label>
              <Controller
                control={control}
                name="present"
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value ?? 0}
                    readOnly
                    type="text"
                    inputMode="numeric"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 outline-none bg-gray-100 cursor-not-allowed"
                  />
                )}
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Absent
              </label>
              <Controller
                control={control}
                name="absent"
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value ?? 0}
                    readOnly
                    type="text"
                    inputMode="numeric"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 outline-none bg-gray-100 cursor-not-allowed"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            Update Result
          </button>
        </div>
      </form>
    </div>
  );
}