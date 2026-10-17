/**
 * Test for computeExamSummary. Run with ts-node (no test framework in repo):
 *   npx ts-node --transpile-only src/utils/examSummary.test.ts
 */
import { computeExamSummary, RoutineForSummary, WeeklyMarkForSummary } from "./examSummary";

let failures = 0;
const check = (label: string, actual: unknown, expected: unknown) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures += 1;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : ` -> got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`}`);
};

// ── A conforming 4 x 4 x 25 routine (400 marks, 16 exams) ──────────────
const subjectIds = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "s14", "s15", "s16"];
const goodRoutine: RoutineForSummary = {
  examName: "LBE Weekly Exam Routine",
  year: "2026",
  stdClass: { id: "c1", className: "class-6" },
  weeks: [1, 2, 3, 4].map((weekNo) => ({
    weekNo,
    weekLabel: `Week ${weekNo}`,
    totalMarks: 100,
    subjects: [0, 1, 2, 3].map((i) => ({
      fullMarks: 25,
      subject: { id: subjectIds[(weekNo - 1) * 4 + i], subjectName: `Subj ${(weekNo - 1) * 4 + i + 1}` },
    })),
  })),
};

const row = (weekNo: number, subjectIdx: number, obtained: number | null, total = 25): WeeklyMarkForSummary => ({
  week: `Week ${weekNo}`,
  obtainedMarks: obtained,
  totalMarks: total,
  subject: { id: subjectIds[subjectIdx], subjectName: `Subj ${subjectIdx + 1}` },
});

// Global index 0..15 maps to week = floor(i/4)+1 and subjectIds[i], which is
// exactly how the routine is laid out above.
const scheduledRow = (i: number, obtained: number | null) =>
  row(Math.floor(i / 4) + 1, i, obtained);

console.log("\n[1] Marks in all 16 scheduled exams");
{
  const rows = Array.from({ length: 16 }, (_, i) => scheduledRow(i, 25));
  const s = computeExamSummary(goodRoutine, rows);
  check("present", s.present, 16);
  check("absent", s.absent, 0);
  check("present+absent === scheduled", s.present + s.absent, 16);
  check("scheduledExams", s.scheduledExams, 16);
  check("obtained / denominator", `${s.totalObtainedMarks} / ${s.totalFullMarks}`, "400 / 400");
  check("warnings", s.warnings, []);
}

console.log("\n[2] Absent in 2 scheduled exams (blank cells)");
{
  const rows = Array.from({ length: 16 }, (_, i) => scheduledRow(i, i === 3 || i === 7 ? null : 20));
  const s = computeExamSummary(goodRoutine, rows);
  check("present", s.present, 14);
  check("absent", s.absent, 2);
  check("obtained", s.totalObtainedMarks, 14 * 20);
  check("denominator stays 400", s.totalFullMarks, 400);
  check("percentage", s.percentage, 70);
}

console.log("\n[3] Subject NOT scheduled in a week is not counted absent");
{
  // Week 1 schedules subject indexes 0-3, week 2 schedules 4-7, week 3
  // schedules 8-11. Rows below deliberately pair a subject with a week that
  // does not schedule it — these must be ignored entirely.
  const rows = [
    ...Array.from({ length: 4 }, (_, i) => scheduledRow(i, 25)), // week1, all scheduled
    row(1, 4, 25), // week1 does NOT schedule subject 4
    row(1, 5, 25),
    row(1, 8, 25),
    row(2, 0, 25), // week2 does NOT schedule subject 0
    row(2, 9, 25),
  ];
  const s = computeExamSummary(goodRoutine, rows);
  check("present (only scheduled)", s.present, 4);
  check("absent = 16 - 4", s.absent, 12);
  check("obtained ignores unscheduled", s.totalObtainedMarks, 100);
  check("denominator", s.totalFullMarks, 400);
  check("warned about stray rows", s.warnings.some((w) => w.includes("not in the routine")), true);
}

console.log("\n[4] No marks at all");
{
  const s = computeExamSummary(goodRoutine, []);
  check("present", s.present, 0);
  check("absent", s.absent, 16);
  check("obtained", s.totalObtainedMarks, 0);
  check("denominator", s.totalFullMarks, 400);
  check("percentage", s.percentage, 0);
}

console.log("\n[5] Old routine with a different shape (no crash, actual data used)");
{
  const oddRoutine: RoutineForSummary = {
    examName: "Old Routine",
    year: "2026",
    stdClass: { id: "c2", className: "class-7" },
    weeks: [
      { weekNo: 1, weekLabel: "Week 1", totalMarks: 150, subjects: [0, 1, 2, 3, 4, 5].map((i) => ({ fullMarks: 25, subject: { id: subjectIds[i], subjectName: `S${i}` } })) },
      { weekNo: 2, weekLabel: "Week 2", totalMarks: 125, subjects: [0, 1, 2, 3].map((i) => ({ fullMarks: 25, subject: { id: subjectIds[i], subjectName: `S${i}` } })) },
    ],
  };
  const rows = [
    { week: "Week 1", obtainedMarks: 25, totalMarks: 25, subject: { id: subjectIds[0], subjectName: "S0" } },
    { week: "Week 1", obtainedMarks: 25, totalMarks: 25, subject: { id: subjectIds[1], subjectName: "S1" } },
    { week: "Week 2", obtainedMarks: 20, totalMarks: 25, subject: { id: subjectIds[0], subjectName: "S0" } },
  ];
  const s = computeExamSummary(oddRoutine, rows);
  check("denominator from actual routine", s.totalFullMarks, 275);
  check("scheduled = 6 + 4", s.scheduledExams, 10);
  check("present", s.present, 3);
  check("absent", s.absent, 7);
  check("obtained", s.totalObtainedMarks, 70);
  check("warned about week count", s.warnings.some((w) => w.includes("2 week(s)")), true);
  check("warned about 6 subjects", s.warnings.some((w) => w.includes("6 subjects")), true);
  check("warned about total", s.warnings.some((w) => w.includes("275 marks")), true);
  check("not using row fallback", s.usedRowFallback, false);
}

console.log("\n[6] No routine at all -> falls back to the student's own pairs");
{
  const rows = [
    row(1, 0, 25), row(1, 1, 25), row(3, 2, 10),
  ];
  const s = computeExamSummary(null, rows);
  check("usedRowFallback", s.usedRowFallback, true);
  check("scheduled = distinct pairs", s.scheduledExams, 3);
  check("present", s.present, 3);
  check("absent", s.absent, 0);
  check("obtained", s.totalObtainedMarks, 60);
  check("denominator from row marks", s.totalFullMarks, 75);
  check("warned about missing routine", s.warnings.some((w) => w.includes("No exam routine")), true);
}

console.log("\n[7] Row for an unscheduled exam contributes 0, blank scheduled exam is absent");
{
  const rows = [
    scheduledRow(0, 25),
    { week: "Week 1", obtainedMarks: 25, totalMarks: 25, subject: { id: "ghost", subjectName: "Ghost" } },
    { week: "Week 1", obtainedMarks: null, totalMarks: 25, subject: { id: subjectIds[1], subjectName: "Subj 2" } },
  ];
  const s = computeExamSummary(goodRoutine, rows);
  check("present", s.present, 1);
  check("absent", s.absent, 15);
  check("obtained", s.totalObtainedMarks, 25);
}

console.log("\n[8] Unparseable / week-5 rows are skipped, not crashed on");
{
  const rows = [
    { week: "garbage", obtainedMarks: 25, totalMarks: 25, subject: { id: subjectIds[0], subjectName: "x" } },
    { week: "Week-5", obtainedMarks: 25, totalMarks: 25, subject: { id: subjectIds[1], subjectName: "y" } },
    scheduledRow(0, 25),
  ];
  const s = computeExamSummary(goodRoutine, rows);
  check("no crash; present", s.present, 1);
  check("absent", s.absent, 15);
  check("denominator still 400", s.totalFullMarks, 400);
}

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);