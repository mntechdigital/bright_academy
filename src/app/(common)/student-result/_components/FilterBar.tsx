import { Calendar } from "lucide-react";
import SelectField from "./SelectField";

// ─── Filter Bar ───────────────────────────────────────────────────────────────

function FilterBar({
  months,
  month,
  onMonthChange,
  weeks,
  week,
  onWeekChange,
  publishedDate,
  onPublishedDateChange,
  years,
  year,
  onYearChange,
}: {
  months: string[];
  month: string;
  onMonthChange: (v: string) => void;
  weeks: string[];
  week: string;
  onWeekChange: (v: string) => void;
  publishedDate: string;
  onPublishedDateChange: (v: string) => void;
  years: string[];
  year: string;
  onYearChange: (v: string) => void;
}) {
  return (
    <div className=" px-4 pt-4 pb-6 md:px-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <SelectField
          label="Month"
          value={month}
          options={months}
          onChange={onMonthChange}
        />
        <SelectField
          label="Week"
          value={week}
          options={weeks}
          onChange={onWeekChange}
        />

        {/* Published Date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Published Date</label>
          <div className="relative">
            <input
              type="date"
              value={publishedDate}
              onChange={(e) => onPublishedDateChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Calendar size={16} />
            </div>
          </div>
        </div>

        <SelectField
          label="Year"
          value={year}
          options={years}
          onChange={onYearChange}
        />
      </div>
    </div>
  );
}

export default FilterBar;