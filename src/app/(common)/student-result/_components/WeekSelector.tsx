import { FILTER_WEEKS } from "./useStudentResults";

// ─── Week selector (Weekly tab only — picks the merit week) ──────────────────
// Weeks without marks for the selected Month + Year are visible but disabled.
// `no-print` is only defined inside the print stylesheet that
// usePrintResults writes into the print window (@media print), so this control
// is hidden in the printed output and stays visible on screen.

function WeekSelector({
  value,
  onChange,
  weeksWithData,
}: {
  value: string;
  onChange: (v: string) => void;
  weeksWithData: string[];
}) {
  return (
    <div className="no-print flex flex-wrap items-center gap-2 px-4 pt-4 md:px-6">
      <span className="text-xs text-gray-400 mr-1">Merit week:</span>
      {FILTER_WEEKS.map((w) => {
        const enabled = weeksWithData.includes(w);
        const selected = value === w;
        return (
          <button
            key={w}
            type="button"
            disabled={!enabled}
            onClick={() => onChange(w)}
            className={
              selected
                ? "px-4 py-1.5 rounded-full text-xs font-bold text-white bg-orange-500 shadow-sm"
                : enabled
                  ? "px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100 hover:bg-orange-100 hover:text-orange-700 transition-colors"
                  : "px-4 py-1.5 rounded-full text-xs font-medium text-gray-300 bg-gray-50 cursor-not-allowed"
            }
          >
            {w}
          </button>
        );
      })}
    </div>
  );
}

export default WeekSelector;
