"use client";

import React from "react";
import { ChevronDown, Minus, Plus, Trash2 } from "lucide-react";
import {
  AlternativeInput,
  STREAM_OPTIONS,
  SubjectInput,
  WeekInput,
} from "./routine.types";

interface SubjectOption {
  id: string;
  subjectName: string;
}

interface WeekCardProps {
  week: WeekInput;
  weekIndex: number;
  subjectOptions: SubjectOption[];
  onChange: (weekKey: string, patch: Partial<WeekInput>) => void;
  onRemove: (weekKey: string) => void;
  onUpdateSubject: (
    weekKey: string,
    subjectKey: string,
    patch: Partial<SubjectInput>
  ) => void;
  onAddSubject: (weekKey: string) => void;
  onRemoveSubject: (weekKey: string, subjectKey: string) => void;
  onUpdateAlternative: (
    weekKey: string,
    subjectKey: string,
    altIndex: number,
    patch: Partial<AlternativeInput>
  ) => void;
  onAddAlternative: (weekKey: string, subjectKey: string) => void;
  onRemoveAlternative: (
    weekKey: string,
    subjectKey: string,
    altIndex: number
  ) => void;
  onToggleStream: (
    weekKey: string,
    subjectKey: string,
    altIndex: number,
    stream: string
  ) => void;
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

export const computedWeekMarks = (week: WeekInput): number => {
  return week.subjects.reduce((sum, subject) => {
    const marks = parsePositiveInt(subject.fullMarks);
    return sum + (marks ?? 0);
  }, 0);
};

const WeekCard = ({
  week,
  weekIndex,
  subjectOptions,
  onChange,
  onRemove,
  onUpdateSubject,
  onAddSubject,
  onRemoveSubject,
  onUpdateAlternative,
  onAddAlternative,
  onRemoveAlternative,
  onToggleStream,
  onSubjectSelect,
}: WeekCardProps) => {
  const computed = computedWeekMarks(week);
  const printed = parsePositiveInt(week.totalMarks);
  const mismatch = printed !== null && computed !== printed;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
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
        <span className="ml-auto text-xs text-gray-500">
          Computed {computed} / Printed {week.totalMarks.trim() || "—"}
        </span>
        {mismatch ? (
          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold whitespace-nowrap">
            Warning: mismatch
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold whitespace-nowrap">
            Match
          </span>
        )}
        <button
          type="button"
          onClick={() => onRemove(week.key)}
          title="Remove week"
          className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {week.open && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Week no.<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={week.weekNo}
                onChange={(e) => onChange(week.key, { weekNo: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
              />
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
                Total marks<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={week.totalMarks}
                onChange={(e) =>
                  onChange(week.key, { totalMarks: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
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

          <div className="space-y-3">
            {week.subjects.map((subject) => (
              <div
                key={subject.key}
                className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Subject<span className="text-red-500">*</span>
                    </label>
                    <select
                      value={subject.subjectId}
                      onChange={(e) =>
                        onSubjectSelect(week.key, subject.key, e.target.value)
                      }
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                    >
                      <option value="">Select subject</option>
                      {subjectOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Display name
                    </label>
                    <input
                      type="text"
                      value={subject.displayName}
                      onChange={(e) =>
                        onUpdateSubject(week.key, subject.key, {
                          displayName: e.target.value,
                          displayNameTouched: true,
                        })
                      }
                      placeholder="Defaults to subject name"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Marks<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={subject.fullMarks}
                      onChange={(e) =>
                        onUpdateSubject(week.key, subject.key, {
                          fullMarks: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end gap-1">
                    <button
                      type="button"
                      title="Alternatives"
                      onClick={() =>
                        onUpdateSubject(week.key, subject.key, {
                          expanded: !subject.expanded,
                        })
                      }
                      className={`inline-flex items-center justify-center h-10 w-10 rounded-lg border transition-colors ${
                        subject.expanded || subject.alternatives.length > 0
                          ? "border-orange-300 text-orange-600 bg-orange-50"
                          : "border-gray-200 text-gray-400 hover:text-orange-600"
                      }`}
                    >
                      <Plus
                        className={`h-4 w-4 transition-transform ${subject.expanded ? "rotate-45" : ""}`}
                      />
                    </button>
                    <button
                      type="button"
                      title="Remove subject"
                      onClick={() => onRemoveSubject(week.key, subject.key)}
                      className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-300 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {subject.expanded && (
                  <div className="rounded-lg bg-white border border-gray-100 p-3 space-y-2">
                    <p className="text-xs font-medium text-gray-600">
                      Alternatives{" "}
                      <span className="font-normal text-gray-400">
                        (no stream checked = not stream-specific)
                      </span>
                    </p>
                    {subject.alternatives.map((alt, altIndex) => (
                      <div
                        key={altIndex}
                        className="flex flex-col sm:flex-row sm:items-center gap-2"
                      >
                        <input
                          type="text"
                          value={alt.name}
                          onChange={(e) =>
                            onUpdateAlternative(week.key, subject.key, altIndex, {
                              name: e.target.value,
                            })
                          }
                          placeholder="Alternative name (e.g. Physics)"
                          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                        />
                        <div className="flex items-center gap-2">
                          {STREAM_OPTIONS.map((stream) => (
                            <label
                              key={stream}
                              className="inline-flex items-center gap-1 text-xs text-gray-600 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={alt.streams.includes(stream)}
                                onChange={() =>
                                  onToggleStream(
                                    week.key,
                                    subject.key,
                                    altIndex,
                                    stream
                                  )
                                }
                                className="h-4 w-4 accent-[#F97316]"
                              />
                              {stream}
                            </label>
                          ))}
                          <button
                            type="button"
                            title="Remove alternative"
                            onClick={() =>
                              onRemoveAlternative(week.key, subject.key, altIndex)
                            }
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => onAddAlternative(week.key, subject.key)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add alternative
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => onAddSubject(week.key)}
              className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              <Plus className="h-4 w-4" />
              Add subject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekCard;
