"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { getMyResults } from "@/src/services/students";
import { ChevronDown, Calendar, Printer, HelpCircle, User } from "lucide-react";
import brightpdf1 from "../../../../../public/brightpdf-1.jpeg";
import brightpdf2 from "../../../../../public/brightpdf-2.jpeg";
import brightpdf3 from "../../../../../public/brightpdf-3.jpeg";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubjectResult {
  id: string;
  subjectName: string;
  fullMarks: number;
  highestMark: number;
  marks: number;
  point: number;
  grade: string;
}

interface MonthlyResult {
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

interface WeeklyMark {
  id: string;
  month: string;
  week: string;
  year: string;
  obtainedMarks: number;
  totalMarks: number;
  subject: { subjectName: string };
}

interface ApiResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    monthlyResults?: MonthlyResult[];
    weeklyMarks?: WeeklyMark[];
  };
}

// ─── Utility: Read studentInfo cookie ─────────────────────────────────────────

function getStudentFromCookie(): { name: string; stdRegNo?: string } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("studentInfo="));
  if (!match) return null;
  try {
    const decoded = decodeURIComponent(match.split("=")[1]);
    const info = JSON.parse(decoded);
    return {
      name: info?.name || "",
      stdRegNo: info?.stdRegNo || info?.username || "",
    };
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const gradeColor = (grade?: string) => {
  if (!grade) return "#9ca3af";
  const g = grade.toUpperCase();
  if (g === "A+") return "#16a34a";
  if (g === "A") return "#22c55e";
  if (g === "A-") return "#2563eb";
  if (g === "B") return "#3b82f6";
  if (g === "C") return "#d97706";
  return "#dc2626";
};

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1">
      <HelpCircle
        size={13}
        className="text-gray-400 cursor-help"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 z-50 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon ?? <ChevronDown size={16} />}
        </div>
      </div>
    </div>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? "bg-orange-500 text-white shadow-sm"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Grade Badge ──────────────────────────────────────────────────────────────

