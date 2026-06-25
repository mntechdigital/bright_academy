export const SSC_GRADING_SYSTEM = [
  { minMark: 80, maxMark: 100, grade: "A+", gradePoint: 5.0 },
  { minMark: 70, maxMark: 79, grade: "A", gradePoint: 4.0 },
  { minMark: 60, maxMark: 69, grade: "A-", gradePoint: 3.5 },
  { minMark: 50, maxMark: 59, grade: "B", gradePoint: 3.0 },
  { minMark: 40, maxMark: 49, grade: "C", gradePoint: 2.0 },
  { minMark: 33, maxMark: 39, grade: "D", gradePoint: 1.0 },
  { minMark: 0, maxMark: 32, grade: "F", gradePoint: 0.0 }
];

export function getGradeFromMarks(marks: number): {
  gradePoint: number;
  letterGrade: string;
} {
  for (const grade of SSC_GRADING_SYSTEM) {
    if (marks >= grade.minMark && marks <= grade.maxMark) {
      return { gradePoint: grade.gradePoint, letterGrade: grade.grade };
    }
  }
  return { gradePoint: 0.0, letterGrade: "F" };
}

export function calculateGPAFromPoints(points: number[]): number {
  if (points.length === 0) return 0;
  // Exclude failed subjects (point = 0) from GPA calculation? 
  // Typically all subjects are included in GPA average.
  const total = points.reduce((sum, p) => sum + p, 0);
  return total / points.length;
}

export function getGradeFromGPA(gpa: number): string {
  // Round GPA to nearest grade system
  const roundedGpa = Math.round(gpa * 4) / 4; // round to nearest 0.25
  for (const grade of SSC_GRADING_SYSTEM) {
    if (roundedGpa >= grade.gradePoint) {
      return grade.grade;
    }
  }
  return "F";
}