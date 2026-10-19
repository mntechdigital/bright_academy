import { FILTER_WEEKS, OVERALL_MERIT } from "./useStudentResults";

// ─── Week selector (Weekly tab only — picks the merit scope) ─────────────────
// Weeks without marks for the selected Month + Year are visible but disabled.
// The "Overall" button ranks the whole month (all four weeks combined) with
// the same orange active style; it is mutually exclusive with the week
// buttons because both live in the same `value` state.
// `no-print` is only defined inside the print stylesheet that
// usePrintResults writes into the print window (@media print), so this control
// is hidden in the printed output and stays visible on screen.

function WeekSelector({
  value,
  onChange,
  weeksWithData,
  overallDisabled = false,
  overallDisabledReason,
  notice,
  errorMessage,
}: {
  value: string;
  onChange: (v: string) => void;
  weeksWithData: string[];
  overallDisabled?: boolean;
  overallDisabledReason?: string | null;
  // Small amber note shown under the button row (e.g. partial-month data).
  notice?: string | null;
  // Friendly red message shown when the merit request itself failed.
  errorMessage?: string | null;
}) {
  return (
    <div className="no-print px-4 pt-4 md:px-6">
      <div className="flex flex-wrap items-center gap-2">
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
        <button
          type="button"
          disabled={overallDisabled}
          title={overallDisabled ? overallDisabledReason || undefined : undefined}
          onClick={() => onChange(OVERALL_MERIT)}
          className={
            value === OVERALL_MERIT
              ? "px-4 py-1.5 rounded-full text-xs font-bold text-white bg-orange-500 shadow-sm"
              : overallDisabled
                ? "px-4 py-1.5 rounded-full text-xs font-medium text-gray-300 bg-gray-50 cursor-not-allowed"
                : "px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100 hover:bg-orange-100 hover:text-orange-700 transition-colors"
          }
        >
          Overall
        </button>
      </div>
      {notice && (
        <p className="mt-2 text-[11px] text-amber-600">{notice}</p>
      )}
      {errorMessage && (
        <p className="mt-2 text-[11px] text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}

export default WeekSelector;
