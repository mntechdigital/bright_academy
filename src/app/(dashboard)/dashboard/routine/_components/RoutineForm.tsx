"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LayoutDashboard,
  ChevronRight,
  ChevronDown,
  Save,
  Loader2,
  DoorOpenIcon,
  Plus,
  X,
  AlertTriangle,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import {
  addExamRoutineWeeks,
  createExamRoutine,
  getExamRoutineById,
  getExamRoutines,
  updateExamRoutine,
} from "@/src/services/examRoutines";
import { getClasses } from "@/src/services/classes";
import {
  DEFAULT_EXAM_NAME,
  MARKS_PER_SUBJECT,
  SUBJECTS_PER_WEEK,
  TOTAL_MARKS_PER_WEEK,
} from "@/src/constant/routine.constant";
import WeekCard, { parsePositiveInt } from "./WeekCard";
import {
  ClassOption,
  ExamRoutineRow,
  RoutineHeaderValues,
  SubjectInput,
  WeekInput,
} from "./routine.types";

interface RoutineFormProps {
  routineId?: string;
}

const makeSubject = (key: string): SubjectInput => ({
  key,
  subjectId: "",
  alternatives: [],
});

// A week always holds exactly SUBJECTS_PER_WEEK fixed subject rows.
const makeSubjectRows = (weekKey: string, count = SUBJECTS_PER_WEEK) =>
  Array.from({ length: count }, (_, index) => makeSubject(`${weekKey}-s${index}`));

const makeWeek = (key: string, weekNo: number): WeekInput => ({
  key,
  weekNo: String(weekNo),
  weekLabel: "",
  durationHours: "",
  open: true,
  subjects: makeSubjectRows(key),
  legacySubjectCount: false,
});

// Highest gap in [1..max] that is not already taken, so "Add Week" proposes a
// sensible free slot instead of always max + 1.
const nextFreeWeekNo = (taken: number[]): number => {
  const used = new Set(taken);
  for (let candidate = 1; ; candidate += 1) {
    if (!used.has(candidate)) return candidate;
  }
};

