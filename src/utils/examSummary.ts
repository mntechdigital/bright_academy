import {
  EXPECTED_SCHEDULED_EXAMS,
  EXPECTED_TOTAL_MARKS,
  MARKS_PER_SUBJECT,
  SUBJECTS_PER_WEEK,
  TOTAL_MARKS_PER_WEEK,
  WEEKS_PER_EXAM,
} from "@/src/constant/routine.constant";

/** The subset of an ExamRoutine the summary needs. */
export interface RoutineForSummary {
  examName: string;
  year: string;
  stdClass: { id: string; className: string };
  weeks: {
    weekNo: number;
    weekLabel: string;
    totalMarks: number;
    subjects: {
      fullMarks: number;
      subject: { id: string; subjectName: string };
    }[];
  }[];
}

/** The subset of a WeeklyMarksSheet row the summary needs. */
export interface WeeklyMarkForSummary {
  week: string;
  obtainedMarks: number | null;
  totalMarks: number;
  subject: { id: string; subjectName: string };
}

export interface ExamSummary {
  /** Sum of obtained marks across every scheduled exam (absent counts as 0). */
  totalObtainedMarks: number;
  /** Denominator = sum of the routine's week totals. Never derived from rows. */
  totalFullMarks: number;
  /** Scheduled = number of (week, subject) pairs the routine defines. */
  scheduledExams: number;
  present: number;
  absent: number;
  /** Percentage against totalFullMarks, or null when the denominator is 0. */
  percentage: number | null;
  /** Non-blocking problems found while reading the routine. */
  warnings: string[];
  /** True when there was no routine and the schedule was inferred from rows. */
  usedRowFallback: boolean;
}

/** "Week 3" | "Week-3" | "3" -> 3; anything unparseable -> null. */
export const weekNumber = (week: string | undefined): number | null => {
  if (!week) return null;
  const cleaned = week.trim().replace(/Week[- ]?/i, "").trim();
  if (!/^\d+$/.test(cleaned)) return null;
  return parseInt(cleaned, 10);
};

/**
 * Single source of truth for the student "Exam Summary".
 *
 * Both the on-screen card and the print view render from this, so the numbers
 * can never disagree between them.
 *
 * Denominator = sum of the routine's week totals (400 for a 4 x 100 routine).
 * Present/Absent are counted only over the (week, subject) pairs the routine
 * schedules, so a blank cell for an unscheduled subject is never "absent".
 * Absent exams contribute 0 marks but stay inside the denominator.
 */
export function computeExamSummary(
  routine: RoutineForSummary | null | undefined,
  weeklyRows: WeeklyMarkForSummary[]
): ExamSummary {
  const warnings: string[] = [];
  // With no saved marks there is nothing to report on, so stay quiet. This also
  // keeps the message out of server-side prerender logs, where no student is
  // logged in and no routine can be resolved.
  const hasRows = weeklyRows.length > 0;

  // ── Build the schedule of (weekNo, subjectId) from the routine ──────────
  let schedule: Map<string, { weekNo: number; subjectId: string; marks: number }>;
  let totalFullMarks: number;

  if (routine && routine.weeks.length > 0) {
    schedule = new Map();
    totalFullMarks = 0;

    for (const week of routine.weeks) {
      totalFullMarks += week.totalMarks;
      for (const subject of week.subjects) {
        schedule.set(`${week.weekNo}:${subject.subject.id}`, {
          weekNo: week.weekNo,
          subjectId: subject.subject.id,
          marks: subject.fullMarks,
        });
      }
    }

    if (hasRows && routine.weeks.length !== WEEKS_PER_EXAM) {
      warnings.push(
        `Routine "${routine.examName}" (${routine.stdClass.className}, ${routine.year}) has ${routine.weeks.length} week(s) instead of ${WEEKS_PER_EXAM}. Totals are derived from the actual routine.`
      );
    }
    const oddWeek = routine.weeks.find(
      (week) => week.subjects.length !== SUBJECTS_PER_WEEK
    );
    if (hasRows && oddWeek) {
      warnings.push(
        `Routine "${routine.examName}" (${routine.stdClass.className}, ${routine.year}) week ${oddWeek.weekNo} has ${oddWeek.subjects.length} subjects instead of ${SUBJECTS_PER_WEEK}.`
      );
    }
    if (hasRows && schedule.size !== EXPECTED_SCHEDULED_EXAMS) {
      warnings.push(
        `Routine "${routine.examName}" (${routine.stdClass.className}, ${routine.year}) schedules ${schedule.size} exam(s) instead of ${EXPECTED_SCHEDULED_EXAMS}.`
      );
    }
    if (hasRows && totalFullMarks !== EXPECTED_TOTAL_MARKS) {
      warnings.push(
        `Routine "${routine.examName}" (${routine.stdClass.className}, ${routine.year}) totals ${totalFullMarks} marks instead of ${EXPECTED_TOTAL_MARKS}.`
      );
    }
  } else {
    // No routine for this class/year: fall back to the distinct (week, subject)
    // pairs the student actually has rows for, so the page stays usable.
    if (hasRows) {
      warnings.push(
        `No exam routine found for this class and year; scheduled exams were inferred from the student's own saved marks.`
      );
    }
    schedule = new Map();
    for (const row of weeklyRows) {
      const weekNo = weekNumber(row.week);
      if (weekNo === null) continue;
      schedule.set(`${weekNo}:${row.subject.id}`, {
        weekNo,
        subjectId: row.subject.id,
        marks: row.totalMarks,
      });
    }
    totalFullMarks = Array.from(schedule.values()).reduce(
      (sum, item) => sum + item.marks,
      0
    );
  }

  // ── Marks + attendance over the schedule only ──────────────────────────
  let totalObtainedMarks = 0;
  let present = 0;
  const handled = new Set<string>();

  for (const row of weeklyRows) {
    const weekNo = weekNumber(row.week);
    if (weekNo === null) continue;
    const key = `${weekNo}:${row.subject.id}`;
    if (!schedule.has(key)) continue; // not scheduled -> never counted
    handled.add(key);

    if (row.obtainedMarks !== null && row.obtainedMarks !== undefined) {
      totalObtainedMarks += row.obtainedMarks;
      present += 1;
    }
  }

  const scheduledExams = schedule.size;
  const absent = Math.max(0, scheduledExams - present);

  if (hasRows && handled.size < present) {
    warnings.push(
      "Duplicate saved marks were found for the same week and subject."
    );
  }

  const strayRows = weeklyRows.filter((row) => {
    const weekNo = weekNumber(row.week);
    return weekNo === null || !schedule.has(`${weekNo}:${row.subject.id}`);
  }).length;
  if (hasRows && strayRows > 0) {
    warnings.push(
      `${strayRows} saved mark row(s) are for exams that are not in the routine; they are excluded from the totals.`
    );
  }

  return {
    totalObtainedMarks,
    totalFullMarks,
    scheduledExams,
    present,
    absent,
    percentage:
      totalFullMarks > 0
        ? Math.round((totalObtainedMarks / totalFullMarks) * 10000) / 100
        : null,
    warnings,
    usedRowFallback: !routine || routine.weeks.length === 0,
  };
}

/** Expected per-subject marks; exported for callers that label the columns. */
export { MARKS_PER_SUBJECT, TOTAL_MARKS_PER_WEEK };