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
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import {
  createExamRoutine,
  getExamRoutineById,
  updateExamRoutine,
} from "@/src/services/examRoutines";
import { getClasses } from "@/src/services/classes";
import WeekCard, { parsePositiveInt } from "./WeekCard";
import {
  AlternativeInput,
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
  displayName: "",
  displayNameTouched: false,
  fullMarks: "",
  expanded: false,
  alternatives: [],
});

const makeWeek = (key: string, weekNo: number): WeekInput => ({
  key,
  weekNo: String(weekNo),
  weekLabel: "",
  totalMarks: "",
  durationHours: "",
  open: true,
  subjects: [makeSubject(`${key}-s0`)],
});

const RoutineForm = ({ routineId }: RoutineFormProps) => {
  const router = useRouter();
  const isEdit = !!routineId;
  const [isPending, startTransition] = useTransition();
  const [classesData, setClassesData] = useState<ClassOption[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [weeks, setWeeks] = useState<WeekInput[]>([makeWeek("w0", 1)]);
  const [pendingClassId, setPendingClassId] = useState<string | null>(null);
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
      examName: "",
      month: "",
    },
    mode: "onSubmit",
  });

  const selectedClassId = form.watch("classId");
  const selectedClass = classesData.find((cls) => cls.id === selectedClassId);
  const subjectOptions = selectedClass?.subjects ?? [];

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
          examName: routine.examName || "",
          month: routine.month || "",
        });
        setWeeks(
          routine.weeks.map((week, weekIndex) => ({
            key: `w${weekIndex}`,
            weekNo: String(week.weekNo),
            weekLabel:
              week.weekLabel === `Week ${week.weekNo}` ? "" : week.weekLabel,
            totalMarks: String(week.totalMarks),
            durationHours:
              week.durationHours === null || week.durationHours === undefined
                ? ""
                : String(week.durationHours),
            open: weekIndex === 0,
            subjects: week.subjects.map((subject, subjectIndex) => ({
              key: `w${weekIndex}-s${subjectIndex}`,
              subjectId: subject.subject?.id || "",
              displayName: subject.displayName || "",
              displayNameTouched:
                (subject.displayName || "") !==
                (subject.subject?.subjectName || ""),
              fullMarks: String(subject.fullMarks),
              expanded: false,
              alternatives: (subject.alternatives ?? []).map((alt) => ({
                name: alt.name,
                streams: [...alt.streams],
              })),
            })),
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
      const maxNo = prev.reduce((max, week) => {
        const num = parsePositiveInt(week.weekNo);
        return num !== null && num > max ? num : max;
      }, 0);
      const key = nextKey("w");
      return [...prev, makeWeek(key, maxNo + 1)];
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

  const patchSubject = (
    weekKey: string,
    subjectKey: string,
    patch: Partial<SubjectInput>
  ) => {
    setWeeks((prev) =>
      prev.map((week) =>
        week.key !== weekKey
          ? week
          : {
              ...week,
              subjects: week.subjects.map((subject) =>
                subject.key === subjectKey
                  ? { ...subject, ...patch }
                  : subject
              ),
            }
      )
    );
  };

  const addSubject = (weekKey: string) => {
    const key = nextKey(`${weekKey}-s`);
    setWeeks((prev) =>
      prev.map((week) =>
        week.key !== weekKey
          ? week
          : { ...week, subjects: [...week.subjects, makeSubject(key)] }
      )
    );
  };

  const removeSubject = (weekKey: string, subjectKey: string) => {
    setWeeks((prev) =>
      prev.map((week) => {
        if (week.key !== weekKey) return week;
        if (week.subjects.length <= 1) {
          showErrorToast("A week must have at least one subject.");
          return week;
        }
        return {
          ...week,
          subjects: week.subjects.filter(
            (subject) => subject.key !== subjectKey
          ),
        };
      })
    );
  };

  const handleSubjectSelect = (
    weekKey: string,
    subjectKey: string,
    subjectId: string
  ) => {
    const option = subjectOptions.find((opt) => opt.id === subjectId);
    setWeeks((prev) =>
      prev.map((week) =>
        week.key !== weekKey
          ? week
          : {
              ...week,
              subjects: week.subjects.map((subject) => {
                if (subject.key !== subjectKey) return subject;
                return {
                  ...subject,
                  subjectId,
                  displayName: subject.displayNameTouched
                    ? subject.displayName
                    : option?.subjectName || "",
                };
              }),
            }
      )
    );
  };

  const patchAlternative = (
    weekKey: string,
    subjectKey: string,
    altIndex: number,
    patch: Partial<AlternativeInput>
  ) => {
    setWeeks((prev) =>
      prev.map((week) =>
        week.key !== weekKey
          ? week
          : {
              ...week,
              subjects: week.subjects.map((subject) =>
                subject.key !== subjectKey
                  ? subject
                  : {
                      ...subject,
                      alternatives: subject.alternatives.map((alt, index) =>
                        index === altIndex ? { ...alt, ...patch } : alt
                      ),
                    }
              ),
            }
      )
    );
  };

  const addAlternative = (weekKey: string, subjectKey: string) => {
    setWeeks((prev) =>
      prev.map((week) =>
        week.key !== weekKey
          ? week
          : {
              ...week,
              subjects: week.subjects.map((subject) =>
                subject.key !== subjectKey
                  ? subject
                  : {
                      ...subject,
                      alternatives: [
                        ...subject.alternatives,
                        { name: "", streams: [] },
                      ],
                    }
              ),
            }
      )
    );
  };

  const removeAlternative = (
    weekKey: string,
    subjectKey: string,
    altIndex: number
  ) => {
    setWeeks((prev) =>
      prev.map((week) =>
        week.key !== weekKey
          ? week
          : {
              ...week,
              subjects: week.subjects.map((subject) =>
                subject.key !== subjectKey
                  ? subject
                  : {
                      ...subject,
                      alternatives: subject.alternatives.filter(
                        (_, index) => index !== altIndex
                      ),
                    }
              ),
            }
      )
    );
  };

  const toggleStream = (
    weekKey: string,
    subjectKey: string,
    altIndex: number,
    stream: string
  ) => {
    setWeeks((prev) =>
      prev.map((week) =>
        week.key !== weekKey
          ? week
          : {
              ...week,
              subjects: week.subjects.map((subject) => {
                if (subject.key !== subjectKey) return subject;
                return {
                  ...subject,
                  alternatives: subject.alternatives.map((alt, index) => {
                    if (index !== altIndex) return alt;
                    const streams = alt.streams.includes(stream)
                      ? alt.streams.filter((s) => s !== stream)
                      : [...alt.streams, stream];
                    return { ...alt, streams };
                  }),
                };
              }),
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
    // Reset the subject selects for the new class.
    setWeeks((prev) =>
      prev.map((week) => ({
        ...week,
        subjects: week.subjects.map((subject) => ({
          ...subject,
          subjectId: "",
          displayName: "",
          displayNameTouched: false,
          alternatives: [],
          expanded: false,
        })),
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
    if (!header.examName.trim()) {
      showErrorToast("Exam name is required.");
      return;
    }
    if (weeks.length === 0) {
      showErrorToast("Add at least one week.");
      return;
    }

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
      seenWeekNos.add(weekNo);

      const totalMarks = parsePositiveInt(week.totalMarks);
      if (totalMarks === null) {
        showErrorToast(`Total marks must be a positive integer (${label}).`);
        return;
      }

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

      if (week.subjects.length === 0) {
        showErrorToast(`Each week needs at least one subject (${label}).`);
        return;
      }

      const seenSubjectIds = new Set<string>();
      const payloadSubjects: (typeof payloadWeeks)[number]["subjects"] = [];
      for (const subject of week.subjects) {
        if (!subject.subjectId) {
          showErrorToast(`Select a subject for every row (${label}).`);
          return;
        }
        if (seenSubjectIds.has(subject.subjectId)) {
          showErrorToast(
            `The same subject cannot appear twice in the same week (${label}).`
          );
          return;
        }
        seenSubjectIds.add(subject.subjectId);

        const fullMarks = parsePositiveInt(subject.fullMarks);
        if (fullMarks === null) {
          showErrorToast(
            `Full marks must be a positive integer (${label}).`
          );
          return;
        }

        const alternatives = [];
        for (const alt of subject.alternatives) {
          if (!alt.name.trim()) {
            showErrorToast(
              `Alternative names cannot be empty (${label}). Remove the row or fill it in.`
            );
            return;
          }
          alternatives.push({ name: alt.name.trim(), streams: alt.streams });
        }

        const displayName = subject.displayName.trim();
        payloadSubjects.push({
          subjectId: subject.subjectId,
          ...(displayName ? { displayName } : {}),
          fullMarks,
          alternatives,
        });
      }

      const weekLabel = week.weekLabel.trim();
      payloadWeeks.push({
        weekNo,
        ...(weekLabel ? { weekLabel } : {}),
        totalMarks,
        durationHours,
        subjects: payloadSubjects,
      });
    }

    startTransition(async () => {
      if (isEdit && routineId) {
        const res = await updateExamRoutine(routineId, {
          examName: header.examName.trim(),
          year: header.year.trim(),
          month: header.month.trim() ? header.month.trim() : null,
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

      const res = await createExamRoutine({
        examName: header.examName.trim(),
        year: header.year.trim(),
        month: header.month.trim() ? header.month.trim() : null,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Exam name<span className="text-red-500">*</span>
            </label>
            <Controller
              name="examName"
              control={form.control}
              rules={{ required: "Exam name is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <input
                    {...field}
                    type="text"
                    placeholder="LBE Weekly Exam Routine"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Month <span className="text-gray-400">(optional)</span>
            </label>
            <Controller
              name="month"
              control={form.control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="January"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
              )}
            />
          </div>
        </div>

        {/* Weeks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Weeks ({weeks.length})
            </h2>
            <button
              type="button"
              onClick={addWeek}
              className="inline-flex items-center gap-1 px-4 py-2 border border-orange-300 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add week
            </button>
          </div>

          {!selectedClassId && (
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              Select a class first — subject lists are loaded per class.
            </p>
          )}

          {weeks.map((week, index) => (
            <WeekCard
              key={week.key}
              week={week}
              weekIndex={index}
              subjectOptions={subjectOptions}
              onChange={patchWeek}
              onRemove={removeWeek}
              onUpdateSubject={patchSubject}
              onAddSubject={addSubject}
              onRemoveSubject={removeSubject}
              onUpdateAlternative={patchAlternative}
              onAddAlternative={addAlternative}
              onRemoveAlternative={removeAlternative}
              onToggleStream={toggleStream}
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
                {isEdit ? "Update Routine" : "Create Routine"}
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
