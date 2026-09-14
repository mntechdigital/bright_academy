import { gradeColor } from "./utils";

// ─── Grade Badge ──────────────────────────────────────────────────────────────

function GradeBadge({ grade }: { grade?: string }) {
  if (!grade) return <span className="text-gray-300">-</span>;
  const color = gradeColor(grade);
  return (
    <span
      className="inline-flex items-center gap-1.5 border rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ color, borderColor: `${color}40` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
      />
      {grade}
    </span>
  );
}

export default GradeBadge;