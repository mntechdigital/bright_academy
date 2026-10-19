"use client";

import React from "react";
import { AlertTriangle, ChevronDown, Trash2 } from "lucide-react";
import {
  MARKS_PER_SUBJECT,
  SUBJECTS_PER_WEEK,
  TOTAL_MARKS_PER_WEEK,
} from "@/src/constant/routine.constant";
import { WeekInput } from "./routine.types";

interface SubjectOption {
  id: string;
  subjectName: string;
}

interface WeekCardProps {
  week: WeekInput;
  weekIndex: number;
  // Week numbers already stored on the routine, used to flag a collision with
  // an existing week before submitting.
  existingWeekNos?: number[];
  subjectOptions: SubjectOption[];
  subjectsLoading?: boolean;
  onChange: (weekKey: string, patch: Partial<WeekInput>) => void;
  onRemove: (weekKey: string) => void;
  onSubjectSelect: (
    weekKey: string,
    subjectKey: string,
    subjectId: string
  ) => void;
}

export const parsePositiveInt = (value: string): number | null => {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const num = parseInt(trimmed, 10);
  return num > 0 ? num : null;
};

const WeekCard = ({
  week,
  weekIndex,
  existingWeekNos,
  subjectOptions,
  subjectsLoading = false,
  onChange,
  onRemove,
  onSubjectSelect,
}: WeekCardProps) => {
  // Week numbers already stored on the routine this form will append to.
  // A clash means the server would reject the save with 409.
  const ownWeekNo = parsePositiveInt(week.weekNo);
  const hasWeekNoClash =
    ownWeekNo !== null && (existingWeekNos?.includes(ownWeekNo) ?? false);

  const optionById = React.useMemo(
    () => new Map(subjectOptions.map((opt) => [opt.id, opt])),
    [subjectOptions]
  );

  // A subject already chosen in another row of THIS week cannot be picked
  // again. Different weeks may reuse the same subjects.
  const chosenElsewhere = React.useMemo(() => {
    const chosen = new Set(
      week.subjects
        .map((subject) => subject.subjectId)
        .filter((id): id is string => !!id)
    );
    return chosen;
  }, [week.subjects]);

  const filledCount = week.subjects.filter((subject) => subject.subjectId).length;
  const isComplete = filledCount === SUBJECTS_PER_WEEK;

  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        hasWeekNoClash ? "border-red-300" : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50">
        <button
          type="button"
          onClick={() => onChange(week.key, { open: !week.open })}
          className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-orange-600"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${week.open ? "" : "-rotate-90"}`}
          />
          Week {week.weekNo || weekIndex + 1}
          {week.weekLabel.trim() && (
            <span className="font-normal text-gray-500">
              · {week.weekLabel.trim()}
            </span>
          )}
        </button>
        <span
          className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
            isComplete
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          Total: {TOTAL_MARKS_PER_WEEK}
        </span>
        <button
          type="button"
          onClick={() => onRemove(week.key)}
          title="Remove week"
          aria-label="Remove week"
          className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {week.open && (
        <div className="p-4 space-y-4">
          {week.legacySubjectCount && (
            <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              This week does not follow the {SUBJECTS_PER_WEEK}-subject rule.
              Fix it before saving.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Week no.<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={week.weekNo}
                onChange={(e) => onChange(week.key, { weekNo: e.target.value })}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-1 ${
                  hasWeekNoClash
                    ? "border-red-300 focus:border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:border-[#F97316] focus:ring-[#F97316]"
                }`}
              />
              {hasWeekNoClash && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  Week {ownWeekNo} already exists in this routine
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Week label
              </label>
              <input
                type="text"
                value={week.weekLabel}
                onChange={(e) =>
                  onChange(week.key, { weekLabel: e.target.value })
                }
                placeholder={`Week ${week.weekNo || weekIndex + 1}`}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Duration (hours)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={week.durationHours}
                onChange={(e) =>
                  onChange(week.key, { durationHours: e.target.value })
                }
                placeholder="Optional"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
              />
            </div>
          </div>

          {subjectsLoading ? (
            <p className="text-sm text-gray-500">Loading subjects...</p>
          ) : subjectOptions.length === 0 ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              No subjects found for this class. Add subjects to the class first.
            </p>
          ) : subjectOptions.length < SUBJECTS_PER_WEEK ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              This class has only {subjectOptions.length} subject(s), but a week
              requires exactly {SUBJECTS_PER_WEEK}. Add more subjects to the
              class before saving.
            </p>
          ) : null}

          <div className="space-y-3">
            {week.subjects.map((subject, rowIndex) => {
              const isUnknown = !!subject.subjectId && !optionById.has(subject.subjectId);
              return (
                <div
                  key={subject.key}
                  className={`rounded-lg border p-3 space-y-3 ${
                    isUnknown
                      ? "border-amber-200 bg-amber-50/50"
                      : "border-gray-100 bg-gray-50/50"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-9">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Subject {rowIndex + 1}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={subject.subjectId}
                        disabled={isUnknown}
                        onChange={(e) =>
                          onSubjectSelect(week.key, subject.key, e.target.value)
                        }
                        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:bg-gray-100 disabled:text-gray-500"
                      >
                        {isUnknown && (
                          <option value={subject.subjectId}>
                            {subject.storedDisplayName || subject.subjectId}
                          </option>
                        )}
                        <option value="">Select subject</option>
                        {subjectOptions.map((opt) => {
                          const takenElsewhere = chosenElsewhere.has(opt.id);
                          return (
                            <option
                              key={opt.id}
                              value={opt.id}
                              disabled={takenElsewhere}
                            >
                              {opt.subjectName}
                              {takenElsewhere ? " (already selected)" : ""}
                            </option>
                          );
                        })}
                      </select>
                      {isUnknown && (
                        <p className="mt-1 text-xs font-medium text-amber-600">
                          This subject is not in the class subject list. Select a
                          replacement to continue.
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-3">
                      <span className="block text-xs font-medium text-gray-600 mb-1">
                        Marks
                      </span>
                      <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-600">
                        {MARKS_PER_SUBJECT}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekCard;