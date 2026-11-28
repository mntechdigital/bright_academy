"use client";
import { updateMonthlyResult } from "@/src/services/monthlyResult";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { getGradeFromMarks } from "@/src/utils/gradeUtils";
import { getStudentGroup } from "@/src/utils/studentGroup";
import { getGroupSubjectLabel } from "@/src/utils/groupSubjects";
import {
  computeMonthlyResultSummary,
  getDefaultFullMarksForSubject,
} from "@/src/utils/monthlyResultSummary";
import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
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
  isAbsent?: boolean;
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
  ictPracticalAdded?: boolean;
}

interface FormValues {
  monthlyExamName: string;
  gpa: number;
  grade: string;
  position: string;
  present: number;
  absent: number;
  results: {
    id: string;
    subjectName: string;
    fullMarks: number;
    marks: number; // input mark: ICT exam mark for new class 9/10, otherwise stored total
    highestMark: number;
    grade: string;
    point: number;
    isAbsent: boolean;
  }[];
}

interface Props {
  result: MonthlyResult;
  classSubjects?: { id?: string; subjectName?: string; name?: string; fullMarks?: number }[];
}

export default function UpdateResultForm({ result, classSubjects = [] }: Props) {
  const router = useRouter();

  const studentGroup = getStudentGroup((result.student as any)?.stdRegNo || "");
  const studentClassName = result.student?.stdClass?.className || result.className || "";
  const isClass910 = /(9|10)/.test(String(studentClassName));
  const isOldClass910Result = isClass910 && new Date(result.createdAt).getTime() < new Date("2026-11-22T00:00:00+06:00").getTime();
  const [ictPracticalAdded, setIctPracticalAdded] = useState(!!result.ictPracticalAdded);
  const [ictPracticalJustAdded, setIctPracticalJustAdded] = useState(false);
  const originalMarksById = useMemo(() => {
    const map = new Map<string, number>();
    (result.results || []).forEach((r) => { map.set(r.id, r.isAbsent ? 0 : Number(r.marks) || 0); });
    return map;
  }, [result.results]);

  const { control, handleSubmit, setValue, getValues } = useForm<FormValues>({
    defaultValues: {
      monthlyExamName: result.monthlyExamName ?? "",
      gpa: result.gpa,
      grade: result.grade,
      position: result.position,
      present: result.present,
      absent: result.absent,
      results: result.results.map((r) => {
        const absent = !!r.isAbsent;
        const marks = absent ? 0 : r.marks;
        const fullMarks = Number(r.fullMarks) || getDefaultFullMarksForSubject(r.subjectName, studentClassName);
        const gradeInfo = (!absent && marks >= 0 && fullMarks > 0) ? getGradeFromMarks(marks, fullMarks) : { gradePoint: 0, letterGrade: "F" };
        return {
          id: r.id,
          subjectName: r.subjectName,
          fullMarks,
          marks,
          highestMark: r.highestMark,
          grade: absent ? "F" : gradeInfo.letterGrade,
          point: absent ? 0 : gradeInfo.gradePoint,
          isAbsent: absent,
        };
      }),
    },
  });

  const { fields } = useFieldArray({ control, name: "results" });

  const watchedResults = useWatch({ control, name: "results" });
  const summary = useMemo(() => computeMonthlyResultSummary({
    resultSubjects: (watchedResults || []).map((r: any) => {
      const storedMarks = r.isAbsent ? 0 : Number(r.marks);
      const fullMarks = Number(r.fullMarks) || getDefaultFullMarksForSubject(r.subjectName, studentClassName);
      return { ...r, marks: storedMarks, fullMarks, isAbsent: !!r.isAbsent };
    }) as any,
    classSubjects, group: studentGroup, classNumber: studentClassName, fallbackTotalMarks: result.totalMarks, createdAt: result.createdAt,
  }), [watchedResults, classSubjects, studentGroup, studentClassName, result.totalMarks, result.createdAt]);
  const totalAchieved = summary.obtained;
  const totalFull = summary.full;

  const recomputeRow = useCallback((index: number, override?: Partial<FormValues["results"][number]>) => {
    const row = { ...(getValues(`results.${index}`) as any), ...(override || {}) };
    const fullMarks = Number(row.fullMarks) || getDefaultFullMarksForSubject(row.subjectName, studentClassName);
    const absent = !!row.isAbsent;
    const entered = Number(row.marks);
    const storedMarks = absent ? 0 : entered;
    if (absent || !Number.isFinite(storedMarks)) {
      setValue(`results.${index}.grade`, absent ? "F" : "", { shouldDirty: true });
      setValue(`results.${index}.point`, absent ? 0 : 0, { shouldDirty: true });
      return;
    }
    const { gradePoint, letterGrade } = getGradeFromMarks(Math.max(0, storedMarks), fullMarks);
    setValue(`results.${index}.grade`, letterGrade, { shouldDirty: true });
    setValue(`results.${index}.point`, gradePoint, { shouldDirty: true });
  }, [getValues, setValue, studentClassName]);

  const handleMarksChange = useCallback(
    (index: number, marks: number, fullMarks: number, isAbsent = false) => {
      recomputeRow(index, { marks, fullMarks, isAbsent });
    },
    [recomputeRow]
  );

  // Recompute grade/point on load from marks+fullMarks (never trust stored grade/point).
  useEffect(() => {
    const rows = getValues("results") || [];
    rows.forEach((_, idx) => recomputeRow(idx));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-calculate overall GPA & grade whenever results change
  useEffect(() => {
    if (!watchedResults) return;
    setValue("gpa", summary.gpa);
    setValue("grade", summary.grade);
    const present = watchedResults.filter((r) => !r.isAbsent && String(r.marks).trim() !== "").length;
    const absent = Math.max(0, summary.subjectCount - present);
    setValue("present", present);
    setValue("absent", absent);
  }, [watchedResults, summary, setValue]);

  const onSubmit = async (data: FormValues) => {
    // Contract: for NEW class 9/10 practical subjects, client sends EXAM mark; server computes total once.
    const payload = {
      id: result.id,
      studentId: result.studentId,
      monthlyExamName: data.monthlyExamName,
      gpa: data.gpa,
      grade: data.grade,
      position: data.position,
      present: data.present,
      absent: data.absent,
      ictPracticalAdded: ictPracticalAdded || !!result.ictPracticalAdded,
      results: data.results.map((r) => {
        const exam = r.isAbsent ? 0 : Number(r.marks);
        const fullMarks = Number(r.fullMarks) || getDefaultFullMarksForSubject(r.subjectName, studentClassName);
        return {
          id: r.id,
          fullMarks,
          marks: exam,
          highestMark: Number(r.highestMark),
          grade: r.grade,
          point: Number(r.point),
          isAbsent: !!r.isAbsent,
        };
      }),
    };
    const res = await updateMonthlyResult(result.id, payload);
    console.log("update result res==>", res);
    if (res.statusCode === 200) {
      showSuccessToast("Result updated successfully!");
      router.refresh(); // server component-এর ডেটা রিভ্যালিডেট করে, রিলোড ছাড়াই আপডেট দেখাবে
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
            <div className="ml-auto text-right space-y-2">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Exam Name
                </label>
                <Controller
                  control={control}
                  name="monthlyExamName"
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter exam name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
                    />
                  )}
                />
              </div>
              <div>
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
                    {getGroupSubjectLabel(field.subjectName, studentGroup, studentClassName)}
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
                          // fullMarks বদলালে grade/point-ও রিক্যালকুলেট করতে হবে
                          const numericMarks = parseFloat(
                            String(watchedResults?.[index]?.marks ?? "")
                          );
                          const fullMarks = parseFloat(val);
                          handleMarksChange(index, numericMarks, fullMarks);
                        }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
                      />
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Marks</label>
                  <Controller
                    control={control}
                    name={`results.${index}.marks`}
                    render={({ field: f }) => (
                      <input
                        {...f}
                        type="text"
                        inputMode="numeric"
                        disabled={!!watchedResults?.[index]?.isAbsent}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          const fullMarks = parseFloat(String(watchedResults?.[index]?.fullMarks ?? 100));
                          const val = raw === "" ? "" : String(Math.min(fullMarks, Number(raw)));
                          f.onChange(val === "" ? 0 : Number(val));
                          const numericMarks = parseFloat(val || "0");
                          handleMarksChange(index, numericMarks, fullMarks, !!watchedResults?.[index]?.isAbsent);
                        }}
                        className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition ${watchedResults?.[index]?.isAbsent ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                      />
                    )}
                  />
                </div>

                <div className="col-span-1">
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
                          f.onChange(val === "" ? 0 : Number(val));
                        }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 transition"
                      />
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs text-gray-500 mb-1 block">Absent</label>
                  <Controller
                    control={control}
                    name={`results.${index}.isAbsent`}
                    render={({ field: f }) => (
                      <input
                        type="checkbox"
                        checked={!!f.value}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          f.onChange(checked);
                          if (checked) {
                            setValue(`results.${index}.marks`, 0, { shouldDirty: true });
                            recomputeRow(index, { marks: 0, isAbsent: true });
                          } else {
                            recomputeRow(index, { isAbsent: false });
                          }
                        }}
                        className="mt-2 h-4 w-4 accent-orange-500 cursor-pointer"
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
