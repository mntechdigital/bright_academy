import { getGradeFromMarks, getGradeFromGPA } from "./gradeUtils";
import {
  COMBINED_SUBJECT_ROWS,
  getCanonicalCombinedName,
  getGroupSubjectLabel,
  hasMeaningfulMarks,
  isCrossGroupLeftover,
  isGroupClass,
  normalizeSubjectName,
  type StudentGroup,
} from "./groupSubjects";

// ICT practical rule cutoff (Asia/Dhaka, UTC+6). Keep in sync with server.
export const ICT_PRACTICAL_CUTOFF: Date = new Date("2026-11-22T00:00:00+06:00");
// ICT rule (class 9/10): exam max 25, pass >= 9 => practical mirrors exam; fail/absent no practical.
export const ICT_FULL_MARKS = 50;
export const ICT_EXAM_MAX = 25;
export const ICT_EXAM_PASS_MARK = 9;
// Science practical rule (class 9/10, Science group only): exam max 75, pass >= 25 => +20 practical; fail/absent no practical.
export const SCIENCE_FULL_MARKS = 100;
export const SCIENCE_EXAM_MAX = 75;
export const SCIENCE_EXAM_PASS_MARK = 25;
export const SCIENCE_PRACTICAL_ADDED = 20; // out of 25, only 20 added

export interface PracticalComputedMarks {
  exam: number;
  practical: number;
  total: number;
  examMax: number;
  fullMarks: number;
  passMark: number;
  practicalAdded: number;
  applicable: boolean;
}

export type PracticalSubjectSlot =
  | "ict"
  | "science-physics"
  | "science-chemistry"
  | "science-biology"
  | "science-higher-math"
  | "science-agriculture"
  | "science-home-science"
  | null;

const SCIENCE_PRACTICAL_SUBJECT_KEYS = new Set(["physics", "chemistry", "biology"]);

export function isAgriculturePracticalKey(key: string): boolean {
  return (
    key === "agriculture" ||
    key === "agriculture studies" ||
    key === "agriculture / home science" ||
    key === "agriculture/home science" ||
    key === "krishi" ||
    key === "krishi shiksha"
  );
}

export function isHomeSciencePracticalKey(key: string): boolean {
  return (
    key === "home science" ||
    key === "home economics" ||
    key === "h. science" ||
    key === "h.science" ||
    key === "garhasthya" ||
    key === "garhasthya biggan"
  );
}

export function getGroupResolvedSubjectName(
  subjectName: string | null | undefined,
  group: string | null | undefined,
  classNumber?: string | number | null,
): string {
  const original = String(subjectName ?? "").trim();
  if (!isGroupClass(classNumber) || !group) return original;
  if (group !== "Science" && group !== "Business" && group !== "Humanity") return original;
  const canonical = getCanonicalCombinedName(original, group, classNumber);
  if (!canonical) return original;
  const def = COMBINED_SUBJECT_ROWS.find((d) => d.displayKey === canonical);
  if (!def) return original;
  return def.map[group as StudentGroup] || original;
}

export function getPracticalSubjectSlot(
  subjectName: string | null | undefined,
  group: string | null | undefined,
  classNumber?: string | number | null,
): PracticalSubjectSlot {
  void subjectName;
  void group;
  void classNumber;
  return null;
}

export function isSciencePracticalSubject(subjectName: string | null | undefined, group: string | null | undefined, classNumber?: string | number | null): boolean {
  void subjectName;
  void group;
  void classNumber;
  return false;
}

export function isMonthlyResultNewForPractical(createdAt?: string | Date | null, cutoff: Date = ICT_PRACTICAL_CUTOFF): boolean {
  void createdAt;
  void cutoff;
  return false;
}

export function isIctPracticalApplicable(classNumber?: string | number | null, createdAt?: string | Date | null, cutoff: Date = ICT_PRACTICAL_CUTOFF): boolean {
  void classNumber;
  void createdAt;
  void cutoff;
  return false;
}

export function isSciencePracticalApplicable(subjectName: string | null | undefined, group: string | null | undefined, classNumber?: string | number | null, createdAt?: string | Date | null, cutoff: Date = ICT_PRACTICAL_CUTOFF): boolean {
  void subjectName;
  void group;
  void classNumber;
  void createdAt;
  void cutoff;
  return false;
}

export function isPracticalApplicable(subjectName: string | null | undefined, group: string | null | undefined, classNumber?: string | number | null, createdAt?: string | Date | null, cutoff: Date = ICT_PRACTICAL_CUTOFF): boolean {
  void subjectName;
  void group;
  void classNumber;
  void createdAt;
  void cutoff;
  return false;
}

