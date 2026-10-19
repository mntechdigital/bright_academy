"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { getExamRoutines } from "@/src/services/examRoutines";

type Alternative = {
  name: string;
  streams: string[];
};

type RoutineSubject = {
  id: string;
  displayName: string;
  fullMarks: number;
  alternatives: Alternative[];
  subject: { id: string; subjectName: string };
};

type RoutineWeek = {
  id: string;
  weekNo: number;
  weekLabel: string;
  totalMarks: number;
  computedMarks: number;
  marksMismatch: boolean;
  durationHours: number | null;
  subjects: RoutineSubject[];
};

type ExamRoutine = {
  id: string;
  examName: string;
  year: string;
  month: string | null;
  stdClass: { id: string; className: string };
  weeks: RoutineWeek[];
};

const ROUTINE_YEAR = "2026";
const STREAM_OPTIONS = ["All", "Science", "Business", "Humanity"] as const;
type StreamFilter = (typeof STREAM_OPTIONS)[number];

const classOrder = (className: string): number => {
  const match = className.match(/(\d+)\s*$/);
  return match ? parseInt(match[1], 10) : 999;
};

const isStreamClass = (className: string): boolean =>
  className === "class-9" || className === "class-10";

export default function RoutinePage() {
  const [routines, setRoutines] = useState<ExamRoutine[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [stream, setStream] = useState<StreamFilter>("All");
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [loadingRoutine, setLoadingRoutine] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Load all routines for the year once (builds the class selector).
  useEffect(() => {
    const loadRoutines = async () => {
      setLoadingList(true);
      setError("");
      try {
        const res = await getExamRoutines({ year: ROUTINE_YEAR });
        const data: ExamRoutine[] = res?.data ?? [];
        const sorted = [...data].sort(
          (a, b) => classOrder(a.stdClass.className) - classOrder(b.stdClass.className)
        );
        setRoutines(sorted);
        if (sorted.length > 0) {
          setSelectedClassId(sorted[0].stdClass.id);
        }
      } catch {
        setError("রুটিন লোড করা যায়নি। পরে আবার চেষ্টা করুন।");
      } finally {
        setLoadingList(false);
      }
    };
    loadRoutines();
  }, []);

  // Refetch the selected routine whenever class or stream changes
  // (stream is applied server-side via the ?stream= query param).
  useEffect(() => {
    if (!selectedClassId) return;
    const loadRoutine = async () => {
      setLoadingRoutine(true);
      setError("");
      try {
        const res = await getExamRoutines({
          year: ROUTINE_YEAR,
          classId: selectedClassId,
          ...(stream !== "All" ? { stream } : {}),
        });
        const data: ExamRoutine[] = res?.data ?? [];
        setRoutines((prev) => {
          const others = prev.filter((r) => r.stdClass.id !== selectedClassId);
          return [...others, ...data].sort(
            (a, b) => classOrder(a.stdClass.className) - classOrder(b.stdClass.className)
          );
        });
      } catch {
        setError("রুটিন লোড করা যায়নি। পরে আবার চেষ্টা করুন।");
      } finally {
        setLoadingRoutine(false);
      }
    };
    loadRoutine();
  }, [selectedClassId, stream]);

  const activeRoutine = useMemo(
    () => routines.find((r) => r.stdClass.id === selectedClassId),
    [routines, selectedClassId]
  );

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setStream("All");
  };

  if (loadingList) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">রুটিন লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error && routines.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 px-4">
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-sm shadow-sm">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Class selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ক্লাস নির্বাচন করুন
        </label>
        <div className="relative">
          <select
            value={selectedClassId}
            onChange={(e) => handleClassChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          >
            {routines.map((routine) => (
              <option key={routine.stdClass.id} value={routine.stdClass.id}>
                {routine.stdClass.className}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Stream filter (classes 9-10 only) */}
        {activeRoutine && isStreamClass(activeRoutine.stdClass.className) && (
          <div className="mt-4">
            <p className="block text-sm font-medium text-gray-700 mb-2">
              বিভাগ নির্বাচন করুন
            </p>
            <div className="flex flex-wrap gap-2">
              {STREAM_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStream(option)}
                  className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors cursor-pointer ${
                    stream === option
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-500"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loadingRoutine ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">রুটিন লোড হচ্ছে...</p>
          </div>
        </div>
      ) : !activeRoutine ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            কোনো রুটিন পাওয়া যায়নি
          </h2>
          <p className="text-gray-400 mt-2 text-sm">পরে আবার চেক করুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeRoutine.weeks.map((week) => (
            <div
              key={week.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-orange-50/60">
                <h3 className="font-semibold text-gray-900">{week.weekLabel}</h3>
                <span className="text-sm font-bold text-orange-600">
                  মোট: {week.totalMarks}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="px-4 py-2 font-medium">বিষয়</th>
                      <th className="px-4 py-2 font-medium text-right whitespace-nowrap">
                        নম্বর
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {week.subjects.map((subject) => (
                      <tr
                        key={subject.id}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="px-4 py-2.5 text-gray-800">
                          {subject.displayName}
                          {subject.alternatives.length > 0 && (
                            <span className="block text-xs text-gray-500 mt-0.5">
                              one of:{" "}
                              {subject.alternatives.map((alt) => alt.name).join(" / ")}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right font-medium text-gray-700 whitespace-nowrap">
                          {subject.fullMarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {week.marksMismatch && (
                <p className="px-4 py-2.5 text-xs text-amber-700 bg-amber-50 border-t border-amber-100">
                  Subjects add up to {week.computedMarks}, printed total is{" "}
                  {week.totalMarks}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
