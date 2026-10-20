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

    // Count subject rows in the printed table to pick an adaptive font tier.
    const subjectTable = printRef.current.querySelector("table.result-table");
    const rowCount = subjectTable
      ? subjectTable.querySelectorAll("tbody tr").length
      : 0;

    let baseFont = "12px";
    let rowPad = "4px 6px";
    let titleFont = "16px";
    let bannerH = "55px";
    if (rowCount <= 12) {
      baseFont = "14px";
      rowPad = "8px 8px";
      titleFont = "18px";
      bannerH = "70px";
    } else if (rowCount <= 18) {
      baseFont = "13px";
      rowPad = "6px 8px";
      titleFont = "17px";
      bannerH = "60px";
    } else if (rowCount >= 22) {
      baseFont = "11.5px";
      rowPad = "4px 6px";
      titleFont = "15px";
      bannerH = "50px";
    }

    w.document.write(`
      <html>
      <head>
        <title>The Bright Academy</title>
        <style>
          @page { size: A4; margin: 10mm; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { height: 100%; margin: 0; }
          html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #111827;
            margin: 0;
            font-size: 11px;
          }

          .page {
            min-height: calc(297mm - 20mm);
            display: flex;
            flex-direction: column;
          }
          .page-content { flex: 1; }
          .signatures { margin-top: auto; }

          /* ── Top banner with images ──────────────── */
          .banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #d1d5db;
            padding: 4px 4px 6px;
          }
          .banner img {
            max-height: var(--banner-h, 55px);
            width: 100%;
            object-fit: contain;
          }
          .banner .banner-left { width: 15%; text-align: left; }
          .banner .banner-middle { width: 55%; text-align: center; }
          .banner .banner-right { width: 30%; text-align: right; }

          /* ── Exam title bar ───────────────────────── */
          .exam-title {
            text-align: center; font-size: var(--title-font, 15px); font-weight: 700; font-style: initial;
            padding: 6px 8px 4px;
            letter-spacing: 0.5px;
          }

          /* ── Info grid ────────────────────────────── */
          table.info-grid { width: 100%; border-collapse: collapse; }
          table.info-grid td { border: 1px solid #000; padding: var(--row-pad, 4px 6px); font-size: var(--base-font, 11px); }
          table.info-grid td.label { color: #1f2937; width: 14%; font-weight: 400; }
          table.info-grid td.value { font-weight: 600; }

          div { overflow: visible !important; }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-bottom: 8px;
          }
          /* Data-table borders scoped to the result tables. The signature table
             is intentionally excluded — it has no outer box. */
          table.result-table,
          table.result-table th,
          table.result-table td,
          table.result-table tbody tr {
            border: 1px solid #000 !important;
          }
          table:not(.signature-table) th,
          table:not(.signature-table) td {
            padding: var(--row-pad, 4px 6px) !important;
            font-size: var(--base-font, 11px) !important;
            text-align: center !important;
            white-space: nowrap !important;
          }
          table:not(.signature-table) th {
            background: transparent !important;
            color: #111827 !important;
            font-weight: 700 !important;
          }
          table:not(.signature-table) th *, table:not(.signature-table) td * { color: inherit !important; }
          table:not(.signature-table) td:first-child,
          table:not(.signature-table) th:first-child { text-align: left !important; }
          tr { background: transparent !important; }

          /* Print pagination rules */
          thead { display: table-header-group; }
          tr { page-break-inside: avoid; break-inside: avoid; }

          /* Keep the summary block and the signature block together
             (they never get stranded at the top of a new page alone). */
          .exam-summary-block, .signatures {
            break-inside: avoid;
          }
          td.bg-slate-100 { background: #f1f5f9 !important; }

          /* Second line inside a summary cell (e.g. the percentage under
             "301 / 400") — smaller + gray in print, where the Tailwind
             classes copied in from the live page carry no styles. */
          td .print-subtext {
            display: block !important;
            font-size: 10px !important;
            font-weight: 400 !important;
            color: #6b7280 !important;
            margin-top: 4px !important;
          }

          span[class*="rounded-full"][class*="inline-flex"] {
            border: none !important; background: transparent !important;
            padding: 0 !important; border-radius: 0 !important;
            font-weight: 700 !important; display: inline !important;
          }
          span[class*="w-1.5"][class*="h-1.5"] { display: none !important; }

          h3 {
            text-align: center; font-weight: 700; font-size: 14px;
            padding: 4px; margin: 0 0 6px;
            border-bottom: 2px solid #000;
            background: transparent;
          }

          .signatures {
            padding: 16px 4px 8px;
          }

          .signature-table {
            width: 100%;
            border-collapse: separate !important;
            border-spacing: 40px 0;
            border: none !important;
            background: transparent;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .signature-table tr {
            background: transparent !important;
          }
          .signature-table td {
            vertical-align: top !important;
            width: 50% !important;
            padding: 0 20px !important;
            border: none !important;
          }
          .signature-cell {
            border-top: 1px solid #000 !important;
            border-left: none !important;
            border-right: none !important;
            border-bottom: none !important;
            padding-top: 10px;
            width: 50%;
          }
          .signature-cell:first-child {
            text-align: left;
          }
          .signature-cell:last-child {
            text-align: right;
          }
          .signature-cell .role { font-size: 13px; font-weight: 600; }
          .signature-cell .sig-line { height: 24px; }
          .signature-cell .signature-date {
            width: 100%;
            display: block;
            margin-top: 10px;
            font-size: 12px;
            line-height: 1.8;
            color: #374151;
          }

          @media print { .no-print { display: none !important; } }
        </style>
      </head>
      <body>

        <div class="page" style="--base-font: ${baseFont}; --row-pad: ${rowPad}; --title-font: ${titleFont}; --banner-h: ${bannerH};">

          <div class="page-content">

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
            <div
              style="text-align: center; font-size: 11px; color: #374151; margin-bottom: 6px;"
            >
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

          </div>

          <div class="signatures">
            <table class="signature-table">
              <tbody>
                <tr>
                  <td class="signature-cell">
                    <div class="sig-line">&nbsp;</div>
                    <div class="role">Guardian's Signature</div>
                    <div class="signature-date">Date: ....................................</div>
                  </td>
                  <td class="signature-cell" style="text-align:right">
                    <div class="sig-line">&nbsp;</div>
                    <div class="role">Director's Signature</div>
                    <div class="signature-date">Date: ....................................</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <script>
          // Force borders via inline style — wins over any Tailwind
          // class remnants copied in from the live page, since inline
          // style has the highest specificity available.
          (function () {
            document.querySelectorAll('table').forEach(function (t) {
              // The signature table manages its own borders — no outer box,
              // no collapse — so leave it out of the generic border forcing.
              if (t.classList && t.classList.contains('signature-table')) return;
              t.style.setProperty('border-collapse', 'collapse', 'important');
              t.style.setProperty('border', '1.5px solid #000', 'important');
            });
            document.querySelectorAll('table th, table td').forEach(function (cell) {
              if (cell.closest && cell.closest('.signature-table')) return;
              cell.style.setProperty('border', '1px solid #000', 'important');
              cell.style.setProperty('white-space', 'nowrap', 'important');
            });
            document.querySelectorAll('table th').forEach(function (th) {
              if (th.closest && th.closest('.signature-table')) return;
              th.style.setProperty('background', '#e5e7eb', 'important');
              th.style.setProperty('font-weight', '700', 'important');
            });
            // Preserve column highlighting in print (body cells only — headers stay plain)
            document.querySelectorAll('td.bg-slate-100').forEach(function (el) {
              el.style.setProperty('background', '#CFCFD1', 'important');
            });
            // Apply adaptive font/padding (CSS vars may be lost when forcing inline).
            var page = document.querySelector('.page');
            var baseFont = page ? getComputedStyle(page).getPropertyValue('--base-font').trim() : '';
            var rowPad = page ? getComputedStyle(page).getPropertyValue('--row-pad').trim() : '';
            if (baseFont) {
              document.querySelectorAll('table:not(.signature-table) th, table:not(.signature-table) td').forEach(function (cell) {
                cell.style.setProperty('font-size', baseFont, 'important');
              });
            }
            if (rowPad) {
              document.querySelectorAll('table:not(.signature-table) th, table:not(.signature-table) td').forEach(function (cell) {
                cell.style.setProperty('padding', rowPad, 'important');
              });
            }
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