export function computeIct(examMark: number | null | undefined, isAbsent: boolean): PracticalComputedMarks {
  if (isAbsent) return { exam: 0, practical: 0, total: 0, examMax: ICT_EXAM_MAX, fullMarks: ICT_FULL_MARKS, passMark: ICT_EXAM_PASS_MARK, practicalAdded: ICT_EXAM_MAX, applicable: true };
  const exam = Math.max(0, Math.min(ICT_EXAM_MAX, Number(examMark) || 0));
  if (exam >= ICT_EXAM_PASS_MARK) return { exam, practical: exam, total: exam * 2, examMax: ICT_EXAM_MAX, fullMarks: ICT_FULL_MARKS, passMark: ICT_EXAM_PASS_MARK, practicalAdded: ICT_EXAM_MAX, applicable: true };
  return { exam, practical: 0, total: exam, examMax: ICT_EXAM_MAX, fullMarks: ICT_FULL_MARKS, passMark: ICT_EXAM_PASS_MARK, practicalAdded: ICT_EXAM_MAX, applicable: true };
}

export function computeSciencePractical(examMark: number | null | undefined, isAbsent: boolean): PracticalComputedMarks {
  if (isAbsent) return { exam: 0, practical: 0, total: 0, examMax: SCIENCE_EXAM_MAX, fullMarks: SCIENCE_FULL_MARKS, passMark: SCIENCE_EXAM_PASS_MARK, practicalAdded: SCIENCE_PRACTICAL_ADDED, applicable: true };
  const exam = Math.max(0, Math.min(SCIENCE_EXAM_MAX, Number(examMark) || 0));
  if (exam >= SCIENCE_EXAM_PASS_MARK) return { exam, practical: SCIENCE_PRACTICAL_ADDED, total: exam + SCIENCE_PRACTICAL_ADDED, examMax: SCIENCE_EXAM_MAX, fullMarks: SCIENCE_FULL_MARKS, passMark: SCIENCE_EXAM_PASS_MARK, practicalAdded: SCIENCE_PRACTICAL_ADDED, applicable: true };
  return { exam, practical: 0, total: exam, examMax: SCIENCE_EXAM_MAX, fullMarks: SCIENCE_FULL_MARKS, passMark: SCIENCE_EXAM_PASS_MARK, practicalAdded: SCIENCE_PRACTICAL_ADDED, applicable: true };
}

export function computePractical(
  subjectSlot: PracticalSubjectSlot | string | null | undefined,
  group: string | null | undefined,
  classNumber: string | number | null | undefined,
  examMark: number | null | undefined,
  isAbsent: boolean,
): PracticalComputedMarks {
  void group; void classNumber;
  if (subjectSlot === "ict") return computeIct(examMark, isAbsent);
  if (typeof subjectSlot === "string" && subjectSlot.startsWith("science-")) return computeSciencePractical(examMark, isAbsent);
  const exam = isAbsent ? 0 : Math.max(0, Number(examMark) || 0);
  return { exam, practical: 0, total: exam, examMax: exam, fullMarks: exam, passMark: 0, practicalAdded: 0, applicable: false };
}

export interface MonthlyResultSubjectLike {
  id?: string | null;
  subjectName: string;
  marks?: number | null;
  marksObtained?: number | null;
  obtainedMarks?: number | null;
  fullMarks?: number | null;
  highestMark?: number | null;
  point?: number | null;
  grade?: string | null;
  isAbsent?: boolean | null;
}

export interface MonthlyClassSubjectLike {
  id?: string;
  subjectName?: string;
  name?: string;
  fullMarks?: number | null;
}

export interface MonthlyResultSummaryRow extends MonthlyResultSubjectLike {
  id: string | null;
  subjectName: string;
  marks: number | null;
  fullMarks: number;
  highestMark: number | null;
  point: number | null;
  grade: string | null;
  displayLabel: string;
  isReportedCrossGroup?: boolean;
}

export interface MonthlyExcludedRow {
  id: string | null;
  subjectName: string;
  marks: number | null;
  fullMarks: number;
  reason: "outside-group";
}

export interface MonthlyResultSummary {
  obtained: number;
  full: number;
  percentage: number;
  gpa: number;
  grade: string;
  rows: MonthlyResultSummaryRow[];
  excludedRows: MonthlyExcludedRow[];
  subjectCount: number;
}

