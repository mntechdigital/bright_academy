/**
 * Shared routine form constants.
 *
 * Every week in an exam routine has exactly SUBJECTS_PER_WEEK subjects, each
 * worth MARKS_PER_SUBJECT, so a week's printed total is always
 * TOTAL_MARKS_PER_WEEK. These mirror the server-side constants in
 * bright_academy_server/src/app/modules/exam-routine/exam-routine.constants.ts
 */
export const DEFAULT_EXAM_NAME = "LBE Weekly Exam Routine";

export const MARKS_PER_SUBJECT = 25;

export const SUBJECTS_PER_WEEK = 4;

export const TOTAL_MARKS_PER_WEEK = MARKS_PER_SUBJECT * SUBJECTS_PER_WEEK;