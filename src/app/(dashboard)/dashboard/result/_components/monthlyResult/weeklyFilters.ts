export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export type WeekValue = "1" | "2" | "3" | "4" | "overall";

export const DEFAULT_WEEK: WeekValue = "1";

export const WEEK_OPTIONS: { value: WeekValue; label: string }[] = [
  { value: "1", label: "Week 1" },
  { value: "2", label: "Week 2" },
  { value: "3", label: "Week 3" },
  { value: "4", label: "Week 4" },
  { value: "overall", label: "Overall" },
];

// Accepts both the current values ("1".."4", "overall") and legacy labels
// ("Week 4", "week-4", "Overall") from old/shared URLs.
export const normalizeWeekParam = (
  raw: string | null | undefined
): WeekValue | null => {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;
  if (value.toLowerCase() === "overall") return "overall";
  const match = value.match(/^(?:week[\s_-]*)?([1-4])$/i);
  return match ? (match[1] as WeekValue) : null;
};

export const weekLabel = (value: string): string =>
  WEEK_OPTIONS.find((option) => option.value === value)?.label ?? `Week ${value}`;