type NormalizedResult = {
  raw: MonthlyResultSubjectLike;
  originalName: string;
  canonicalName: string;
  displayName: string;
  key: string;
  marks: number;
  fullMarks: number;
  highestMark: number | null;
  point: number | null;
  grade: string | null;
  isCrossGroup: boolean;
  meaningful: boolean;
};

export const DEFAULT_SUBJECT_FULL_MARKS = 100;
export const SUBJECT_FULL_MARKS_BY_NORMALIZED_NAME: Readonly<Record<string, number>> = {
  ict: ICT_FULL_MARKS,
};

export function isClass6To8(classNumber?: string | number | null): boolean {
  if (classNumber === undefined || classNumber === null || classNumber === "") return false;
  const match = String(classNumber).match(/\d+/);
  if (!match) return false;
  const num = Number(match[0]);
  return num >= 6 && num <= 8;
}

export function isClass6To8FiftyMarkSubject(subjectName?: string | null): boolean {
  const key = normalizeSubjectName(String(subjectName ?? ""));
  if (
    key === "bangla 2nd paper" ||
    key === "bangla 2nd" ||
    key === "bangla second paper" ||
    key.includes("bangla 2nd") ||
    key.includes("bangla second")
  ) {
    return true;
  }
  if (
    key === "english 2nd paper" ||
    key === "english 2nd" ||
    key === "english second paper" ||
    key.includes("english 2nd") ||
    key.includes("english second")
  ) {
    return true;
  }
  if (
    key === "agriculture / home science" ||
    key === "agriculture/home science" ||
    key === "agriculture" ||
    key === "home science" ||
    key === "agriculture studies" ||
    key === "krishi" ||
    key === "garhasthya"
  ) {
    return true;
  }
  return false;
}

export function getDefaultFullMarksForSubject(
  subjectName?: string | null,
  classNumber?: string | number | null,
): number {
  const key = normalizeSubjectName(String(subjectName ?? ""));
  if (key === "ict") return ICT_FULL_MARKS;
  if (isClass6To8(classNumber) && isClass6To8FiftyMarkSubject(subjectName)) {
    return 50;
  }
  return SUBJECT_FULL_MARKS_BY_NORMALIZED_NAME[key] ?? DEFAULT_SUBJECT_FULL_MARKS;
}

export function isIctSubject(subjectName?: string | null): boolean {
  return normalizeSubjectName(String(subjectName ?? "")) === "ict";
}

export function isMonthlyResultNewForIct(createdAt?: string | Date | null, cutoff: Date = ICT_PRACTICAL_CUTOFF): boolean {
  return isMonthlyResultNewForPractical(createdAt, cutoff);
}

export function isSubjectAbsent(row: any): boolean {
  if (!row) return false;
  // Explicit marker. marks=0 alone is a real zero, not absence.
  if (row.isAbsent === true || row.isAbsent === "true" || row.isAbsent === 1) return true;
  return false;
}

export function getIctStoredTotalFromExam(examMark: number | null | undefined, isAbsent: boolean): number {
  return computeIct(examMark, isAbsent).total;
}

export function getIctExamFromStoredTotal(storedTotal: number | null | undefined, isAbsent: boolean): number | null {
  if (isAbsent) return null;
  const total = Number(storedTotal);
  if (!Number.isFinite(total) || total <= 0) return null;
  const normalized = Math.max(0, Math.min(ICT_FULL_MARKS, total));
  const isPassTotal = normalized % 2 === 0 && normalized >= ICT_EXAM_PASS_MARK * 2 && normalized <= ICT_EXAM_MAX * 2;
  if (isPassTotal) return normalized / 2;
  return Math.max(0, Math.min(ICT_EXAM_MAX, normalized));
}

export function getScienceStoredTotalFromExam(examMark: number | null | undefined, isAbsent: boolean): number {
  return computeSciencePractical(examMark, isAbsent).total;
}

export function getScienceExamFromStoredTotal(storedTotal: number | null | undefined, isAbsent: boolean): number | null {
  if (isAbsent) return null;
  const total = Number(storedTotal);
  if (!Number.isFinite(total) || total <= 0) return null;
  const normalized = Math.max(0, Math.min(SCIENCE_FULL_MARKS, total));
  if (normalized >= SCIENCE_EXAM_PASS_MARK + SCIENCE_PRACTICAL_ADDED && normalized <= SCIENCE_EXAM_MAX + SCIENCE_PRACTICAL_ADDED) {
    return normalized - SCIENCE_PRACTICAL_ADDED;
  }
  return Math.max(0, Math.min(SCIENCE_EXAM_MAX, normalized));
}

