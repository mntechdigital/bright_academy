"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { getWeeklyResultsByFilters } from "@/src/services/weeklyResult";
import { getExamRoutines } from "@/src/services/examRoutines";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { useForm, Controller } from "react-hook-form";
import { months } from "@/src/constant/weeklyResult.constant";
import {
  DEFAULT_EXAM_NAME,
  MARKS_PER_SUBJECT,
} from "@/src/constant/routine.constant";
import { compareByRegNoAsc } from "@/src/utils/sortStudents";

interface ClassData {
  id: string;
  className: string;
  batches?: { id: string; name: string; startTime: string; endTime: string }[];
  subjects?: { id: string; subjectName: string }[];
}

interface RoutineWeekRow {
  id: string;
  weekNo: number;
  weekLabel: string;
  totalMarks: number;
  subjects: {
    id: string;
    fullMarks: number;
    subject: { id: string; subjectName: string };
  }[];
}

interface ExamRoutineRow {
  id: string;
  examName: string;
  year: string;
  month: string | null;
  stdClass: { id: string; className: string };
  weeks: RoutineWeekRow[];
}

interface WeeklyResultFormProps {
  classesData?: ClassData[];
  // Marks already typed in the result table for the current sheet (lifted up).
  marksMap?: Record<string, string>;
  onResultCreated?: (data: any) => void;
  // Tells the parent to clear the typed marks when the class/year changes.
  onMarksClear?: () => void;
}

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

