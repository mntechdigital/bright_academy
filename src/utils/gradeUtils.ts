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

// Grading System (Marks out of 25)
export const GRADE_SYSTEM_25 = [
  { minMark: 20, maxMark: 25, grade: "A+", gradePoint: 5 },
  { minMark: 17, maxMark: 19, grade: "A", gradePoint: 4 },
  { minMark: 15, maxMark: 16, grade: "A-", gradePoint: 3.5 },
  { minMark: 13, maxMark: 14, grade: "B", gradePoint: 3 },
  { minMark: 11, maxMark: 12, grade: "C", gradePoint: 2 },
  { minMark: 9, maxMark: 10, grade: "D", gradePoint: 1 },
  { minMark: 0, maxMark: 8, grade: "F", gradePoint: 0 },
];

// Grading System (Marks out of 75)
export const GRADE_SYSTEM_75 = [
  { minMark: 58, maxMark: 75, grade: "A+", gradePoint: 5 },
  { minMark: 49, maxMark: 57, grade: "A", gradePoint: 4 },
  { minMark: 43, maxMark: 48, grade: "A-", gradePoint: 3.5 },
  { minMark: 37, maxMark: 42, grade: "B", gradePoint: 3 },
  { minMark: 31, maxMark: 36, grade: "C", gradePoint: 2 },
  { minMark: 25, maxMark: 30, grade: "D", gradePoint: 1 },
  { minMark: 0, maxMark: 24, grade: "F", gradePoint: 0 },
];

// Grading System (Marks out of 400)
export const GRADE_SYSTEM_400 = [
  { minMark: 317, maxMark: 400, grade: "A+", gradePoint: 5 },
  { minMark: 277, maxMark: 316, grade: "A", gradePoint: 4 },
  { minMark: 237, maxMark: 276, grade: "A-", gradePoint: 3.5 },
  { minMark: 197, maxMark: 236, grade: "B", gradePoint: 3 },
  { minMark: 157, maxMark: 196, grade: "C", gradePoint: 2 },
  { minMark: 129, maxMark: 136, grade: "D", gradePoint: 1 },
  { minMark: 0, maxMark: 128, grade: "F", gradePoint: 0 },
];

/**
 * Get grade based on marks and full marks.
 * @param marks - Marks obtained
 * @param fullMarks - Full marks (default 100)
 * @param gradingSystem - Optional: "100", "50", "25", "75", or "400" to force a specific grading system
 */
export function getGradeFromMarks(marks: number, fullMarks: number = 100, gradingSystem?: "100" | "50" | "25" | "75" | "400"): {
  gradePoint: number;
  letterGrade: string;
} {
  if (fullMarks <= 0) return { gradePoint: 0, letterGrade: "F" };

  // Determine which grading system to use:
  // - If fullMarks === 400, always use GRADE_SYSTEM_400 (individual subject fullMarks takes priority)
  // - If fullMarks === 75, always use GRADE_SYSTEM_75 (individual subject fullMarks takes priority)
  // - If fullMarks === 50, always use GRADE_SYSTEM_50 (individual subject fullMarks takes priority)
  // - If fullMarks === 25, always use GRADE_SYSTEM_25 (individual subject fullMarks takes priority)
  // - If gradingSystem is explicitly set, use that system
  // - Otherwise, use GRADE_SYSTEM_100
  const useSystem400 = fullMarks === 400 || gradingSystem === "400";
  const useSystem75 = fullMarks === 75 || gradingSystem === "75";
  const useSystem50 = fullMarks === 50 || gradingSystem === "50";
  const useSystem25 = fullMarks === 25 || gradingSystem === "25";

  if (useSystem400) {
    for (const grade of GRADE_SYSTEM_400) {
      if (marks >= grade.minMark && marks <= grade.maxMark) {
        return { gradePoint: grade.gradePoint, letterGrade: grade.grade };
      }
    }
    return { gradePoint: 0, letterGrade: "F" };
  }

  if (useSystem75) {
    for (const grade of GRADE_SYSTEM_75) {
      if (marks >= grade.minMark && marks <= grade.maxMark) {
        return { gradePoint: grade.gradePoint, letterGrade: grade.grade };
      }
    }
    return { gradePoint: 0, letterGrade: "F" };
  }

  if (useSystem25) {
    for (const grade of GRADE_SYSTEM_25) {
      if (marks >= grade.minMark && marks <= grade.maxMark) {
        return { gradePoint: grade.gradePoint, letterGrade: grade.grade };
      }
    }
    return { gradePoint: 0, letterGrade: "F" };
  }

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
  // Use 400-mark system for GPA to grade conversion (matches the 400-mark grading scale)
  const sorted = [...GRADE_SYSTEM_400].sort((a, b) => b.gradePoint - a.gradePoint);
  for (const grade of sorted) {
    if (gpa >= grade.gradePoint) {
      return grade.grade;
    }
  }
  return "F";
}
