// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubjectResult {
  id: string;
  subjectName: string;
  fullMarks: number;
  highestMark: number;
  marks: number;
  point: number;
  grade: string;
}

export interface MonthlyResult {
  id: string;
  month: string;
  monthlyExamName?: string;
  gpa: number;
  grade: string;
  totalMarks: number;
  position: string;
  present: number;
  absent: number;
  results: SubjectResult[];
  // Monthly records carry no year column; createdAt is used to prefer the
  // record matching the selected year.
  createdAt?: string;
}

export interface WeeklyMark {
  id: string;
  month: string;
  week: string;
  year: string;
  // Null means the teacher left the cell blank — treated as absent.
  obtainedMarks: number | null;
  totalMarks: number;
  // The API returns the whole catalog Subject row.
  subject: { id: string; subjectName: string };
}

export interface ApiResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    monthlyResults?: MonthlyResult[];
    weeklyMarks?: WeeklyMark[];
  };
}

export interface WeekData {
  obtained: number | null;
  total: number;
}

export interface SubjectWeeksData {
  subjectName: string;
  weeks: Map<string, WeekData>;
}

export interface WeeklySummaryData {
  subjectArray: SubjectWeeksData[];
  totalObtainedMarks: number;
  // Denominator: sum of the routine's week totals (400 for 4 x 100).
  totalFullMarks: number;
  // (week, subject) pairs the routine schedules — 16 for a 4 x 4 routine.
  scheduledExams: number;
  percentage: number | null;
  usedRowFallback: boolean;
  overallGPA: number;
  overallGrade: string;
  present: number;
  absent: number;
}

export interface StudentInfo {
  name: string;
  stdRegNo?: string;
  className?: string;
}