const WeeklyResultForm = ({
  classesData = [],
  marksMap = {},
  onResultCreated,
  onMarksClear,
}: WeeklyResultFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      month: "",
      week: "",
      publishedDate: new Date(),
      year: new Date().getFullYear().toString(),
      classId: "",
      batchId: "",
      subjectId: "",
      totalMarks: "",
    },
    mode: "onSubmit",
  });

  const selectedClassId = watch("classId");
  const selectedYear = watch("year");
  const selectedMonth = watch("month");
  const selectedWeek = watch("week");
  const selectedBatchId = watch("batchId");
  const selectedSubjectId = watch("subjectId");

  const selectedClass = classesData.find((cls) => cls.id === selectedClassId);
  const batches = selectedClass?.batches || [];

  const hasMarks = Object.keys(marksMap).length > 0;

  // ── Exam routine for the selected class + year ──────────────────────────
  // The routine is unique by class + exam name "LBE Weekly Exam Routine" +
  // year. Month is NOT part of the routine.
  const [routines, setRoutines] = useState<ExamRoutineRow[] | null>(null);
  const [routineLoading, setRoutineLoading] = useState(false);
  const [routineError, setRoutineError] = useState<string | null>(null);
  // Cached per class+year so changing only the week does not refetch.
  const routineCache = useRef(new Map<string, ExamRoutineRow[]>());

  const fetchRoutine = useCallback(async () => {
    if (!selectedClassId || !selectedYear) return;
    const cacheKey = `${selectedClassId}|${selectedYear}`;
    const cached = routineCache.current.get(cacheKey);
    if (cached) {
      setRoutines(cached);
      setRoutineLoading(false);
      setRoutineError(null);
      return;
    }
    setRoutineLoading(true);
    setRoutineError(null);
    try {
      const res = await getExamRoutines({ year: selectedYear, classId: selectedClassId });
      const list = Array.isArray(res?.data) ? res.data : [];
      routineCache.current.set(cacheKey, list);
      setRoutines(list);
    } catch {
      setRoutineError("Failed to load exam routine. Please try again.");
      setRoutines(null);
    } finally {
      setRoutineLoading(false);
    }
  }, [selectedClassId, selectedYear]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedClassId || !selectedYear) {
      setRoutines(null);
      setRoutineLoading(false);
      setRoutineError(null);
      return;
    }
    fetchRoutine();
    return () => {
      cancelled = true;
    };
  }, [selectedClassId, selectedYear, fetchRoutine]);

  const retryRoutine = useCallback(() => {
    fetchRoutine();
  }, [fetchRoutine]);

  const weeklyRoutine = useMemo(() => {
    if (!routines) return null;
    return routines.find((r) => r.examName === DEFAULT_EXAM_NAME) ?? null;
  }, [routines]);

  const routineResolved = routines !== null;
  const noRoutine =
    routineResolved && Boolean(selectedClassId && selectedYear && !weeklyRoutine);

  // Week options come only from the routine, sorted ascending by week number.
  // The submitted value is the week number (1..4), not the label.
  const weekOptions = useMemo(() => {
    if (!weeklyRoutine?.weeks?.length) return [];
    return [...weeklyRoutine.weeks]
      .filter((w) => w.weekNo != null)
      .sort((a, b) => a.weekNo - b.weekNo)
      .map((w) => ({
        value: w.weekNo,
        label: w.weekLabel || `Week ${w.weekNo}`,
      }));
  }, [weeklyRoutine]);

  const selectedWeekNum = selectedWeek ? Number(selectedWeek) : null;
  const matchedWeek = useMemo(() => {
    if (!weeklyRoutine || selectedWeekNum == null) return null;
    return weeklyRoutine.weeks.find((w) => w.weekNo === selectedWeekNum) ?? null;
  }, [weeklyRoutine, selectedWeekNum]);

  // Subjects scheduled in the selected week of the routine. Never falls back
  // to all subjects of the class.
  const routineSubjectOptions = useMemo(() => {
    if (!matchedWeek) return [];
    const list = (matchedWeek.subjects || [])
      .filter((item: any) => item?.subject?.id)
      .map((item: any) => ({
        id: item.subject.id,
        subjectName: item.subject.subjectName,
      }));
    return [...new Map(list.map((opt: any) => [opt.id, opt])).values()];
  }, [matchedWeek]);

  const subjectOptions = routineSubjectOptions;

  // Reset the selected subject whenever the week changes.
  // Track the previous week with a ref so we only clear when the week
  // actually changes — not when the admin merely picks a subject (which
  // would otherwise immediately wipe the selection).
  const prevWeekRef = useRef(selectedWeek);
  useEffect(() => {
    const prevWeek = prevWeekRef.current;
    const weekChanged = prevWeek !== undefined && prevWeek !== selectedWeek;
    prevWeekRef.current = selectedWeek;
    if (weekChanged && selectedWeek) {
      setValue("subjectId", "");
    }
  }, [selectedWeek, setValue]);

  // Auto-fill Total Marks from the selected subject's entry in the routine
  // week (25 marks per subject). Read-only afterwards. Empty until a subject
  // is selected because the value depends on the subject.
  useEffect(() => {
    if (!selectedSubjectId || !matchedWeek) {
      setValue("totalMarks", "");
      return;
    }
    const subjectEntry = matchedWeek.subjects.find(
      (s) => String(s.subject.id) === String(selectedSubjectId)
    );
    const totalMarks = subjectEntry?.fullMarks ?? MARKS_PER_SUBJECT;
    setValue("totalMarks", String(totalMarks));
  }, [matchedWeek, selectedSubjectId, setValue]);

  // ── Class / Year change: clear week, subject and typed marks ────────────
  // Changing Class or Year clears the selected Week, the selected Subject and
  // any marks already typed. If marks were typed, confirmation is required.
  const identityRef = useRef(`${selectedClassId}|${selectedYear}`);
  const [pendingIdentity, setPendingIdentity] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const newIdentity = `${selectedClassId}|${selectedYear}`;
    const oldIdentity = identityRef.current;
    if (newIdentity === oldIdentity) return;

    const [oldClass] = oldIdentity.split("|");
    // No real class was selected yet (initial render), nothing to clear.
    if (!oldClass) {
      identityRef.current = newIdentity;
      return;
    }

    if (hasMarks) {
      setPendingIdentity(newIdentity);
      // Revert the form to the previous selection until the admin confirms.
      setValue("classId", oldClass);
      setValue("year", oldIdentity.split("|")[1]);
      setShowResetConfirm(true);
      return;
    }

    setValue("week", "");
    setValue("subjectId", "");
    setValue("totalMarks", "");
    identityRef.current = newIdentity;
  }, [selectedClassId, selectedYear, hasMarks, setValue]);

  const handleResetConfirm = useCallback(
    (confirmed: boolean) => {
      setShowResetConfirm(false);
      if (!pendingIdentity) return;
      if (confirmed) {
        identityRef.current = pendingIdentity;
        const [newClass, newYear] = pendingIdentity.split("|");
        setValue("classId", newClass);
        setValue("year", newYear);
        setValue("week", "");
        setValue("subjectId", "");
        setValue("totalMarks", "");
        onMarksClear?.();
      }
      setPendingIdentity(null);
    },
    [pendingIdentity, setValue, onMarksClear]
  );

  // ── Duplicate hint (nice to have) ───────────────────────────────────────
  // Shows a non-blocking "Already entered" hint when marks for the same
  // class + year + month + week + subject already exist.
  const [duplicateHint, setDuplicateHint] = useState<string | null>(null);
  useEffect(() => {
    if (
      !selectedClassId ||
      !selectedYear ||
      !selectedMonth ||
      !selectedWeek ||
      !selectedSubjectId
    ) {
      setDuplicateHint(null);
      return;
    }
    let cancelled = false;
    getWeeklyResultsByFilters({
      stdClassId: selectedClassId,
      subjectId: selectedSubjectId,
      ...(selectedBatchId ? { batchId: selectedBatchId } : {}),
      week: String(selectedWeek),
      month: selectedMonth,
      year: selectedYear,
    })
      .then((res) => {
        if (cancelled) return;
        const data = res?.data?.data || [];
        setDuplicateHint(data.length > 0 ? "Already entered" : null);
      })
      .catch(() => setDuplicateHint(null));
    return () => {
      cancelled = true;
    };
  }, [
    selectedClassId,
    selectedYear,
    selectedMonth,
    selectedWeek,
    selectedSubjectId,
    selectedBatchId,
  ]);

  const weekDisabled =
    !selectedClassId || !selectedYear || routineLoading || noRoutine;

  const weekPlaceholder = useMemo(() => {
    if (!selectedClassId || !selectedYear) return "Select class and year first";
    if (noRoutine) return "No routine found";
    return "Select Week";
  }, [selectedClassId, selectedYear, noRoutine]);

  const onSubmit = async (data: any) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form submitted with data:", data);

    if (
      !data.month ||
      !data.week ||
      !data.publishedDate ||
      !data.year ||
      !data.classId ||
      !data.subjectId ||
      !data.totalMarks
    ) {
      console.error("Validation failed - missing required fields");
      showErrorToast("Please fill in all required fields");
      return;
    }

    if (noRoutine) {
      showErrorToast(
        "No weekly routine found for this class and year. Create it in Routine first."
      );
      return;
    }

    const selectedClass = classesData.find((cls) => cls.id === data.classId);
    const className = selectedClass?.className || "";

    const selectedBatch = selectedClass?.batches?.find(
      (batch) => batch.id === data.batchId
    );
    const batchName = selectedBatch?.name || "";

    const selectedSubject = selectedClass?.subjects?.find(
      (subject) => subject.id === data.subjectId
    );
    const subjectName = selectedSubject?.subjectName || "";

    // The submitted week value is the number (1..4). Store it as a string so
    // it matches the String week column used across the app/API.
    const formData = {
      month: data.month,
      week: String(data.week),
      publishedDate: data.publishedDate ? data.publishedDate.toISOString() : undefined,
      year: data.year,
      stdClassId: data.classId,
      className: className,
      batchId: data.batchId,
      batchName: batchName,
      subjectId: data.subjectId,
      subjectName: subjectName,
      totalMarks: parseInt(data.totalMarks, 10),
    };

    console.log("Form data prepared - Fetching students:", formData);

    try {
      // Fetch students based on form data (class and batch)
      const { getStudents } = await import("@/src/services/students");

      const query = [
        {
          key: "orderBy",
          value: JSON.stringify({ stdRegNo: "asc" }),
        },
        { key: "page", value: "1" },
        { key: "limit", value: "1000" },
        { key: "filter", value: JSON.stringify({ classId: data.classId }) },
      ];

      console.log("Fetching students with query:", query);

      const studentRes = await getStudents(query);
      const allStudents = studentRes?.data?.data || [];

      console.log("Students fetched:", allStudents);

      // Filter students by batch if batch is selected
      let filteredStudents = data.batchId
        ? allStudents.filter((student: any) => {
            const studentBatchId = student.batch?.id || student.batchId || "";
            return String(studentBatchId) === String(data.batchId);
          })
        : [...allStudents];

      // Ensure ascending NUMERIC order by Student's ID (stdRegNo) even if
      // backend order changes
      filteredStudents.sort(compareByRegNoAsc);

      console.log("Filtered students:", filteredStudents);

      if (filteredStudents.length === 0) {
        showErrorToast("No students found for the selected class/batch");
        return;
      }

      showSuccessToast(
        `Found ${filteredStudents.length} students. Loading result table...`
      );

      // Trigger refresh to show the table with student data AND the fetched
      // students
      onResultCreated?.({ ...formData, students: filteredStudents });

      console.log("=== FORM SUBMISSION COMPLETED - Table will be shown ===");
    } catch (error) {
      console.error("Error fetching students:", error);
      showErrorToast("Failed to fetch students. Please try again.");
    }
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Class
            </label>
            <div className="relative">
              <Controller
                name="classId"
                control={control}
                rules={{ required: "Class is required" }}
                render={({ field }) => (
                  <>
                    <select
                      {...field}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                    >
                      <option value="">Select Class</option>
                      {classesData.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.className}
                        </option>
                      ))}
                    </select>
                    {errors.classId && (
                      <span className="text-red-500 text-xs">{errors.classId.message}</span>
                    )}
                  </>
                )}
              />
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Batch <span className="text-gray-400 font-normal">
                (Optional - leave empty for whole class)
              </span>
            </label>
            <div className="relative">
              <Controller
                name="batchId"
                control={control}
                render={({ field }) => (
                  <>
                    <select
                      {...field}
                      disabled={!selectedClassId}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">All Batches (Whole Class)</option>
                      {batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                          {batch.name} ({formatTime(batch.startTime)} - {formatTime(batch.endTime)})
                        </option>
                      ))}
                    </select>
                    {errors.batchId && (
                      <span className="text-red-500 text-xs">{errors.batchId.message}</span>
                    )}
                  </>
                )}
              />
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Year
            </label>
            <div className="relative">
              <Controller
                name="year"
                control={control}
                rules={{ required: "Year is required" }}
                render={({ field }) => (
                  <>
                    <select
                      {...field}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.year && (
                      <span className="text-red-500 text-xs">{errors.year.message}</span>
                    )}
                  </>
                )}
              />
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Month
            </label>
            <div className="relative">
              <Controller
                name="month"
                control={control}
                rules={{ required: "Month is required" }}
                render={({ field }) => (
                  <>
                    <select
                      {...field}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                    >
                      <option value="">Select Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    {errors.month && (
                      <span className="text-red-500 text-xs">{errors.month.message}</span>
                    )}
                  </>
                )}
              />
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Week
          </label>
          <div className="relative">
            <Controller
              name="week"
              control={control}
              rules={{ required: "Week is required" }}
              render={({ field }) => (
                <>
                  <select
                    {...field}
                    disabled={weekDisabled}
                    className={`w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] ${
                      weekDisabled
                        ? "bg-gray-100 disabled:cursor-not-allowed text-gray-500"
                        : "bg-white"
                    }`}
                  >
                    <option value="">{weekPlaceholder}</option>
                    {weekOptions.map((w) => (
                      <option key={w.value} value={w.value}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                  {errors.week && (
                    <span className="text-red-500 text-xs">{errors.week.message}</span>
                  )}
                </>
              )}
            />
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
            />
          </div>
          {routineLoading && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading exam routine…
            </div>
          )}
          {routineError && (
            <div className="mt-2 p-3 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> {routineError}
              <Button
                type="button"
                size="sm"
                onClick={retryRoutine}
                className="ml-auto text-red-700 hover:text-red-900 border-transparent bg-transparent p-1"
              >
                Retry
              </Button>
            </div>
          )}
          {noRoutine && (
            <div className="mt-2 p-3 rounded-lg border border-orange-200 bg-orange-50 text-orange-800 text-sm">
              No weekly routine found for this class and year. Create it in Routine first.
              <Link
                href="/dashboard/routine"
                className="text-[#F97316] font-medium hover:underline ml-2"
              >
                Go to Routine
              </Link>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Published Date
          </label>
          <Controller
            name="publishedDate"
            control={control}
            rules={{ required: "Published date is required" }}
            render={({ field }) => (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 h-auto text-sm text-gray-700 font-normal hover:bg-white focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                    >
                      {field.value ? (
                        format(field.value, "MMMM d, yyyy")
                      ) : (
                        <span className="text-gray-400">Select Date</span>
                      )}
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.publishedDate && (
                  <span className="text-red-500 text-xs">{errors.publishedDate.message}</span>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Subject
          </label>
          <div className="relative">
            <Controller
              name="subjectId"
              control={control}
              rules={{ required: "Subject is required" }}
              render={({ field }) => (
                <>
                  <select
                    {...field}
                    disabled={!selectedWeek}
                    className={`w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] ${
                      !selectedWeek
                        ? "bg-gray-100 disabled:cursor-not-allowed text-gray-500"
                        : "bg-white"
                    }`}
                  >
                    <option value="">Select Subject</option>
                    {subjectOptions.map((subject: any) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.subjectName}
                      </option>
                    ))}
                  </select>
                  {errors.subjectId && (
                    <span className="text-red-500 text-xs">{errors.subjectId.message}</span>
                  )}
                  {duplicateHint && (
                    <p className="mt-1 text-xs text-orange-600">{duplicateHint}</p>
                  )}
                </>
              )}
            />
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Total Marks
          </label>
          <div className="relative">
            <Controller
              name="totalMarks"
              control={control}
              rules={{
                required: "Total marks is required",
                validate: (value) => {
                  const num = Number(value);
                  return (
                    (!isNaN(num) && Number.isInteger(num)) ||
                    "Total marks must be an integer"
                  );
                },
              }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    readOnly
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                  {errors.totalMarks && (
                    <span className="text-red-500 text-xs">{errors.totalMarks.message}</span>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-filled from the exam routine ({MARKS_PER_SUBJECT}
                    marks per subject).
                  </p>
                </>
              )}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className=" w-full bg-[#F97316] text-white py-3 rounded-lg hover:bg-[#ea580c] transition-all disabled:opacity-60"
            disabled={isSubmitting || noRoutine}
          >
            {isSubmitting ? "Submitting..." : "Create Weekly Result"}
          </button>
        </div>
      </form>

      <Dialog open={showResetConfirm} onOpenChange={(open) => {
        if (!open) setPendingIdentity(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm change</DialogTitle>
            <DialogDescription>
              Changing the class or year will clear the selected week, subject
              and any marks already typed. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => handleResetConfirm(false)} variant="outline">
              Cancel
            </Button>
            <Button type="button" onClick={() => handleResetConfirm(true)}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WeeklyResultForm;
