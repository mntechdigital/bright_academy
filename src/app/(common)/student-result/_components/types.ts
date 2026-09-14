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
}

export interface WeeklyMark {
  id: string;
  month: string;
  week: string;
  year: string;
  obtainedMarks: number;
  totalMarks: number;
  subject: { subjectName: string };
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
  obtained: number;
  total: number;
}

export interface SubjectWeeksData {
  subjectName: string;
  weeks: Map<string, WeekData>;
}

export interface WeeklySummaryData {
  subjectArray: SubjectWeeksData[];
  totalObtainedMarks: number;
  totalFullMarks: number;
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