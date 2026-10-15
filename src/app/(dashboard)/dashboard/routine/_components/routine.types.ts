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

export interface SubjectInput {
  key: string;
  subjectId: string;
  displayName: string;
  displayNameTouched: boolean;
  fullMarks: string;
  expanded: boolean;
  alternatives: AlternativeInput[];
}

export interface WeekInput {
  key: string;
  weekNo: string;
  weekLabel: string;
  totalMarks: string;
  durationHours: string;
  open: boolean;
  subjects: SubjectInput[];
}

export interface RoutineHeaderValues {
  classId: string;
  year: string;
  examName: string;
  month: string;
}
