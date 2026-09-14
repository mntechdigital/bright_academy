import type { StudentInfo } from "./types";

// ─── Utility: Read studentInfo cookie ─────────────────────────────────────────

export function getStudentFromCookie(): StudentInfo | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("studentInfo="));
  if (!match) return null;
  try {
    const decoded = decodeURIComponent(match.split("=")[1]);
    const info = JSON.parse(decoded);
    const rawClass =
      info?.className || info?.class || info?.stdClass?.className || "";
    // Extract only the number from values like "class-6" → "6"
    const classNumber = rawClass.match(/\d+/)?.[0] || rawClass;
    return {
      name: info?.name || "",
      stdRegNo: info?.stdRegNo || info?.username || "",
      className: classNumber,
    };
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const gradeColor = (grade?: string) => {
  if (!grade) return "#9ca3af";
  const g = grade.toUpperCase();
  if (g === "A+") return "#16a34a";
  if (g === "A") return "#22c55e";
  if (g === "A-") return "#2563eb";
  if (g === "B") return "#3b82f6";
  if (g === "C") return "#d97706";
  return "#dc2626";
};