import { getGradeFromMarks } from "./gradeUtils";
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
export const ICT_FULL_MARKS = 50;
export const ICT_EXAM_MAX = 25;
export const ICT_EXAM_PASS_MARK = 9; // exam >= 9: practical mirrors exam; below: no practical

export interface IctComputedMarks {
  exam: number;
  practical: number;
  total: number;
}

/**
 * ICT rule for class 9/10 monthly exams (max 25).
 * - absent: 0/0/0
 * - exam >= ICT_EXAM_PASS_MARK: practical = exam, total = exam*2
 * - exam < ICT_EXAM_PASS_MARK: practical = 0, total = exam
 */
export function computeIct(
  examMark: number | null | undefined,
  isAbsent: boolean,
): IctComputedMarks {
  if (isAbsent) return { exam: 0, practical: 0, total: 0 };
  const exam = Math.max(0, Math.min(ICT_EXAM_MAX, Number(examMark) || 0));
  if (exam >= ICT_EXAM_PASS_MARK) return { exam, practical: exam, total: exam * 2 };
  return { exam, practical: 0, total: exam };
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

export function getDefaultFullMarksForSubject(subjectName?: string | null): number {
  const key = normalizeSubjectName(String(subjectName ?? ""));
  return SUBJECT_FULL_MARKS_BY_NORMALIZED_NAME[key] ?? DEFAULT_SUBJECT_FULL_MARKS;
}

export function isIctSubject(subjectName?: string | null): boolean {
  return normalizeSubjectName(String(subjectName ?? "")) === "ict";
}

export function isMonthlyResultNewForIct(
  createdAt?: string | Date | null,
  cutoff: Date = ICT_PRACTICAL_CUTOFF,
): boolean {
  if (!createdAt) return false;
  const t = createdAt instanceof Date ? createdAt.getTime() : new Date(createdAt).getTime();
  return Number.isFinite(t) && t >= cutoff.getTime();
}

export function isIctPracticalApplicable(
  classNumber?: string | number | null,
  createdAt?: string | Date | null,
  cutoff: Date = ICT_PRACTICAL_CUTOFF,
): boolean {
  return isGroupClass(classNumber) && isMonthlyResultNewForIct(createdAt, cutoff);
}

export function isSubjectAbsent(row: any): boolean {
  if (!row) return false;
  // Explicit marker. marks=0 alone is a real zero, not absence.
  if (row.isAbsent === true || row.isAbsent === "true" || row.isAbsent === 1) return true;
  return false;
}

export function getIctStoredTotalFromExam(
  examMark: number | null | undefined,
  isAbsent: boolean,
): number {
  return computeIct(examMark, isAbsent).total;
}

/**
 * Infer ICT exam mark from stored total. Ambiguous because old "+25" totals and
 * new failed totals can overlap (e.g. old 30 => exam 5, new 30 impossible as fail
 * but possible as pass? pass totals are even 18..50; 30 not possible). Rule:
 * - absent/0 => null/0
 * - if total is an even number in [2*PASS, 2*MAX], treat as pass (exam=total/2)
 * - otherwise treat stored total as exam mark (failed/no-practical case), clamped
 */
export function getIctExamFromStoredTotal(
  storedTotal: number | null | undefined,
  isAbsent: boolean,
): number | null {
  if (isAbsent) return null;
  const total = Number(storedTotal);
  if (!Number.isFinite(total) || total <= 0) return null;
  const normalized = Math.max(0, Math.min(ICT_FULL_MARKS, total));
  const isPassTotal =
    normalized % 2 === 0 &&
    normalized >= ICT_EXAM_PASS_MARK * 2 &&
    normalized <= ICT_EXAM_MAX * 2;
  if (isPassTotal) return normalized / 2;
  return Math.max(0, Math.min(ICT_EXAM_MAX, normalized));
}

export function getIctInputMaxForContext(
  classNumber?: string | number | null,
  createdAt?: string | Date | null,
  cutoff: Date = ICT_PRACTICAL_CUTOFF,
): number {
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
): number => {
  const subjectDefault = getDefaultFullMarksForSubject(subjectName ?? row?.subjectName);
  // ICT (and any configured subject) override stored fullMarks so all results agree.
  if (subjectDefault !== DEFAULT_SUBJECT_FULL_MARKS) return subjectDefault;
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
  const fullMarks = getResultFullMarks(row, canonicalName || originalName);
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
    const fullMarks = getResultFullMarks((base.classSubject as any) || result?.raw, base.name);
    const marks = result ? result.marks : 0;
    rows.push({
      ...(result?.raw || {}),
      id: (result?.raw?.id as string | undefined) ?? (base.classSubject?.id as string | undefined) ?? null,
      subjectName: base.name,
      marks: result ? result.marks : null,
      fullMarks,
      highestMark: result?.highestMark ?? null,
      point: result?.point ?? null,
      grade: result?.grade ?? null,
      displayLabel: base.displayLabel,
      isReportedCrossGroup: base.isReportedCrossGroup,
    });
    return { marks, fullMarks };
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
      full += isIctSubject(name) && isIctPracticalApplicable(classNumber, createdAt, ictCutoff)
        ? ICT_FULL_MARKS
        : totals.fullMarks;
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
        rows.push({
          ...row.raw,
          id: (row.raw.id as string | undefined) ?? null,
          subjectName: row.originalName,
          marks: row.marks,
          fullMarks: row.fullMarks,
          highestMark: row.highestMark,
          point: row.point,
          grade: row.grade,
          displayLabel: row.originalName,
          isReportedCrossGroup: true,
        });
        obtained += row.marks;
        full += row.fullMarks;
        usedKeys.add(row.key);
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
    }
    if (full === 0 && fallbackTotalMarks && fallbackTotalMarks > 0) {
      full = fallbackTotalMarks;
    }
  }

  const safeFull = full > 0 ? full : 0;
  const percentage = safeFull > 0 ? Math.min(100, Math.floor((obtained / safeFull) * 100)) : 0;
  const { gradePoint, letterGrade } = safeFull > 0
    ? getGradeFromMarks(percentage, 100)
    : { gradePoint: 0, letterGrade: "F" };

  return {
    obtained,
    full: safeFull,
    percentage,
    gpa: safeFull > 0 ? gradePoint : 0,
    grade: safeFull > 0 ? letterGrade : "F",
    rows,
    excludedRows,
    subjectCount: studentClassSubjects.length > 0 ? studentClassSubjects.length : rows.length,
  };
}

export function formatObtainedOutOfFull(obtained: number, full: number): string {
  return `${obtained}/${full}`;
}
