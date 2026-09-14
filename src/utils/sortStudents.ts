/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Sorting helpers for students keyed by their registration number ("Student's ID").
 *
 * stdRegNo values are stored as strings (e.g. "426054") but must be ordered
 * NUMERICALLY, not lexicographically — text ordering would rank "4260540"
 * ahead of "426055", which is wrong. Values are converted to numbers before
 * being compared so the ascending serial order is always correct.
 */

const toNumericId = (value: any): number => {
  const num = Number(value ?? "");
  // Coerce non-numeric / missing IDs to 0 so the comparator always returns a
  // stable numeric result (a NaN comparator result is treated as "equal" by sort()).
  return Number.isNaN(num) ? 0 : num;
};

/**
 * Numeric-ascending comparator for two students (or any objects) that carry a
 * `stdRegNo` field. Safe to pass directly to `Array.prototype.sort`.
 *
 * Example: "426054" vs "426055" -> -1  ("4260540" vs "426055" -> -1, correct)
 */
export const compareByRegNoAsc = (a: any, b: any): number =>
  toNumericId(a?.stdRegNo) - toNumericId(b?.stdRegNo);

/**
 * Returns a NEW array with the given students sorted by Student's ID
 * (stdRegNo) in ascending numeric order. The input array is never mutated.
 */
export const sortStudentsByRegNoAsc = (students: any[]): any[] =>
  [...students].sort(compareByRegNoAsc);