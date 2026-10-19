"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { getExamRoutineById } from "@/src/services/examRoutines";
import { showErrorToast } from "@/src/utils/toastMessage";
import { ExamRoutineRow } from "./routine.types";

interface ViewRoutineDialogProps {
  routineId: string | null;
  onClose: () => void;
}

const ViewRoutineDialog = ({ routineId, onClose }: ViewRoutineDialogProps) => {
  const [routine, setRoutine] = useState<ExamRoutineRow | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!routineId) {
      setRoutine(null);
      return;
    }
    const fetchRoutine = async () => {
      setIsLoading(true);
      try {
        const res = await getExamRoutineById(routineId);
        if (res?.data?.id) {
          setRoutine(res.data);
        } else {
          showErrorToast(res?.message || "Failed to load exam routine.");
          onClose();
        }
      } catch (error) {
        console.error("Failed to load exam routine:", error);
        showErrorToast("Failed to load exam routine.");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routineId]);

  return (
    <Dialog open={!!routineId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {routine
              ? `${routine.examName} — ${routine.stdClass?.className}`
              : "Exam routine"}
          </DialogTitle>
          <DialogDescription>
            {routine
              ? `Year ${routine.year}${routine.month ? ` · ${routine.month}` : ""} · ${routine.weeks.length} week(s)`
              : "Loading routine details..."}
          </DialogDescription>
        </DialogHeader>

        {isLoading || !routine ? (
          <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading...
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {routine.weeks.map((week) => (
              <details
                key={week.id}
                className="rounded-xl border border-gray-200 overflow-hidden"
                open={routine.weeks.length <= 4}
              >
                <summary className="flex items-center gap-2 px-4 py-3 bg-gray-50 cursor-pointer text-sm font-medium text-gray-800">
                  <span>
                    {week.weekLabel} (Week {week.weekNo})
                  </span>
                  <span className="text-gray-500 font-normal">
                    Printed {week.totalMarks} · Computed {week.computedMarks}
                  </span>
                  {week.marksMismatch && (
                    <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold">
                      <AlertTriangle className="h-3 w-3" />
                      Mismatch
                    </span>
                  )}
                  {week.durationHours != null && (
                    <span className="text-xs text-gray-500 font-normal">
                      {week.durationHours}h
                    </span>
                  )}
                </summary>
                <div className="divide-y divide-gray-100">
                  {week.subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="px-4 py-2.5 text-sm flex items-center gap-2"
                    >
                      <span className="text-gray-800 font-medium">
                        {subject.displayName}
                      </span>
                      <span className="text-gray-400 text-xs">
                        ({subject.subject.subjectName})
                      </span>
                      <span className="ml-auto text-gray-600 whitespace-nowrap">
                        {subject.fullMarks} marks
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewRoutineDialog;
