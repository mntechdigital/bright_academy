/**
 * Determine student academic group from registration number.
 * Only applies to Class 9 and Class 10 students.
 *
 * Rules:
 *   - Contains "66" → Science
 *   - Contains "77" → Business
 *   - Contains "55" → Humanity
 */
export function getStudentGroup(regNo: string): string {
  if (!regNo) return "";
  if (regNo.includes("66")) return "Science";
  if (regNo.includes("77")) return "Business";
  if (regNo.includes("55")) return "Humanity";
  return "";
}
