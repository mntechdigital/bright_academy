export interface RoutineAlternative {
  name: string;
  streams: string[];
}

export interface RoutineSubjectRow {
  id: string;
  displayName: string;
  fullMarks: number;
  alternatives: RoutineAlternative[];
  subject: {
    id: string;
    subjectName: string;
  };
}

export interface RoutineWeekRow {
  id: string;
  weekNo: number;
  weekLabel: string;
  totalMarks: number;
  computedMarks: number;
  marksMismatch: boolean;
  durationHours: number | null;
  subjects: RoutineSubjectRow[];
}

export interface ExamRoutineRow {
  id: string;
  examName: string;
  year: string;
  month: string | null;
  stdClass: {
    id: string;
    className: string;
  };
  // Real number of stored week records (server `_count`), never the highest
  // week number. `weekNumbers` is sorted ascending.
  weekCount?: number;
  weekNumbers?: number[];
  weeks: RoutineWeekRow[];
}

export interface ClassOption {
  id: string;
  className: string;
  subjects?: { id: string; subjectName: string }[];
}

export const STREAM_OPTIONS = ["Science", "Business", "Humanity"] as const;

// Client-side form input types (numeric fields kept as strings for inputs).
export interface AlternativeInput {
  name: string;
  streams: string[];
}

// A subject row is fixed: the marks are always MARKS_PER_SUBJECT and the
// display name always mirrors the chosen subject, so neither is editable.
// `alternatives` is carried through the form untouched so editing a routine
// never drops the stored stream alternatives.
export interface SubjectInput {
  key: string;
  subjectId: string;
  // Name to show when the stored subject is no longer in the class's subject
  // list. The row still renders this name so nothing is silently dropped.
  storedDisplayName?: string;
  alternatives: AlternativeInput[];
}

export interface WeekInput {
  key: string;
  weekNo: string;
  weekLabel: string;
  durationHours: string;
  open: boolean;
  subjects: SubjectInput[];
  // True when the stored week did not follow the 4-subject rule.
  legacySubjectCount: boolean;
}

export interface RoutineHeaderValues {
  classId: string;
  year: string;
}