export function getPracticalStoredTotalFromExam(subjectName: string | null | undefined, group: string | null | undefined, classNumber: string | number | null | undefined, examMark: number | null | undefined, isAbsent: boolean): number {
  const slot = getPracticalSubjectSlot(subjectName, group, classNumber);
  return computePractical(slot, group, classNumber, examMark, isAbsent).total;
}

export function getPracticalExamFromStoredTotal(subjectName: string | null | undefined, group: string | null | undefined, classNumber: string | number | null | undefined, storedTotal: number | null | undefined, isAbsent: boolean): number | null {
  const slot = getPracticalSubjectSlot(subjectName, group, classNumber);
  if (slot === "ict") return getIctExamFromStoredTotal(storedTotal, isAbsent);
  if (slot && slot.startsWith("science-")) return getScienceExamFromStoredTotal(storedTotal, isAbsent);
  if (isAbsent) return null;
  const total = Number(storedTotal);
  return Number.isFinite(total) ? total : null;
}

export function getIctInputMaxForContext(classNumber?: string | number | null, createdAt?: string | Date | null, cutoff: Date = ICT_PRACTICAL_CUTOFF): number {
  return isIctPracticalApplicable(classNumber, createdAt, cutoff) ? ICT_EXAM_MAX : ICT_FULL_MARKS;
}

const toNumber = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const getResultMarks = (row: MonthlyResultSubjectLike): number => {
  if (isSubjectAbsent(row)) return 0;
  if (row.marks !== undefined && row.marks !== null && row.marks !== ("" as any)) {
    return toNumber(row.marks, 0);
  }
  if (row.marksObtained !== undefined && row.marksObtained !== null && row.marksObtained !== ("" as any)) {
    return toNumber(row.marksObtained, 0);
  }
  if (row.obtainedMarks !== undefined && row.obtainedMarks !== null && row.obtainedMarks !== ("" as any)) {
    return toNumber(row.obtainedMarks, 0);
  }
  return 0;
};

const getResultFullMarks = (
  row: MonthlyResultSubjectLike | undefined,
  subjectName?: string | null,
  classNumber?: string | number | null,
): number => {
  const subjectDefault = getDefaultFullMarksForSubject(subjectName ?? row?.subjectName, classNumber);
  const key = normalizeSubjectName(String(subjectName ?? row?.subjectName ?? ""));
  if (key === "ict") return ICT_FULL_MARKS;
  const fm = row?.fullMarks;
  const num = Number(fm);
  return Number.isFinite(num) && num > 0 ? num : subjectDefault;
};

const normalizeResultRow = (
  row: MonthlyResultSubjectLike,
  group: string,
  classNumber?: string | number | null,
): NormalizedResult => {
  const originalName = String(row.subjectName ?? "").trim();
  const isGroupAware = isGroupClass(classNumber) && !!group;
  const canonical =
    isGroupAware ? getCanonicalCombinedName(originalName, group, classNumber) : null;
  const canonicalName = canonical || originalName;
  const crossGroup =
    isGroupAware && isCrossGroupLeftover(originalName, group, classNumber);
  const meaningful = hasMeaningfulMarks(row);
  const marks = getResultMarks(row);
  const fullMarks = getResultFullMarks(row, canonicalName || originalName, classNumber);
  const displayName = isGroupAware
    ? getGroupSubjectLabel(canonicalName, group, classNumber)
    : canonicalName;

  return {
    raw: row,
    originalName,
    canonicalName,
    displayName,
    key: normalizeSubjectName(canonicalName),
    marks,
    fullMarks,
    highestMark: row.highestMark === undefined || row.highestMark === null ? null : toNumber(row.highestMark, 0),
    point: row.point === undefined || row.point === null ? null : toNumber(row.point, 0),
    grade: row.grade === undefined || row.grade === null ? null : String(row.grade),
    isCrossGroup: crossGroup,
    meaningful,
  };
};

export function isGroupClassNumber(classNumber?: string | number | null): boolean {
  return isGroupClass(classNumber);
}

