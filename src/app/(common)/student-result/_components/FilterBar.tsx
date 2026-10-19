import SelectField from "./SelectField";

// ─── Filter Bar (Month + Year only) ───────────────────────────────────────────

function FilterBar({
  months,
  month,
  onMonthChange,
  years,
  year,
  onYearChange,
}: {
  months: string[];
  month: string;
  onMonthChange: (v: string) => void;
  years: string[];
  year: string;
  onYearChange: (v: string) => void;
}) {
  return (
    <div className=" px-4 pt-4 pb-6 md:px-8">
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Month"
          value={month}
          options={months}
          onChange={onMonthChange}
        />
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