const RoutineForm = ({ routineId }: RoutineFormProps) => {
  const router = useRouter();
  const isEdit = !!routineId;
  const [isPending, startTransition] = useTransition();
  const [classesData, setClassesData] = useState<ClassOption[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [weeks, setWeeks] = useState<WeekInput[]>([makeWeek("w0", 1)]);
  const [pendingClassId, setPendingClassId] = useState<string | null>(null);
  // Routine that already exists for the chosen class + exam name + year.
  // When set, the form appends weeks to it instead of creating a new routine.
  const [existingRoutine, setExistingRoutine] =
    useState<ExamRoutineRow | null>(null);
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const keyCounter = useRef(1);

  const nextKey = (prefix: string) => {
    const key = `${prefix}${keyCounter.current}`;
    keyCounter.current += 1;
    return key;
  };

  const form = useForm<RoutineHeaderValues>({
    defaultValues: {
      classId: "",
      year: new Date().getFullYear().toString(),
    },
    mode: "onSubmit",
  });

  const selectedClassId = form.watch("classId");
  const watchedYear = form.watch("year");
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(false);
  const selectedClass = classesData.find((cls) => cls.id === selectedClassId);
  const subjectOptions = selectedClass?.subjects ?? [];
  const hasEnoughSubjects = subjectOptions.length >= SUBJECTS_PER_WEEK;

  // Week numbers already stored on the matched routine (ascending).
  const existingWeekNos = React.useMemo(() => {
    if (!existingRoutine) return [];
    const numbers =
      existingRoutine.weekNumbers ??
      existingRoutine.weeks.map((week) => week.weekNo);
    return [...numbers].sort((a, b) => a - b);
  }, [existingRoutine]);

  const appendToExisting = !!existingRoutine;

  // Load classes (with their subjects) for the class/subject selects.
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClasses([
          { key: "orderBy", value: JSON.stringify({ createdAt: "asc" }) },
          { key: "limit", value: "1000" },
        ]);
        if (Array.isArray(res?.data?.data)) {
          setClassesData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        showErrorToast("Failed to load classes.");
      }
    };
    fetchClasses();
  }, []);

  // Class subjects arrive eagerly with the class list; this only reflects the
  // fetch window so the dropdowns can show a loading state.
  useEffect(() => {
    if (!selectedClassId) {
      setIsSubjectsLoading(false);
      return;
    }
    setIsSubjectsLoading(classesData.length === 0);
  }, [selectedClassId, classesData.length]);

  // Load the routine in edit mode.
  useEffect(() => {
    if (!routineId) return;
    const fetchRoutine = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await getExamRoutineById(routineId);
        const routine: ExamRoutineRow | undefined = res?.data;
        if (!routine?.id) {
          setLoadError(res?.message || "Failed to load exam routine.");
          return;
        }
        form.reset({
          classId: routine.stdClass?.id || "",
          year: routine.year || "",
        });

        setWeeks(
          routine.weeks.map((week, weekIndex) => ({
            key: `w${weekIndex}`,
            weekNo: String(week.weekNo),
            weekLabel:
              week.weekLabel === `Week ${week.weekNo}` ? "" : week.weekLabel,
            durationHours:
              week.durationHours === null || week.durationHours === undefined
                ? ""
                : String(week.durationHours),
            open: weekIndex === 0,
            legacySubjectCount: week.subjects.length !== SUBJECTS_PER_WEEK,
            subjects: [
              // Keep every stored subject, then pad up to the fixed row count so
              // nothing is silently dropped from an edited routine. Whether a
              // subject is still offered by the class is decided at render time
              // from the class's subject list.
              ...week.subjects.map((subject, subjectIndex) => ({
                key: `w${weekIndex}-s${subjectIndex}`,
                subjectId: subject.subject?.id || "",
                storedDisplayName:
                  subject.displayName || subject.subject?.subjectName || "",
                alternatives: (subject.alternatives ?? []).map((alt) => ({
                  name: alt.name,
                  streams: [...alt.streams],
                })),
              })),
              ...makeSubjectRows(
                `w${weekIndex}`,
                Math.max(0, SUBJECTS_PER_WEEK - week.subjects.length)
              ),
            ],
          }))
        );
        keyCounter.current = 1000;
      } catch (error) {
        console.error("Failed to load exam routine:", error);
        setLoadError("Failed to load exam routine.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routineId]);

  // Detect an existing routine for the chosen class + DEFAULT_EXAM_NAME + year
  // so the form can switch to "append weeks" instead of failing with a 409.
  useEffect(() => {
    if (isEdit) return;

    const examName = DEFAULT_EXAM_NAME;
    const year = watchedYear.trim();
    const classId = selectedClassId;

    if (!classId || !/^\d{4}$/.test(year)) {
      setExistingRoutine(null);
      return;
    }

    let cancelled = false;
    setIsCheckingExisting(true);

    const check = async () => {
      try {
        const res = await getExamRoutines({ classId, examName, year });
        if (cancelled) return;
        const match = Array.isArray(res?.data)
          ? (res.data as ExamRoutineRow[])[0]
          : undefined;
        setExistingRoutine(match?.id ? match : null);
      } catch (error) {
        console.error("Failed to look up existing exam routine:", error);
        if (!cancelled) setExistingRoutine(null);
      } finally {
        if (!cancelled) setIsCheckingExisting(false);
      }
    };
    check();

    return () => {
      cancelled = true;
    };
  }, [isEdit, selectedClassId, watchedYear]);

  // ---- week / subject / alternative state helpers ----
  const patchWeek = (weekKey: string, patch: Partial<WeekInput>) => {
    setWeeks((prev) =>
      prev.map((week) =>
        week.key === weekKey ? { ...week, ...patch } : week
      )
    );
  };

  const addWeek = () => {
    setWeeks((prev) => {
      // Skip week numbers already stored on the existing routine so "Add Week"
      // proposes the first free slot (e.g. 1 when only Week 4 exists).
      const taken = [
        ...existingWeekNos,
        ...prev
          .map((week) => parsePositiveInt(week.weekNo))
          .filter((value): value is number => value !== null),
      ];
      const key = nextKey("w");
      return [...prev, makeWeek(key, nextFreeWeekNo(taken))];
    });
  };

  const removeWeek = (weekKey: string) => {
    setWeeks((prev) => {
      if (prev.length <= 1) {
        showErrorToast("A routine must have at least one week.");
        return prev;
      }
      return prev.filter((week) => week.key !== weekKey);
    });
  };

  const handleSubjectSelect = (
    weekKey: string,
    subjectKey: string,
    subjectId: string
  ) => {
    setWeeks((prev) =>
      prev.map((week) =>
        week.key !== weekKey
          ? week
          : {
              ...week,
              // Replacing a legacy subject clears its "not in list" warning.
              legacySubjectCount: false,
              subjects: week.subjects.map((subject) =>
                subject.key === subjectKey
                  ? {
                      ...subject,
                      subjectId,
                      storedDisplayName:
                        subjectOptions.find((opt) => opt.id === subjectId)
                          ?.subjectName ?? "",
                    }
                  : subject
              ),
            }
      )
    );
  };


  // ---- class change with warning ----
  const requestClassChange = (nextClassId: string) => {
    if (isEdit) return; // class is locked in edit mode (API rejects changes)
    const hasSelections = weeks.some((week) =>
      week.subjects.some((subject) => subject.subjectId)
    );
    if (hasSelections && nextClassId !== selectedClassId) {
      setPendingClassId(nextClassId);
    } else {
      form.setValue("classId", nextClassId);
    }
  };

  const confirmClassChange = () => {
    if (pendingClassId === null) return;
    const nextClassId = pendingClassId;
    setPendingClassId(null);
    form.setValue("classId", nextClassId);
    // Subjects belong to a specific class, so every selection (and any
    // stream alternative) is cleared when the class changes.
    setWeeks((prev) =>
      prev.map((week) => ({
        ...week,
        subjects: makeSubjectRows(week.key, week.subjects.length),
      }))
    );
  };

  // ---- submit ----
  const onSubmit: SubmitHandler<RoutineHeaderValues> = async (header) => {
    if (!header.classId) {
      showErrorToast("Class is required.");
      return;
    }
    if (!/^\d{4}$/.test(header.year.trim())) {
      showErrorToast("Year must be a 4-digit string.");
      return;
    }
    if (weeks.length === 0) {
      showErrorToast("Add at least one week.");
      return;
    }
    if (isSubjectsLoading) {
      showErrorToast("Subjects are still loading. Please wait.");
      return;
    }
    if (subjectOptions.length === 0) {
      showErrorToast(
        "No subjects found for this class. Add subjects to the class first."
      );
      return;
    }
    if (!hasEnoughSubjects) {
      showErrorToast(
        `This class has only ${subjectOptions.length} subject(s), but a week requires exactly ${SUBJECTS_PER_WEEK}. Add more subjects to the class first.`
      );
      return;
    }

    const subjectNameById = new Map(
      subjectOptions.map((opt) => [opt.id, opt.subjectName])
    );

    const seenWeekNos = new Set<number>();
    const payloadWeeks: {
      weekNo: number;
      weekLabel?: string;
      totalMarks: number;
      durationHours: number | null;
      subjects: {
        subjectId: string;
        displayName?: string;
        fullMarks: number;
        alternatives: { name: string; streams: string[] }[];
      }[];
    }[] = [];

    for (let index = 0; index < weeks.length; index += 1) {
      const week = weeks[index];
      const label = `week ${index + 1}`;
      const weekNo = parsePositiveInt(week.weekNo);
      if (weekNo === null) {
        showErrorToast(`Week no. must be a positive integer (${label}).`);
        return;
      }
      if (seenWeekNos.has(weekNo)) {
        showErrorToast(`Duplicate week no. ${weekNo}: must be unique.`);
        return;
      }
      // When appending, block week numbers the routine already stores so the
      // user gets an inline error instead of a 409 from the server.
      if (existingWeekNos.includes(weekNo)) {
        showErrorToast(
          `Week ${weekNo} already exists in this routine (${label}). Pick a different week no.`
        );
        return;
      }
      seenWeekNos.add(weekNo);

      let durationHours: number | null = null;
      if (week.durationHours.trim() !== "") {
        const parsed = parsePositiveInt(week.durationHours);
        if (parsed === null) {
          showErrorToast(
            `Duration hours must be a positive integer or empty (${label}).`
          );
          return;
        }
        durationHours = parsed;
      }

      if (week.subjects.length !== SUBJECTS_PER_WEEK) {
        showErrorToast(
          `A week must have exactly ${SUBJECTS_PER_WEEK} subjects, but ${label} has ${week.subjects.length}.`
        );
        return;
      }

      const seenSubjectIds = new Set<string>();
      const payloadSubjects: (typeof payloadWeeks)[number]["subjects"] = [];
      for (const [rowIndex, subject] of week.subjects.entries()) {
        const rowLabel = `${label}, subject ${rowIndex + 1}`;
        if (!subject.subjectId) {
          showErrorToast(
            `Select a subject for every row (${rowLabel}). All ${SUBJECTS_PER_WEEK} subjects are required.`
          );
          return;
        }
        const subjectName = subjectNameById.get(subject.subjectId);
        if (!subjectName) {
          showErrorToast(
            `The subject selected in ${rowLabel} is not in this class's subject list. Pick a different one.`
          );
          return;
        }
        if (seenSubjectIds.has(subject.subjectId)) {
          showErrorToast(
            `The same subject cannot appear twice in the same week (${rowLabel}).`
          );
          return;
        }
        seenSubjectIds.add(subject.subjectId);

        const alternatives = [];
        for (const alt of subject.alternatives) {
          if (!alt.name.trim()) {
            showErrorToast(
              `Alternative names cannot be empty (${rowLabel}). Remove the row or fill it in.`
            );
            return;
          }
          alternatives.push({ name: alt.name.trim(), streams: alt.streams });
        }

        // Marks and display name are derived from the chosen subject.
        payloadSubjects.push({
          subjectId: subject.subjectId,
          displayName: subjectName,
          fullMarks: MARKS_PER_SUBJECT,
          alternatives,
        });
      }

      const weekLabel = week.weekLabel.trim();
      payloadWeeks.push({
        weekNo,
        ...(weekLabel ? { weekLabel } : {}),
        // Always the sum of the fixed subject marks.
        totalMarks: TOTAL_MARKS_PER_WEEK,
        durationHours,
        subjects: payloadSubjects,
      });
    }

    startTransition(async () => {
      if (isEdit && routineId) {
        // `month` is intentionally omitted so the backend keeps the stored
        // value instead of wiping it.
        const res = await updateExamRoutine(routineId, {
          examName: DEFAULT_EXAM_NAME,
          year: header.year.trim(),
          weeks: payloadWeeks,
        });
        if (res?.statusCode === 200) {
          showSuccessToast(res.message || "Exam routine updated successfully!");
          router.push("/dashboard/routine");
        } else {
          showErrorToast(res?.message || "Failed to update exam routine.");
        }
        return;
      }

      // The routine already exists for this class + exam name + year: append
      // the new weeks to it rather than attempting a second create.
      if (existingRoutine) {
        const res = await addExamRoutineWeeks(existingRoutine.id, {
          weeks: payloadWeeks,
        });
        if (res?.statusCode === 201) {
          showSuccessToast(
            res.message ||
              `Added ${payloadWeeks.length} week(s) to the existing routine.`
          );
          router.push("/dashboard/routine");
        } else {
          showErrorToast(res?.message || "Failed to add weeks to exam routine.");
        }
        return;
      }

      const res = await createExamRoutine({
        examName: DEFAULT_EXAM_NAME,
        year: header.year.trim(),
        classId: header.classId,
        weeks: payloadWeeks,
      });
      if (res?.statusCode === 201) {
        showSuccessToast(res.message || "Exam routine created successfully!");
        router.push("/dashboard/routine");
      } else {
        showErrorToast(res?.message || "Failed to create exam routine.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading exam routine...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6">
        <p className="text-red-500 mb-4">{loadError}</p>
        <Link
          href="/dashboard/routine"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          Back to routines
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Overview</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <Link
          href="/dashboard/routine"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <DoorOpenIcon className="h-4 w-4" />
          <span>Routine</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">
          {isEdit ? "Edit Routine" : "Create Routine"}
        </span>
      </nav>

      <h1 className="text-2xl font-bold text-foreground mb-6">
        {isEdit ? "Edit Exam Routine" : "Create Exam Routine"}
      </h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            (e.target as HTMLElement).tagName !== "TEXTAREA" &&
            (e.target as HTMLElement).tagName !== "INPUT"
          ) {
            e.preventDefault();
          }
        }}
        className="max-w-full space-y-6"
      >
        {/* Header fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Exam name
            </label>
            <div className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600">
              {DEFAULT_EXAM_NAME}
              <p className="mt-1 text-xs text-gray-500">
                Fixed for this routine form.
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Class<span className="text-red-500">*</span>
            </label>
            <Controller
              name="classId"
              control={form.control}
              rules={{ required: "Class is required" }}
              render={({ field, fieldState: { error } }) => (
                <div className="relative">
                  <select
                    {...field}
                    disabled={isEdit}
                    onChange={(e) => {
                      if (isEdit) return;
                      requestClassChange(e.target.value);
                    }}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Select Class</option>
                    {classesData.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.className}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                  )}
                  {isEdit && (
                    <p className="mt-1 text-xs text-gray-500">
                      The class cannot be changed after creation. Duplicate the
                      routine to another class instead.
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Year<span className="text-red-500">*</span>
            </label>
            <Controller
              name="year"
              control={form.control}
              rules={{
                required: "Year is required",
                pattern: {
                  value: /^\d{4}$/,
                  message: "Year must be a 4-digit string",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    placeholder="2026"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Existing routine detected — weeks will be appended, not re-created. */}
        {appendToExisting && existingRoutine && (
          <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Routine already exists — new weeks will be added to it.
                </p>
                <p className="text-sm text-amber-700">
                  &quot;{existingRoutine.examName}&quot; for year{" "}
                  {existingRoutine.year} · {existingRoutine.stdClass?.className}{" "}
                  already has {existingWeekNos.length} week(s):{" "}
                  <span className="font-medium">
                    {existingWeekNos.join(", ") || "none"}
                  </span>
                  . Saving will append these weeks to the existing routine.
                </p>
              </div>
            </div>
            <Link
              href={`/dashboard/routine/edit/${existingRoutine.id}`}
              className="shrink-0 whitespace-nowrap text-sm font-medium text-amber-800 underline hover:text-amber-900"
            >
              Open existing routine
            </Link>
          </div>
        )}

        {isCheckingExisting && (
          <p className="text-sm text-gray-500">Checking for an existing routine...</p>
        )}

        {/* Weeks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Weeks ({weeks.length})
              {appendToExisting && existingWeekNos.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  existing: {existingWeekNos.join(", ")}
                </span>
              )}
            </h2>
            <button
              type="button"
              onClick={addWeek}
              className="inline-flex items-center gap-1 px-4 py-2 border border-orange-300 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Week
            </button>
          </div>

          {!selectedClassId && (
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              Select a class first — subject lists are loaded per class.
            </p>
          )}

          {[...weeks]
            .sort((a, b) => {
              const aNo = parsePositiveInt(a.weekNo);
              const bNo = parsePositiveInt(b.weekNo);
              if (aNo === null) return 1;
              if (bNo === null) return -1;
              return aNo - bNo;
            })
            .map((week, index) => (
            <WeekCard
              key={week.key}
              week={week}
              weekIndex={index}
              existingWeekNos={existingWeekNos}
              subjectOptions={subjectOptions}
              subjectsLoading={isSubjectsLoading}
              onChange={patchWeek}
              onRemove={removeWeek}
              onSubjectSelect={handleSubjectSelect}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-lg bg-[#F97316] py-3 font-semibold text-white transition-all hover:bg-[#EA580C] h-12 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEdit
                  ? "Update Routine"
                  : appendToExisting
                    ? "Add Weeks to Existing Routine"
                    : "Create Routine"}
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/dashboard/routine")}
            className="rounded-lg bg-red-500 py-3 font-semibold text-white transition-all hover:bg-red-600 h-12 px-6 cursor-pointer"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </form>

      {/* Class-change warning */}
      <Dialog
        open={pendingClassId !== null}
        onOpenChange={(open) => !open && setPendingClassId(null)}
      >
        <DialogContent className="bg-[#18181b] text-white border border-[#232326]">
          <DialogHeader>
            <DialogTitle className="text-white">Change class?</DialogTitle>
            <DialogDescription className="text-gray-300">
              Changing the class will clear every selected subject, display
              name and alternative in all weeks, because subjects belong to a
              specific class. Week numbers, marks and labels are kept.
            </DialogDescription>
            <div className="flex justify-end space-x-2 mt-4">
              <DialogClose asChild>
                <Button className="bg-[#232326] text-gray-200 hover:bg-[#2c2c31] border border-[#232326] cursor-pointer">
                  Keep class
                </Button>
              </DialogClose>
              <Button
                onClick={confirmClassChange}
                className="bg-[#F97316] text-white hover:bg-[#EA580C] border border-[#F97316] cursor-pointer"
              >
                Change and clear subjects
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoutineForm;