export function resolveStudentGroupSubjects<T extends MonthlyClassSubjectLike>(
  classSubjects: T[],
  group: string,
  classNumber?: string | number | null,
): T[] {
  if (!Array.isArray(classSubjects) || classSubjects.length === 0) return [];
  if (!isGroupClass(classNumber)) return [...classSubjects];
  if (group !== "Science" && group !== "Business" && group !== "Humanity") return [...classSubjects];

  const seenCombined = new Set<string>();
  const out: T[] = [];

  for (const subject of classSubjects) {
    const name = String(subject.subjectName ?? subject.name ?? "").trim();
    if (!name) continue;
    const combinedDef = COMBINED_SUBJECT_ROWS.find((def) => getCanonicalCombinedName(name, group, classNumber) === def.displayKey)
      || (getCanonicalCombinedName(name, group, classNumber)
        ? COMBINED_SUBJECT_ROWS.find((def) => def.displayKey === getCanonicalCombinedName(name, group, classNumber))
        : undefined);

    if (combinedDef) {
      if (seenCombined.has(combinedDef.displayKey)) continue;
      seenCombined.add(combinedDef.displayKey);
      out.push({
        ...subject,
        subjectName: combinedDef.displayKey,
        name: combinedDef.displayKey,
      });
      continue;
    }

    if (isCrossGroupLeftover(name, group, classNumber)) continue;
    out.push(subject);
  }

  return out;
}

