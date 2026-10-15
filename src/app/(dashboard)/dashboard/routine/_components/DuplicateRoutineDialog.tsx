"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { duplicateExamRoutine } from "@/src/services/examRoutines";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { ClassOption, ExamRoutineRow } from "./routine.types";

interface DuplicateResultItem {
  classId: string;
  className: string | null;
  status: "created" | "skipped";
  routineId?: string;
  reason?: string;
  unmatchedSubjects?: string[];
}

interface DuplicateRoutineDialogProps {
  routine: ExamRoutineRow | null;
  classesData?: ClassOption[];
  onClose: () => void;
}

const DuplicateRoutineDialog = ({
  routine,
  classesData = [],
  onClose,
}: DuplicateRoutineDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [targetYear, setTargetYear] = useState("");
  const [examName, setExamName] = useState("");
  const [results, setResults] = useState<DuplicateResultItem[] | null>(null);

  useEffect(() => {
    if (routine) {
      setSelectedClassIds([]);
      setTargetYear(routine.year || "");
      setExamName("");
      setResults(null);
    }
  }, [routine]);

  const toggleClass = (classId: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const handleClose = (open: boolean) => {
    if (!open) onClose();
  };

  const handleSubmit = () => {
    if (!routine) return;
    if (selectedClassIds.length === 0) {
      showErrorToast("Select at least one target class.");
      return;
    }
    if (targetYear && !/^\d{4}$/.test(targetYear.trim())) {
      showErrorToast("Target year must be a 4-digit string.");
      return;
    }

    startTransition(async () => {
      const payload: Record<string, unknown> = {
        targetClassIds: selectedClassIds,
      };
      if (targetYear.trim()) payload.targetYear = targetYear.trim();
      if (examName.trim()) payload.examName = examName.trim();

      const result = await duplicateExamRoutine(routine.id, payload);
      const items: DuplicateResultItem[] | null =
        result?.data?.results ?? null;
      setResults(items);

      const created = items?.filter((item) => item.status === "created") ?? [];
      if (result?.statusCode === 200 && created.length > 0) {
        showSuccessToast(
          `Duplicated to ${created.length} class(es). See per-class results below.`
        );
      } else if (result?.statusCode === 200) {
        showErrorToast("No routine was created. See per-class results below.");
      } else {
        showErrorToast(result?.message || "Failed to duplicate exam routine.");
      }
    });
  };

  return (
    <Dialog open={!!routine} onOpenChange={handleClose}>
      <DialogContent className="bg-white max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Duplicate exam routine</DialogTitle>
          <DialogDescription>
            Copy &quot;{routine?.examName}&quot; ({routine?.stdClass?.className},{" "}
            {routine?.year}) to other classes. Subject links are resolved by
            subject name in each target class.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <p className="block text-sm font-medium text-foreground mb-2">
              Target classes<span className="text-red-500">*</span>
            </p>
            <div className="max-h-44 overflow-y-auto rounded-lg border border-gray-200 p-2 space-y-1">
              {classesData.map((cls) => (
                <label
                  key={cls.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-orange-50 cursor-pointer text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedClassIds.includes(cls.id)}
                    onChange={() => toggleClass(cls.id)}
                    className="h-4 w-4 accent-[#F97316]"
                  />
                  <span>{cls.className}</span>
                  {cls.id === routine?.stdClass?.id && (
                    <span className="text-xs text-gray-400">(source)</span>
                  )}
                </label>
              ))}
              {classesData.length === 0 && (
                <p className="text-sm text-gray-500 px-2 py-1">
                  No classes available.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Target year <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                placeholder={routine?.year || "2026"}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Exam name <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder={routine?.examName || "Exam name"}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
              />
            </div>
          </div>

          {results && (
            <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
              {results.map((item) => (
                <div key={item.classId} className="px-3 py-2.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    {item.status === "created" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                    )}
                    <span>{item.className || item.classId}</span>
                    <span
                      className={
                        item.status === "created"
                          ? "ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
                          : "ml-auto text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
                      }
                    >
                      {item.status === "created" ? "Created" : "Skipped"}
                    </span>
                  </div>
                  {item.status === "skipped" && item.reason && (
                    <p className="mt-1 text-xs text-gray-500 flex items-start gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" />
                      {item.reason}
                    </p>
                  )}
                  {item.unmatchedSubjects &&
                    item.unmatchedSubjects.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {item.unmatchedSubjects.map((name) => (
                          <span
                            key={name}
                            className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
              >
                {results ? "Close" : "Cancel"}
              </Button>
            </DialogClose>
            {!results && (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Duplicating...
                  </>
                ) : (
                  "Duplicate"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateRoutineDialog;
