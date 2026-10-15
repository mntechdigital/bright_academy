import { User } from "lucide-react";
import type { StudentInfo } from "./types";

// ─── Student Info Header ──────────────────────────────────────────────────────

function StudentInfoHeader({
  studentInfo,
  displayMeritPosition,
  meritWeek,
  meritLoading,
}: {
  studentInfo: StudentInfo | null;
  displayMeritPosition: string | null;
  meritWeek?: string | null;
  meritLoading?: boolean;
}) {
  return (
    <>
      {studentInfo?.name && (
        <div className="flex items-center gap-3 mb-4 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <User size={18} className="text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {studentInfo.name}
            </p>
            {studentInfo.stdRegNo && (
              <p className="text-xs text-gray-400">
                ID: {studentInfo.stdRegNo}
              </p>
            )}
          </div>
          {meritLoading ? (
            <div className="ml-auto">
              <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 text-xs font-bold px-4 py-2 rounded-full">
                <span className="w-3 h-3 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
                Merit Position…
              </span>
            </div>
          ) : (
            displayMeritPosition && (
              <div className="ml-auto">
                <span className="inline-flex items-center gap-1.5 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md">
                  <span className="text-sm">🏆</span>
                  Merit Position: {displayMeritPosition}
                  {meritWeek ? ` (${meritWeek})` : ""}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
}

export default StudentInfoHeader;