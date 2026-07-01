// Grading System (Marks out of 100)
export const GRADE_SYSTEM_100 = [
  { minMark: 80, maxMark: 100, grade: "A+", gradePoint: 5 },
  { minMark: 70, maxMark: 79, grade: "A", gradePoint: 4 },
  { minMark: 60, maxMark: 69, grade: "A-", gradePoint: 3.5 },
  { minMark: 50, maxMark: 59, grade: "B", gradePoint: 3 },
  { minMark: 40, maxMark: 49, grade: "C", gradePoint: 2 },
  { minMark: 33, maxMark: 39, grade: "D", gradePoint: 1 },
  { minMark: 0, maxMark: 32, grade: "F", gradePoint: 0 },
];

// Grading System (Marks out of 50)
export const GRADE_SYSTEM_50 = [
  { minMark: 40, maxMark: 50, grade: "A+", gradePoint: 5 },
  { minMark: 35, maxMark: 39, grade: "A", gradePoint: 4 },
  { minMark: 30, maxMark: 34, grade: "A-", gradePoint: 3.5 },
  { minMark: 26, maxMark: 29, grade: "B", gradePoint: 3 },
  { minMark: 20, maxMark: 25, grade: "C", gradePoint: 2 },
  { minMark: 17, maxMark: 19, grade: "D", gradePoint: 1 },
  { minMark: 0, maxMark: 16, grade: "F", gradePoint: 0 },
];

/**
 * Get grade based on marks and full marks.
 * @param marks - Marks obtained
 * @param fullMarks - Full marks (default 100)
 * @param gradingSystem - Optional: "100" or "50" to force a specific grading system
 */
export function getGradeFromMarks(marks: number, fullMarks: number = 100, gradingSystem?: "100" | "50"): {
  gradePoint: number;
  letterGrade: string;
} {
  if (fullMarks <= 0) return { gradePoint: 0, letterGrade: "F" };

  // Determine which grading system to use:
  // - If fullMarks === 50, always use GRADE_SYSTEM_50 (individual subject fullMarks takes priority)
  // - If gradingSystem is explicitly "50", use GRADE_SYSTEM_50
  // - Otherwise, use GRADE_SYSTEM_100
  const useSystem50 = fullMarks === 50 || gradingSystem === "50";

  if (useSystem50) {
    for (const grade of GRADE_SYSTEM_50) {
      if (marks >= grade.minMark && marks <= grade.maxMark) {
        return { gradePoint: grade.gradePoint, letterGrade: grade.grade };
      }
    }
    return { gradePoint: 0, letterGrade: "F" };
  }

  // For "100" grading system or any other fullMarks value, use GRADE_SYSTEM_100
  for (const grade of GRADE_SYSTEM_100) {
    if (marks >= grade.minMark && marks <= grade.maxMark) {
      return { gradePoint: grade.gradePoint, letterGrade: grade.grade };
    }
  }
  return { gradePoint: 0, letterGrade: "F" };
}

export function calculateGPAFromPoints(points: number[]): number {
  if (points.length === 0) return 0;
  const total = points.reduce((sum, p) => sum + p, 0);
  return total / points.length;
}

export function getGradeFromGPA(gpa: number): string {
  // Use 100-mark system for GPA to grade conversion
  const sorted = [...GRADE_SYSTEM_100].sort((a, b) => b.gradePoint - a.gradePoint);
  for (const grade of sorted) {
    if (gpa >= grade.gradePoint) {
      return grade.grade;
    }
  }
  return "F";
}