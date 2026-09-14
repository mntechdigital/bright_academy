"use client";

import type { RefObject } from "react";
import { getStudentGroup } from "@/src/utils/studentGroup";
import brightpdf1 from "../../../../../public/brightpdf-1.jpeg";
import brightpdf2 from "../../../../../public/brightpdf-2.jpeg";
import brightpdf3 from "../../../../../public/brightpdf-3.jpeg";
import type { MonthlyResult, StudentInfo } from "./types";

// ─── Print handler ─────────────────────────────────────────────────────────

export function usePrintResults({
  printRef,
  activeTab,
  activeMonthly,
  month,
  year,
  studentInfo,
}: {
  printRef: RefObject<HTMLDivElement | null>;
  activeTab: "monthly" | "weekly";
  activeMonthly: MonthlyResult | undefined;
  month: string;
  year: string;
  studentInfo: StudentInfo | null;
}) {
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
        ? `${activeMonthly?.monthlyExamName || "Monthly Assessment"}`
        : `LBE Result Sheet - ${year}`;

    const baseUrl = window.location.origin;

    // Resolve image URL - public folder imports return the path
    const getImgUrl = (img: any) => {
      if (typeof img === "string")
        return img.startsWith("http") ? img : `${baseUrl}${img}`;
      if (img?.src)
        return img.src.startsWith("http") ? img.src : `${baseUrl}${img.src}`;
      return "";
    };

    const bannerImg1 = getImgUrl(brightpdf1);
    const bannerImg2 = getImgUrl(brightpdf2);
    const bannerImg3 = getImgUrl(brightpdf3);

    w.document.write(`
      <html>
      <head>
        <title>The Bright Academy</title>
        <style>
          @page { size: A4; margin: 10mm; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
            width: 100%;
            object-fit: contain;
          }
          .banner .banner-left { width: 15%; text-align: left; }
          .banner .banner-middle { width: 55%; text-align: center; }
          .banner .banner-right { width: 30%; text-align: right; }

          /* ── Exam title bar ───────────────────────── */
          .exam-title {
            text-align: center; font-size: 20px; font-weight: 700; font-style: initial;
            padding: 16px 12px 14px;
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
            background: transparent !important;
            color: #111827 !important;
            font-weight: 700 !important;
            font-size: 14px !important;
          }
          th *, td * { color: inherit !important; }
          td:first-child, th:first-child { text-align: left !important; }
          tr { background: transparent !important; }

          /* Week-2 / Week-4 highlighted columns (print override) */
          td.bg-slate-100 { background: #f1f5f9 !important; }

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
          <div style="text-align: center; font-size: 13px; color: #374151; margin-bottom: 10px;">
            Date of Publication: ${today}
          </div>
          <table class="info-grid">
            <tr>
              <th class="label">Class</th>
              <th class="label">Roll</th>
              <th class="label">Name</th>
              <th class="label">Group</th>
              <th class="label">Month</th>
              <th class="label">Year</th>
            </tr>
            <tr>
              <td class="value">${studentInfo?.className || "-"}</td>
              <td class="value">${studentInfo?.stdRegNo || "-"}</td>
              <td class="value">${studentInfo?.name || "-"}</td>
              <td class="value">${getStudentGroup(studentInfo?.stdRegNo || "") || "-"}</td>
              <td class="value">${monthName}</td>
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
            // Preserve column highlighting in print (body cells only — headers stay plain)
            document.querySelectorAll('td.bg-slate-100').forEach(function (el) {
              el.style.setProperty('background', '#CFCFD1', 'important');
            });
          })();
        </script>

      </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  return { handlePrint };
}