function GradeBadge({ grade }: { grade?: string }) {
  if (!grade) return <span className="text-gray-300">-</span>;
  const color = gradeColor(grade);
  return (
    <span
      className="inline-flex items-center gap-1.5 border rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ color, borderColor: `${color}40` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
      />
      {grade}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function StudentResultsDashboard() {
  const [resultData, setResultData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"monthly" | "weekly">("monthly");
  const printRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [month, setMonth] = useState("January");
  const [week, setWeek] = useState("Week 1");
  const [publishedDate, setPublishedDate] = useState("");
  const [year, setYear] = useState("2026");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMyResults();
        setResultData(res);

        // Seed filters from first record
        const mr = res?.data?.monthlyResults?.[0];
        const wm = res?.data?.weeklyMarks?.[0];
        if (mr?.month) setMonth(mr.month);
        if (wm?.week) setWeek(wm.week);
        if (wm?.year) setYear(wm.year);
      } catch {
        setError("ফলাফল লোড করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const monthlyResults = resultData?.data?.monthlyResults ?? [];
  const weeklyMarks = resultData?.data?.weeklyMarks ?? [];

  const activeMonthly = monthlyResults[0];
  const subjectRows: SubjectResult[] = activeMonthly?.results ?? [];

  const weeklyRows = weeklyMarks;

  const allMonths = [...new Set(monthlyResults.map((r) => r.month))];
  const allWeeks = [...new Set(weeklyMarks.map((r) => r.week))];
  const allYears = [...new Set(weeklyMarks.map((r) => r.year))];

  const months = allMonths.length
    ? allMonths
    : [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
  const weeks = allWeeks.length
    ? allWeeks
    : ["Week 1", "Week 2", "Week 3", "Week 4"];
  const years = allYears.length ? allYears : ["2025", "2026"];

  const noData = monthlyResults.length === 0 && weeklyMarks.length === 0;

  // ── Student info from cookie ─────────────────────────────────────────────
  const studentInfo = useMemo(() => getStudentFromCookie(), []);

  // ── Print handler ─────────────────────────────────────────────────────────

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const w = window.open("", "_blank");
    if (!w) return;

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const monthName = activeMonthly?.month || month;
    const examTitle =
      activeTab === "monthly"
        ? `${activeMonthly?.monthlyExamName || "Monthly Assessment"} — ${monthName} ${year}`
        : `Weekly Marks Report`;

    const baseUrl = window.location.origin;

    // Resolve image URL - public folder imports return the path
    const getImgUrl = (img: any) => {
      if (typeof img === "string") return img.startsWith("http") ? img : `${baseUrl}${img}`;
      if (img?.src) return img.src.startsWith("http") ? img.src : `${baseUrl}${img.src}`;
      return "";
    };

    const bannerImg1 = getImgUrl(brightpdf1);
    const bannerImg2 = getImgUrl(brightpdf2);
    const bannerImg3 = getImgUrl(brightpdf3);

    w.document.write(`
      <html>
      <head>
        <title>Bright Academy — Result</title>
        <style>
          @page { size: A4; margin: 10mm; }
          * { box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #111827;
            margin: 0;
            font-size: 12.5px;
          }

          /* ── Top banner with images ──────────────── */
          .banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #d1d5db;
            padding: 8px 4px 12px;
          }
          .banner img {
            max-height: 90px;
            width: auto;
            object-fit: contain;
          }
          .banner .banner-left { width: 30%; text-align: left; }
          .banner .banner-middle { width: 30%; text-align: center; }
          .banner .banner-right { width: 30%; text-align: right; }

          /* ── Exam title bar ───────────────────────── */
          .exam-title {
            text-align: center; font-size: 28px; font-weight: 800; font-style: italic;
            padding: 16px 12px 14px; border-bottom: 2px solid #d1d5db;
            letter-spacing: 0.5px;
          }

          /* ── Info grid ────────────────────────────── */
          table.info-grid { width: 100%; border-collapse: collapse; }
          table.info-grid td { border: 1px solid #000; padding: 10px 16px; }
          table.info-grid td.label { font-size: 14px; color: #1f2937; width: 14%; }
          table.info-grid td.value { font-weight: 600; font-size: 15px; }

          div { overflow: visible !important; }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-bottom: 20px;
          }
          th, td {
            padding: 12px 14px !important;
            font-size: 14px !important;
            text-align: center !important;
          }
          th {
            background: #e5e7eb !important;
            color: #111827 !important;
            font-weight: 700 !important;
            font-size: 14px !important;
          }
          th *, td * { color: inherit !important; }
          td:first-child, th:first-child { text-align: left !important; }
          tr { background: transparent !important; }

          span[class*="rounded-full"][class*="inline-flex"] {
            border: none !important; background: transparent !important;
            padding: 0 !important; border-radius: 0 !important;
            font-weight: 700 !important; display: inline !important;
          }
          span[class*="w-1.5"][class*="h-1.5"] { display: none !important; }

          h3 {
            text-align: center; font-weight: 700; font-size: 16px;
            padding: 10px; margin: 0 0 14px;
            border-bottom: 2px solid #000;
            background: transparent;
          }

          .signatures { display: flex; justify-content: space-between; padding: 60px 4px 20px; }
          .signature { text-align: left; width: 42%; }
          .signature .line { border-top: 2px solid #000; margin-bottom: 6px; }
          .signature .role { font-size: 14px; font-weight: 600; }
          .signature .date { margin-top: 14px; font-size: 13px; color: #374151; }

          @media print { .no-print { display: none !important; } }
        </style>
      </head>
      <body>

        <div class="sheet">

          <div class="banner">
            <div class="banner-left">
              <img src="${bannerImg2}" alt="Bright Academy" />
            </div>
            <div class="banner-middle">
              <img src="${bannerImg1}" alt="Bright Academy" />
            </div>
            <div class="banner-right">
              <img src="${bannerImg3}" alt="Bright Academy" />
            </div>
          </div>

          <div class="exam-title">${examTitle}</div>

          <table class="info-grid">
            <tr>
              <td class="label">Roll / ID</td>
              <td class="value">${studentInfo?.stdRegNo || "-"}</td>
              <td class="label">Date of Publication</td>
              <td class="value">${today}</td>
              <td class="label">Month</td>
              <td class="value">${monthName}</td>
            </tr>
            <tr>
              <td class="label">Name</td>
              <td class="value" colspan="3">${studentInfo?.name || "-"}</td>
              <td class="label">Year</td>
              <td class="value">${year}</td>
            </tr>
          </table>

          ${printContents}

          <div class="signatures">
            <div class="signature">
              <div class="line">&nbsp;</div>
              <div class="role">Guardian's Signature</div>
              <div class="date">Date: ....................................</div>
            </div>
            <div class="signature">
              <div class="line">&nbsp;</div>
              <div class="role">Director's Signature</div>
              <div class="date">Date: ....................................</div>
            </div>
          </div>

        </div>

        <script>
          // Force borders via inline style — wins over any Tailwind
          // class remnants copied in from the live page, since inline
          // style has the highest specificity available.
          (function () {
            document.querySelectorAll('table').forEach(function (t) {
              t.style.setProperty('border-collapse', 'collapse', 'important');
              t.style.setProperty('border', '1.5px solid #000', 'important');
            });
            document.querySelectorAll('table th, table td').forEach(function (cell) {
              cell.style.setProperty('border', '1px solid #000', 'important');
            });
            document.querySelectorAll('table th').forEach(function (th) {
              th.style.setProperty('background', '#e5e7eb', 'important');
              th.style.setProperty('font-weight', '700', 'important');
            });
          })();
        </script>

      </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  // ── Loading / Error ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">ফলাফল লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-sm shadow-sm">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dark filter bar */}
      <div className=" px-4 pt-4 pb-6 md:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          <SelectField
            label="Month"
            value={month}
            options={months}
            onChange={setMonth}
          />
          <SelectField
            label="Week"
            value={week}
            options={weeks}
            onChange={setWeek}
          />

          {/* Published Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Published Date</label>
            <div className="relative">
              <input
                type="date"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar size={16} />
              </div>
            </div>
          </div>

          <SelectField
            label="Year"
            value={year}
            options={years}
            onChange={setYear}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-4 md:px-8 md:py-6 pb-4">
        {/* Student Info Header */}
        {studentInfo?.name && (
          <div className="flex items-center gap-3 mb-4 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <User size={18} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {studentInfo.name}
              </p>
              {studentInfo.stdRegNo && (
                <p className="text-xs text-gray-400">
                  ID: {studentInfo.stdRegNo}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100 w-fit">
          <TabButton
            active={activeTab === "monthly"}
            onClick={() => setActiveTab("monthly")}
          >
            Monthly Results
          </TabButton>
          <TabButton
            active={activeTab === "weekly"}
            onClick={() => setActiveTab("weekly")}
          >
            Weekly Marks
          </TabButton>
        </div>

        {noData ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              কোনো ফলাফল প্রকাশিত হয়নি
            </h2>
            <p className="text-gray-400 mt-2 text-sm">পরে আবার চেক করুন।</p>
          </div>
        ) : (
          <div
            ref={printRef}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* ── MONTHLY TAB ──────────────────────────────────────────── */}
            {activeTab === "monthly" && (
              <>
                {monthlyResults.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 text-sm">
                    কোনো মাসিক ফলাফল পাওয়া যায়নি।
                  </div>
                ) : (
                  <>
                    {/* Month badge */}
                    <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-700">
                        {activeMonthly?.month} — Monthly Result
                      </span>
                    </div>

                    {/* Subject table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th className="py-3 px-4 text-left font-medium text-gray-400">
                              Subject
                            </th>
                            <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap bg-slate-100">
                              Full Marks
                            </th>
                            <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                              Highest Mark
                            </th>
                            <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap bg-slate-100">
                              Marks Obtained
                            </th>
                            <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                              Point
                            </th>
                            <th className="py-3 px-4 text-center font-medium text-gray-400 bg-slate-100">
                              Grade
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjectRows.map((row, i) => (
                            <tr
                              key={row.id ?? i}
                              className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors"
                            >
                              <td className="py-4 px-4 font-medium text-gray-800">
                                {row.subjectName}
                              </td>
                              <td className="py-4 px-4 text-center text-gray-600 bg-slate-100">
                                {row.fullMarks}
                              </td>
                              <td className="py-4 px-4 text-center text-gray-600">
                                {row.highestMark}
                              </td>
                              <td className="py-4 px-4 text-center text-gray-600 bg-slate-100">
                                {row.marks}
                              </td>
                              <td className="py-4 px-4 text-center text-gray-600">
                                {row.point}
                              </td>
                              <td className="py-4 px-4 text-center bg-slate-100">
                                <GradeBadge grade={row.grade} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Exam Summary */}
                    <div className="px-6 pt-6 pb-8 border-t border-gray-100">
                      <h3 className="text-base font-semibold text-gray-800 text-center mb-5">
                        Exam Summary
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100">
                              {(
                                [
                                  ["Total Marks", "Sum of all marks obtained"],
                                  ["GPA", "Grade Point Average"],
                                  ["Grade", "Overall letter grade"],
                                  ["Position", "Student's rank in the class"],
                                  ["Present", "Days attended"],
                                  ["Absent", "Days missed"],
                                ] as [string, string][]
                              ).map(([label, tip]) => (
                                <th
                                  key={label}
                                  className="py-2 px-4 text-center font-medium text-gray-400 whitespace-nowrap"
                                >
                                  {label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-4 px-4 text-center font-bold text-gray-800 text-base">
                                {activeMonthly?.totalMarks ?? "-"}
                              </td>
                              <td className="py-4 px-4 text-center font-bold text-gray-800 text-base">
                                {activeMonthly?.gpa ?? "-"}
                              </td>
                              <td className="py-4 px-4 text-center">
                                {activeMonthly?.grade?.toUpperCase() === "F" ? (
                                  <span className="text-gray-300">-</span>
                                ) : (
                                  <GradeBadge grade={activeMonthly?.grade} />
                                )}
                              </td>
                              <td className="py-4 px-4 text-center font-bold text-orange-600 text-base">
                                {activeMonthly?.position ?? "-"}
                              </td>
                              <td className="py-4 px-4 text-center font-bold text-gray-800 text-base">
                                {activeMonthly?.present ?? "-"}
                              </td>
                              <td className="py-4 px-4 text-center font-bold text-gray-800 text-base">
                                {activeMonthly?.absent ?? "-"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── WEEKLY TAB ───────────────────────────────────────────── */}
            {activeTab === "weekly" && (
              <>
                {weeklyRows.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 text-sm">
                    কোনো সাপ্তাহিক মার্ক পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                          <th className="py-3 px-6 text-left font-medium text-gray-400">
                            Subject
                          </th>
                          <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                            Total Marks{" "}
                            <Tooltip text="Maximum marks for this test" />
                          </th>
                          <th className="py-3 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                            Obtained Marks <Tooltip text="Your score" />
                          </th>
                          <th className="py-3 px-4 text-center font-medium text-gray-400">
                            Week
                          </th>
                          <th className="py-3 px-4 text-center font-medium text-gray-400">
                            Month
                          </th>
                          <th className="py-3 px-4 text-center font-medium text-gray-400">
                            Year
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {weeklyRows.map((row, i) => (
                          <tr
                            key={row.id ?? i}
                            className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors"
                          >
                            <td className="py-4 px-6 font-medium text-gray-800">
                              {row.subject?.subjectName ?? "-"}
                            </td>
                            <td className="py-4 px-4 text-center text-gray-600">
                              {row.totalMarks}
                            </td>
                            <td className="py-4 px-4 text-center text-gray-600">
                              {row.obtainedMarks}
                            </td>
                            <td className="py-4 px-4 text-center text-gray-500">
                              {row.week}
                            </td>
                            <td className="py-4 px-4 text-center text-gray-500">
                              {row.month}
                            </td>
                            <td className="py-4 px-4 text-center text-gray-500">
                              {row.year}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Sticky Print button */}
      <div className="px-4 pb-4 md:px-8 md:pb-6">
        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-base py-4 rounded-xl transition-colors shadow-lg shadow-orange-200"
        >
          <Printer size={20} />
          Print
        </button>
      </div>
    </div>
  );
}