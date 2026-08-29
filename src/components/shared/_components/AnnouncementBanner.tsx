"use client";

import React, { useEffect, useState } from "react";
import { Megaphone, FileText } from "lucide-react";
import { getPublishedNotices } from "@/src/services/notice";
import { TQuery } from "@/src/types/query.types";

interface Notice {
  id: string;
  title: string;
  pdfUrl: string;
  isPublished: boolean;
}

export default function AnnouncementBanner() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      // This banner is public homepage UI, so we use the PUBLIC published-notices
      // endpoint (no auth needed) — same one the public student notices page uses.
      // NOTE: getNotices() (used in the admin panel) requires auth, so it can never
      // work here for anonymous visitors.
      const query: TQuery[] = [
        {
          key: "orderBy",
          value: JSON.stringify({ createdAt: "desc" }),
        },
        {
          key: "limit",
          value: "20",
        },
      ];

      const res = await getPublishedNotices(query);
      const data = res?.data?.data;

      if (Array.isArray(data)) {
        // This endpoint only ever returns published notices.
        setNotices(data as Notice[]);
      }
    };

    // Non-critical UI: never let API failures crash the banner/page.
    fetchNotices().catch(() => {
      // silent — banner simply renders without notices when the API is unreachable
    });
  }, []);

  const announcements = [
    'নতুন ব্যাচ শুরু হচ্ছে! ভর্তি চলছে। সীমিত আসন।',
    '📞 কল করুন: 01911-80 95 71',
  ];

  const pdfBase = process.env.NEXT_PUBLIC_API_URL;

  return (
    <>
      {/* Original announcement marquee */}
      <div className="w-full bg-orange-500 py-2.5">
        <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6">
          <div className="simple-marquee flex min-w-max items-center text-sm font-medium text-white">
            {[...announcements, ...announcements].map((announcement, index) => (
              <span key={`${announcement}-${index}`} className="mx-6 whitespace-nowrap">
                {announcement}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Notice marquee — only shown when published notices exist */}
      {notices.length > 0 && (
        <div className="w-full border-b border-slate-800 bg-blue-900">
          <div className="mx-auto flex max-w-7xl items-stretch px-4 sm:px-6">
            {/* Fixed label — anchors the row, doesn't scroll */}
            <div className="flex shrink-0 items-center gap-1.5 border-r border-slate-700/80 py-2.5 pr-3 sm:pr-4">
              <Megaphone size={14} className="shrink-0 text-orange-400" />
              <span className="hidden text-xs font-semibold uppercase tracking-wide text-orange-400 sm:inline">
                নোটিশ
              </span>
            </div>

            {/* Scrolling notices, faded at the edges */}
            <div
              className="relative flex-1 overflow-hidden py-2.5 pl-3 sm:pl-4"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)",
              }}
            >
              <div className="simple-marquee flex min-w-max items-center gap-2.5 text-sm">
                {[...notices, ...notices].map((notice, index) => (
                  <a
                    key={`${notice.id}-${index}`}
                    href={`${pdfBase}/notices/${notice.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-700 bg-slate-800/70 px-3.5 py-1.5 font-medium text-slate-100 transition-colors duration-150 hover:border-orange-400/60 hover:bg-slate-800 hover:text-orange-300"
                  >
                    <FileText size={13} className="shrink-0 text-orange-400" />
                    <span>{notice.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}