export function computeMonthlyResultSummary(args: {
  resultSubjects?: MonthlyResultSubjectLike[] | null;
  classSubjects?: MonthlyClassSubjectLike[] | null;
  group?: string | null;
  classNumber?: string | number | null;
  fallbackTotalMarks?: number | null;
  createdAt?: string | Date | null;
  ictCutoff?: Date;
}): MonthlyResultSummary {
  const {
    resultSubjects = [],
    classSubjects = [],
    group = "",
    classNumber,
    fallbackTotalMarks,
    createdAt,
    ictCutoff = ICT_PRACTICAL_CUTOFF,
  } = args;

  const normalizedResults = (resultSubjects || []).map((row) =>
    normalizeResultRow(row, group || "", classNumber),
  );
  const resultByKey = new Map<string, NormalizedResult[]>();
  for (const row of normalizedResults) {
    if (!row.key) continue;
    const arr = resultByKey.get(row.key) || [];
    arr.push(row);
    resultByKey.set(row.key, arr);
  }

  const studentClassSubjects = resolveStudentGroupSubjects(classSubjects || [], group || "", classNumber);
  const rows: MonthlyResultSummaryRow[] = [];
  const usedKeys = new Set<string>();
  const countedPoints: number[] = [];
  let hasFailedOrAbsentSubject = false;

  const pushRow = (base: {
    key: string;
    name: string;
    displayLabel: string;
    classSubject?: MonthlyClassSubjectLike;
    result?: NormalizedResult;
    isReportedCrossGroup?: boolean;
  }) => {
    usedKeys.add(base.key);
    const result = base.result;
    const fullMarks = result ? result.fullMarks : getResultFullMarks(base.classSubject as any, base.name, classNumber);
    const marks = result ? result.marks : 0;
    const absent = result ? isSubjectAbsent(result.raw) : false;
    const gradeInfo = (!absent && result && result.marks !== null && result.marks !== undefined && fullMarks > 0)
      ? getGradeFromMarks(result.marks, fullMarks)
      : { gradePoint: 0, letterGrade: "F" };
    const point = (result?.point != null && !Number.isNaN(Number(result.point)))
      ? Number(result.point)
      : (result && result.marks !== null ? gradeInfo.gradePoint : null);
    const grade = (result?.grade != null && String(result.grade).trim() !== "")
      ? String(result.grade)
      : (result && result.marks !== null ? gradeInfo.letterGrade : null);

    const isFailedOrAbsent =
      absent ||
      String(grade ?? "").trim().toUpperCase() === "F" ||
      point === 0 ||
      !result ||
      result.marks === null ||
      result.marks === undefined;

    rows.push({
      ...(result?.raw || {}),
      id: (result?.raw?.id as string | undefined) ?? (base.classSubject?.id as string | undefined) ?? null,
      subjectName: base.name,
      marks: result ? result.marks : null,
      fullMarks,
      highestMark: result?.highestMark ?? null,
      point,
      grade,
      displayLabel: base.displayLabel,
      isReportedCrossGroup: base.isReportedCrossGroup,
    });
    return { marks, fullMarks, point: point ?? 0, isFailedOrAbsent };
  };

  let obtained = 0;
  let full = 0;

  const excludedRows: MonthlyExcludedRow[] = [];

  if (studentClassSubjects.length > 0) {
    for (const classSubject of studentClassSubjects) {
      const name = String(classSubject.subjectName ?? classSubject.name ?? "").trim();
      const key = normalizeSubjectName(name);
      const candidates = resultByKey.get(key) || [];
      const result = candidates.find((c) => !c.isCrossGroup) || candidates[0];
      const displayLabel = isGroupClass(classNumber) && group
        ? getGroupSubjectLabel(name, group, classNumber)
        : name;
      const totals = pushRow({ key, name, displayLabel, classSubject, result });
      obtained += totals.marks;
      full += isIctSubject(name)
        ? ICT_FULL_MARKS
        : totals.fullMarks;
      countedPoints.push(totals.point);
      if (totals.isFailedOrAbsent) {
        hasFailedOrAbsentSubject = true;
      }
    }

    // Class 9/10 known-group rule: denominator is ALWAYS group slots x fullMarks.
    // Rows outside the student's group are excluded from obtained/full and reported separately.
    if (isGroupClass(classNumber) && (group === "Science" || group === "Business" || group === "Humanity")) {
      for (const row of normalizedResults) {
        if (usedKeys.has(row.key)) continue;
        excludedRows.push({
          id: (row.raw.id as string | undefined) ?? null,
          subjectName: row.originalName,
          marks: row.meaningful || row.marks !== 0 ? row.marks : null,
          fullMarks: row.fullMarks,
          reason: "outside-group",
        });
        usedKeys.add(row.key);
      }
    } else {
      // Non-group classes: keep meaningful unknown rows visible to avoid hiding marks.
      for (const row of normalizedResults) {
        if (usedKeys.has(row.key)) continue;
        if (!row.meaningful) continue;
        const absent = isSubjectAbsent(row.raw);
        const gradeInfo = (!absent && row.marks !== null && row.marks !== undefined && row.fullMarks > 0)
          ? getGradeFromMarks(row.marks, row.fullMarks)
          : { gradePoint: 0, letterGrade: "F" };
        const point = (row.point != null && !Number.isNaN(Number(row.point)))
          ? Number(row.point)
          : gradeInfo.gradePoint;
        const grade = (row.grade != null && String(row.grade).trim() !== "")
          ? String(row.grade)
          : gradeInfo.letterGrade;
        rows.push({
          ...row.raw,
          id: (row.raw.id as string | undefined) ?? null,
          subjectName: row.originalName,
          marks: row.marks,
          fullMarks: row.fullMarks,
          highestMark: row.highestMark,
          point,
          grade,
          displayLabel: row.originalName,
          isReportedCrossGroup: true,
        });
        obtained += row.marks;
        full += row.fullMarks;
        countedPoints.push(point);
        usedKeys.add(row.key);
        if (absent || point === 0 || String(grade ?? "").trim().toUpperCase() === "F") {
          hasFailedOrAbsentSubject = true;
        }
      }
    }
  } else {
    // Fallback: no class subject list available. Use stored result rows.
    for (const row of normalizedResults) {
      if (usedKeys.has(row.key)) continue;
      if (row.isCrossGroup && !row.meaningful) continue;
      const totals = pushRow({
        key: row.key,
        name: row.canonicalName || row.originalName,
        displayLabel: row.displayName || row.originalName,
        result: row,
        isReportedCrossGroup: row.isCrossGroup && row.meaningful,
      });
      obtained += totals.marks;
      full += totals.fullMarks;
      countedPoints.push(totals.point);
      if (totals.isFailedOrAbsent) {
        hasFailedOrAbsentSubject = true;
      }
    }
    if (full === 0 && fallbackTotalMarks && fallbackTotalMarks > 0) {
      full = fallbackTotalMarks;
    }
  }

  const safeFull = full > 0 ? full : 0;
  const percentage = safeFull > 0 ? Math.min(100, Math.floor((obtained / safeFull) * 100)) : 0;

  // Monthly overall GPA is average of each counted subject's point
  const subjectCount = studentClassSubjects.length > 0
    ? studentClassSubjects.length
    : (countedPoints.length || rows.length || 1);
  const totalPoints = countedPoints.reduce((sum, p) => sum + p, 0);
  const avgGpa = subjectCount > 0 ? totalPoints / subjectCount : 0;
  const gpa = Number(avgGpa.toFixed(2));
  const grade = hasFailedOrAbsentSubject ? "" : getGradeFromGPA(gpa);

  return {
    obtained,
    full: safeFull,
    percentage,
    gpa,
    grade,
    rows,
    excludedRows,
    subjectCount,
  };
}

export function formatObtainedOutOfFull(obtained: number, full: number): string {
  return `${obtained}/${full}`;
}
